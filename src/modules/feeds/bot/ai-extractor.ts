import { AnalyzedJobPreview } from "../types";

function cleanText(val: string): string {
  return val
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Heuristic DOM Card Extractor
 * Extracts vacancies from structured HTML containers (.job, .vacancy, article, etc.)
 */
export function extractHeuristicJobs(html: string, baseUrl: string, companyName: string): AnalyzedJobPreview[] {
  const jobs: AnalyzedJobPreview[] = [];

  // Match typical vacancy card containers
  const cardMatches =
    html.match(/<(?:article|div|li)[^>]*(?:class|id)=["'][^"']*(?:job|vacancy|career|position|opening)[^"']*["'][^>]*>[\s\S]*?<\/(?:article|div|li)>/gi) || [];

  for (const card of cardMatches) {
    // Title is usually an h2, h3, h4, or strong link
    const titleMatch =
      card.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i) ||
      card.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);

    if (!titleMatch) continue;

    const rawTitle = cleanText(titleMatch[1] || titleMatch[2]);
    if (!rawTitle || rawTitle.length < 4 || rawTitle.length > 100) continue;
    if (/all jobs|careers|search|filter|subscribe|apply now|read more/i.test(rawTitle)) continue;

    // Link
    const linkMatch = card.match(/<a[^>]+href=["']([^"']+)["']/i);
    let applyUrl = baseUrl;
    if (linkMatch && linkMatch[1]) {
      try {
        applyUrl = new URL(linkMatch[1], baseUrl).toString();
      } catch {
        applyUrl = linkMatch[1];
      }
    }

    const textSnippet = cleanText(card).slice(0, 240);
    const isRemote = /remote|work from home|hybrid/i.test(card);
    const district = /kandy/i.test(card) ? "Kandy" : /galle/i.test(card) ? "Galle" : "Colombo";

    jobs.push({
      tempId: `heuristic-${Math.random().toString(36).slice(2, 9)}`,
      title: rawTitle,
      company: companyName,
      location: isRemote ? "Remote / Sri Lanka" : `${district}, Sri Lanka`,
      district,
      workMode: isRemote ? "REMOTE" : "ONSITE",
      employmentType: /intern/i.test(rawTitle) ? "INTERNSHIP" : /part-time|part time/i.test(card) ? "PART_TIME" : "FULL_TIME",
      industry: "Corporate & Enterprise",
      applyUrl,
      sourceUrl: applyUrl,
      shortSnippet: textSnippet || `Opportunity at ${companyName}: ${rawTitle}.`,
      confidenceScore: 78,
      detectionStrategy: "HTML_DOM",
      isDuplicate: false,
      missingFields: [],
    });
  }

  return jobs;
}

/**
 * AI Schema Fallback Extractor
 * If GEMINI_API_KEY or OPENAI_API_KEY is available, extracts JSON vacancies.
 * Falls back to heuristic card extraction otherwise.
 */
export async function extractAiJobs(
  htmlText: string,
  baseUrl: string,
  companyName: string
): Promise<AnalyzedJobPreview[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Zero dependency offline mode: run heuristic DOM extractor
    return extractHeuristicJobs(htmlText, baseUrl, companyName);
  }

  try {
    const textSample = cleanText(htmlText).slice(0, 12000);
    const prompt = `Extract all job vacancies listed in the text below from company "${companyName}" (Source URL: ${baseUrl}).
Return ONLY valid JSON with this exact schema:
{
  "jobs": [
    {
      "title": "Job title",
      "company": "${companyName}",
      "location": "City or Sri Lanka",
      "workMode": "ONSITE" | "HYBRID" | "REMOTE",
      "employmentType": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
      "industry": "Industry sector",
      "applyUrl": "Application or vacancy URL",
      "shortSnippet": "Brief 1-2 sentence description"
    }
  ]
}
Text to extract from:
${textSample}`;

    let jsonResponseText = "";

    if (process.env.GEMINI_API_KEY) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      if (res.ok) {
        const data = await res.json();
        jsonResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    }

    if (jsonResponseText) {
      const parsed = JSON.parse(jsonResponseText);
      if (Array.isArray(parsed.jobs) && parsed.jobs.length > 0) {
        return parsed.jobs.map((item: any) => ({
          tempId: `ai-${Math.random().toString(36).slice(2, 9)}`,
          title: item.title,
          company: item.company || companyName,
          location: item.location || "Colombo, Sri Lanka",
          district: /kandy/i.test(item.location) ? "Kandy" : "Colombo",
          workMode: item.workMode || "ONSITE",
          employmentType: item.employmentType || "FULL_TIME",
          industry: item.industry || "Information Technology",
          applyUrl: item.applyUrl || baseUrl,
          sourceUrl: item.applyUrl || baseUrl,
          shortSnippet: item.shortSnippet || `Extracted listing for ${item.title} at ${companyName}.`,
          confidenceScore: 82,
          detectionStrategy: "AI_ASSISTED" as const,
          isDuplicate: false,
          missingFields: [],
        }));
      }
    }
  } catch (err) {
    console.warn("AI extraction fallback failed, using DOM heuristics:", err);
  }

  return extractHeuristicJobs(htmlText, baseUrl, companyName);
}
