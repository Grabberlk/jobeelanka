import { AnalysisReport, AnalyzedJobPreview, SourceDiscoveryMetadata, SourceTrustLevel } from "../types";
import { parseRssXml, parseJsonLdJobs, parseJsonJobs, ParsedRssItem } from "../rss-parser";
import { UndpAdapter } from "./adapters/undp-adapter";
import { extractAiJobs } from "./ai-extractor";
import { JobRepository } from "@/modules/jobs/repository";

function extractDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "unknown-source";
  }
}

function detectAts(html: string): string | undefined {
  if (/myworkdayjobs\.com/i.test(html)) return "Workday";
  if (/boards\.greenhouse\.io|greenhouse\.io/i.test(html)) return "Greenhouse";
  if (/jobs\.lever\.co|lever\.co/i.test(html)) return "Lever";
  if (/partneragencies\.net|oraclecloud\.com|taleo\.net/i.test(html)) return "Oracle Cloud / Taleo";
  if (/smartrecruiters\.com/i.test(html)) return "SmartRecruiters";
  return undefined;
}

function detectRssLinks(html: string, baseUrl: string): string[] {
  const feeds: string[] = [];
  const linkMatches = html.match(/<link[^>]+(?:type=["']application\/(?:rss|atom)\+xml["']|rel=["']alternate["'])[^>]*>/gi) || [];

  for (const tag of linkMatches) {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      try {
        const full = new URL(hrefMatch[1], baseUrl).toString();
        if (!feeds.includes(full)) feeds.push(full);
      } catch {
        // ignore malformed
      }
    }
  }

  // Also check common direct feed anchors
  const anchorFeedMatches = html.match(/<a[^>]+href=["']([^"']*(?:\.rss|\.xml|\/feed\/?|\/rss\/?))["']/gi) || [];
  for (const aTag of anchorFeedMatches) {
    const hrefMatch = aTag.match(/href=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      try {
        const full = new URL(hrefMatch[1], baseUrl).toString();
        if (!feeds.includes(full)) feeds.push(full);
      } catch {
        // ignore
      }
    }
  }

  return feeds;
}

export const SourceAnalyzerService = {
  async analyzeSource(targetUrl: string): Promise<AnalysisReport> {
    const domain = extractDomain(targetUrl);
    let trustLevel: SourceTrustLevel = "MANUAL";

    if (/slbfe\.lk|gov\.lk/i.test(domain)) {
      trustLevel = "TRUSTED_EMPLOYER";
    } else if (/itpro\.lk|topjobs\.lk/i.test(domain)) {
      trustLevel = "PARTNER_FEED";
    }

    // 1. Fetch source page with browser-grade headers (avoids HTTP 406 on Cloudflare/Sysco)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let body = "";
    let contentType = "";
    let status = 200;

    try {
      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml,application/json,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 JobeeLankaBot/2.0 (+https://jobeelanka.vercel.app/about)",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      status = response.status;
      contentType = response.headers.get("content-type")?.toLowerCase() || "";
      body = await response.text();
    } catch (err: any) {
      clearTimeout(timeout);
      return {
        inputUrl: targetUrl,
        targetDomain: domain,
        strategyUsed: "NONE",
        overallConfidence: 0,
        totalFound: 0,
        validApplicationLinksCount: 0,
        duplicateCount: 0,
        incompleteCount: 0,
        trustLevel,
        discoveryMetadata: { detectedFeeds: [], hasJsonLd: false },
        jobs: [],
        recommendedAction: `Could not connect to URL (${err.message || "Network Error"}). Verify URL accessibility or check if firewall blocks requests.`,
      };
    } finally {
      clearTimeout(timeout);
    }

    if (status >= 400) {
      return {
        inputUrl: targetUrl,
        targetDomain: domain,
        strategyUsed: "NONE",
        overallConfidence: 0,
        totalFound: 0,
        validApplicationLinksCount: 0,
        duplicateCount: 0,
        incompleteCount: 0,
        trustLevel,
        discoveryMetadata: { detectedFeeds: [], hasJsonLd: false },
        jobs: [],
        recommendedAction: `Destination server returned HTTP ${status}. Configure a verified adapter or add direct RSS feed link.`,
      };
    }

    // 2. Discover metadata (Feeds, ATS, JSON-LD)
    const detectedFeeds = detectRssLinks(body, targetUrl);
    const detectedAts = detectAts(body);
    const hasJsonLd = /"@type"\s*:\s*"JobPosting"|'JobPosting'/i.test(body);

    const discoveryMetadata: SourceDiscoveryMetadata = {
      detectedFeeds,
      detectedAtsProvider: detectedAts,
      hasJsonLd,
      resolvedFinalUrl: targetUrl,
    };

    let jobs: AnalyzedJobPreview[] = [];
    let strategyUsed: AnalysisReport["strategyUsed"] = "NONE";
    let overallConfidence = 0;

    // Strategy 1: Is the URL itself a direct RSS / Atom payload?
    if (contentType.includes("xml") || /<rss|<feed[\s>]/i.test(body)) {
      const parsedRss = parseRssXml(body, targetUrl);
      if (parsedRss.length > 0) {
        strategyUsed = "RSS_FEED";
        overallConfidence = 96;
        jobs = parsedRss.map((item) => ({
          tempId: `rss-${Math.random().toString(36).slice(2, 9)}`,
          title: item.title,
          company: item.company || domain,
          location: item.location || "Colombo, Sri Lanka",
          district: "Colombo",
          workMode: /remote/i.test(`${item.title} ${item.location || ""}`) ? "REMOTE" : "ONSITE",
          employmentType: "FULL_TIME",
          industry: item.category || "Information Technology",
          applyUrl: item.applyUrl || item.link || targetUrl,
          sourceUrl: item.link || targetUrl,
          shortSnippet: (item.description || item.title).slice(0, 240),
          postedDate: item.pubDate,
          confidenceScore: 96,
          detectionStrategy: "RSS_FEED",
          isDuplicate: false,
          missingFields: [],
        }));
      }
    }

    // Strategy 2: Direct JSON API payload
    if (jobs.length === 0 && (contentType.includes("json") || body.trim().startsWith("{") || body.trim().startsWith("["))) {
      const parsedJson = parseJsonJobs(body, targetUrl);
      if (parsedJson.length > 0) {
        strategyUsed = "JSON_LD";
        overallConfidence = 94;
        jobs = parsedJson.map((item: ParsedRssItem) => ({
          tempId: `api-${Math.random().toString(36).slice(2, 9)}`,
          title: item.title,
          company: item.company || domain,
          location: item.location || "Colombo, Sri Lanka",
          district: "Colombo",
          workMode: /remote/i.test(item.title) ? "REMOTE" : "ONSITE",
          employmentType: "FULL_TIME",
          industry: item.category || "Information Technology",
          applyUrl: item.applyUrl || item.link || targetUrl,
          sourceUrl: item.link || targetUrl,
          shortSnippet: (item.description || item.title).slice(0, 240),
          confidenceScore: 94,
          detectionStrategy: "JSON_LD",
          isDuplicate: false,
          missingFields: [],
        }));
      }
    }

    // Strategy 3: Dedicated UNDP Adapter
    if (jobs.length === 0 && UndpAdapter.canHandle(targetUrl, body)) {
      const parsedUndp = UndpAdapter.parse(body, targetUrl);
      if (parsedUndp.length > 0) {
        strategyUsed = "ADAPTER_UNDP";
        overallConfidence = 95;
        jobs = parsedUndp;
      }
    }

    // Strategy 4: Embedded Schema.org JobPosting JSON-LD inside HTML page
    if (jobs.length === 0 && hasJsonLd) {
      const parsedLd = parseJsonLdJobs(body, targetUrl);
      if (parsedLd.length > 0) {
        strategyUsed = "JSON_LD";
        overallConfidence = 95;
        jobs = parsedLd.map((item: ParsedRssItem) => ({
          tempId: `ld-${Math.random().toString(36).slice(2, 9)}`,
          title: item.title,
          company: item.company || domain,
          location: item.location || "Colombo, Sri Lanka",
          district: "Colombo",
          workMode: /remote/i.test(item.title) ? "REMOTE" : "ONSITE",
          employmentType: "FULL_TIME",
          industry: item.category || "Corporate Careers",
          applyUrl: item.applyUrl || item.link || targetUrl,
          sourceUrl: item.link || targetUrl,
          shortSnippet: (item.description || item.title).slice(0, 240),
          confidenceScore: 95,
          detectionStrategy: "JSON_LD",
          isDuplicate: false,
          missingFields: [],
        }));
      }
    }

    // Strategy 5: AI & Semantic DOM Heuristic Fallback
    if (jobs.length === 0) {
      const fallbackJobs = await extractAiJobs(body, targetUrl, domain);
      if (fallbackJobs.length > 0) {
        jobs = fallbackJobs;
        strategyUsed = fallbackJobs[0].detectionStrategy;
        overallConfidence = fallbackJobs[0].confidenceScore;
      }
    }

    // 3. Deduplication against Master Catalog (1,131 jobs)
    const existingJobs = JobRepository.getAllJobs(true);
    let duplicateCount = 0;
    let incompleteCount = 0;

    for (const job of jobs) {
      // Validate application link
      const hasValidLink = Boolean(job.applyUrl && job.applyUrl.startsWith("http"));
      if (!hasValidLink) {
        job.missingFields.push("applyUrl");
        incompleteCount += 1;
      }

      // Check duplicates by exact URL, or matching title + company
      const urlMatch = existingJobs.find(
        (ej) =>
          ej.sourceUrl === job.applyUrl ||
          ej.applyUrl === job.applyUrl ||
          ej.applicationUrl === job.applyUrl
      );
      const titleMatch = existingJobs.find(
        (ej) =>
          ej.title.toLowerCase().trim() === job.title.toLowerCase().trim() &&
          (ej.employer.displayName.toLowerCase().includes(domain.toLowerCase()) ||
            domain.toLowerCase().includes(ej.employer.slug.toLowerCase()))
      );

      if (urlMatch || titleMatch) {
        const matched = urlMatch || titleMatch;
        job.isDuplicate = true;
        job.duplicateReason = `Already in catalog: "${matched?.title}" (${matched?.code || matched?.id})`;
        duplicateCount += 1;
      }
    }

    const validApplicationLinksCount = jobs.filter(
      (j) => j.applyUrl && j.applyUrl.startsWith("http") && !j.isDuplicate
    ).length;

    let recommendedAction = "Review extracted listings in preview modal, then click 'Import as Pending'.";
    if (jobs.length === 0) {
      recommendedAction =
        "No structured vacancies found. Ensure URL points directly to vacancies table or register official RSS feed.";
    } else if (duplicateCount === jobs.length) {
      recommendedAction = "All detected vacancies already exist in JobeeLanka catalog.";
    }

    return {
      inputUrl: targetUrl,
      targetDomain: domain,
      strategyUsed,
      overallConfidence,
      totalFound: jobs.length,
      validApplicationLinksCount,
      duplicateCount,
      incompleteCount,
      trustLevel,
      discoveryMetadata,
      jobs,
      recommendedAction,
    };
  },
};
