import { Job, Employer } from "../jobs/types";
import { JobFeed, FeedSyncLog, PRECONFIGURED_FEEDS } from "./types";

let feedsStore: JobFeed[] = [...PRECONFIGURED_FEEDS];
let syncLogsStore: FeedSyncLog[] = [
  {
    id: "log-1",
    feedId: "feed-itpro-all",
    feedName: "ITPro.lk All Tech Vacancies",
    syncedAt: "2026-11-06T02:00:00Z",
    itemsFound: 15,
    itemsAdded: 4,
    itemsDuplicate: 11,
    status: "SUCCESS",
    message: "Synchronized 4 new listings. Deduplication skipped 11 existing records.",
  },
  {
    id: "log-2",
    feedId: "feed-slbfe-overseas",
    feedName: "SLBFE Verified Foreign Jobs Feed",
    syncedAt: "2026-11-05T20:00:00Z",
    itemsFound: 20,
    itemsAdded: 8,
    itemsDuplicate: 12,
    status: "SUCCESS",
    message: "Verified 8 new foreign vacancies from accredited SLBFE agencies.",
  },
];
const ingestedSourceKeys = new Set<string>();

export interface ParsedRssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category?: string;
  guid?: string;
  company?: string;
  location?: string;
  applyUrl?: string;
}

const htmlEntityMap: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeHtml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&#(x?[0-9a-f]+);/gi, (_, code: string) => {
      const parsed = code.toLowerCase().startsWith("x")
        ? parseInt(code.slice(1), 16)
        : parseInt(code, 10);
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : "";
    })
    .replace(/&([a-z]+);/gi, (_, name: string) => htmlEntityMap[name.toLowerCase()] || `&${name};`)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml: string, tagNames: string[]): string | undefined {
  for (const tag of tagNames) {
    const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return undefined;
}

function absoluteUrl(value: string | undefined, baseUrl: string): string {
  if (!value) return "";
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export function parseRssXml(xmlText: string, baseUrl = ""): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];
  const itemMatches = xmlText.match(/<(item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(item|entry)>/gi) || [];

  for (const itemXml of itemMatches) {
    const title = readTag(itemXml, ["title"]);
    if (!title) continue;

    const linkTag = itemXml.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
    const hrefTag = itemXml.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>(?:<\/link>)?/i);
    const rawLink = linkTag?.[1] || hrefTag?.[1] || "";
    const link = absoluteUrl(decodeHtml(rawLink), baseUrl);
    const description = readTag(itemXml, ["description", "content", "summary"]) || "";
    const pubDate = readTag(itemXml, ["pubDate", "published", "updated", "date"]) || new Date().toISOString();
    const guid = readTag(itemXml, ["guid", "id"]);

    items.push({
      title,
      link,
      applyUrl: link,
      description,
      pubDate,
      category: readTag(itemXml, ["category"]),
      guid,
      company: readTag(itemXml, ["company", "employer", "author"]),
      location: readTag(itemXml, ["location", "勤務地"]),
    });
  }

  return items;
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function findArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  for (const key of ["jobs", "items", "results", "data", "vacancies", "positions"]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [];
}

export function parseJsonJobs(body: string, baseUrl: string): ParsedRssItem[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return [];
  }

  return findArray(parsed).flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const title = asString(item.title || item.jobTitle || item.position || item.name);
    if (!title) return [];
    const link = absoluteUrl(
      asString(item.applyUrl || item.applicationUrl || item.url || item.link || item.href),
      baseUrl
    );
    return [{
      title,
      link,
      applyUrl: link,
      description: asString(item.description || item.summary || item.snippet),
      pubDate: asString(item.datePosted || item.publishedAt || item.published || item.createdAt) || new Date().toISOString(),
      company: asString(item.company || item.employer || (item.organization as Record<string, unknown> | undefined)?.name),
      location: asString(item.location || item.city || item.district),
      guid: asString(item.id || item.guid || link),
      category: asString(item.category || item.industry),
    }];
  });
}

export function parseJsonLdJobs(body: string, baseUrl: string): ParsedRssItem[] {
  const scripts = body.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  const output: ParsedRssItem[] = [];

  for (const script of scripts) {
    const raw = script.replace(/^<[\s\S]*?>|<\/script>$/gi, "").trim();
    try {
      const parsed = JSON.parse(raw) as unknown;
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      for (const candidate of candidates) {
        if (!candidate || typeof candidate !== "object") continue;
        const value = candidate as Record<string, unknown>;
        const type = value["@type"];
        if (type !== "JobPosting" && !(Array.isArray(type) && type.includes("JobPosting"))) continue;
        const hiringOrg = value.hiringOrganization as Record<string, unknown> | undefined;
        const jobLocation = value.jobLocation as Record<string, unknown> | Record<string, unknown>[] | undefined;
        const locationObject = Array.isArray(jobLocation) ? jobLocation[0] : jobLocation;
        const address = locationObject?.address as Record<string, unknown> | undefined;
        const link = absoluteUrl(asString(value.url), baseUrl);
        output.push({
          title: asString(value.title),
          link,
          applyUrl: link,
          description: asString(value.description),
          pubDate: asString(value.datePosted) || new Date().toISOString(),
          guid: asString(value.identifier || link || value.title),
          company: asString(hiringOrg?.name),
          location: asString(address?.addressLocality || address?.addressRegion || address?.addressCountry),
          category: asString(value.occupationalCategory),
        });
      }
    } catch {
      // Ignore malformed JSON-LD blocks and continue parsing other blocks.
    }
  }

  return output.filter((item) => item.title);
}

async function fetchSourceItems(feed: JobFeed): Promise<ParsedRssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/json, text/html;q=0.9, */*;q=0.8",
        "User-Agent": "JobeeLankaJobDirectory/1.0 (+https://jobeelanka.vercel.app/about)",
      },
    });
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    const body = await response.text();
    const contentType = response.headers.get("content-type")?.toLowerCase() || "";

    if (contentType.includes("json") || feed.sourceType === "API") {
      const jsonItems = parseJsonJobs(body, feed.url);
      if (jsonItems.length) return jsonItems;
    }

    const rssItems = parseRssXml(body, feed.url);
    if (rssItems.length) return rssItems;

    const jsonLdItems = parseJsonLdJobs(body, feed.url);
    if (jsonLdItems.length) return jsonLdItems;

    throw new Error("No supported RSS, Atom, JSON API, or JobPosting JSON-LD records were found");
  } finally {
    clearTimeout(timeout);
  }
}

function sourceKey(item: ParsedRssItem, feed: JobFeed): string {
  return (item.guid || item.link || `${feed.id}:${item.title}`).trim().toLowerCase();
}

function sourceEmployer(feed: JobFeed, item: ParsedRssItem): Employer {
  let hostname = "source-site";
  try {
    hostname = new URL(item.link || feed.url).hostname.replace(/^www\./, "");
  } catch {
    // Keep a neutral source label for malformed URLs; the item will still be reviewable.
  }
  const displayName = item.company || hostname;
  const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "source-site";
  return {
    id: `source-${slug}`,
    slug,
    legalName: displayName,
    displayName,
    logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=128&auto=format&fit=crop&q=80",
    district: item.location || feed.district || "Colombo",
    website: item.link || feed.url,
    verifiedDomain: hostname,
    verificationStatus: "PENDING",
    isFeatured: false,
    about: `Source employer detected from ${feed.name}. Verify the employer before featuring this listing.`,
  };
}

export const FeedIngestionService = {
  getAllFeeds(): JobFeed[] {
    return feedsStore;
  },

  hydrateFeeds(feeds: JobFeed[]): void {
    if (feeds.length > 0) feedsStore = feeds;
  },

  getActiveFeeds(): JobFeed[] {
    return feedsStore.filter((feed) => feed.status === "ACTIVE");
  },

  getFeedById(id: string): JobFeed | undefined {
    return feedsStore.find((f) => f.id === id);
  },

  addFeed(feedData: Omit<JobFeed, "id" | "itemsIngestedCount">): JobFeed {
    const newFeed: JobFeed = { id: `feed-${Date.now()}`, itemsIngestedCount: 0, ...feedData };
    feedsStore.unshift(newFeed);
    return newFeed;
  },

  deleteFeed(id: string): boolean {
    const lenBefore = feedsStore.length;
    feedsStore = feedsStore.filter((f) => f.id !== id);
    return feedsStore.length < lenBefore;
  },

  getSyncLogs(): FeedSyncLog[] {
    return syncLogsStore;
  },

  async syncFeed(feedId: string): Promise<{ addedJobs: Job[]; log: FeedSyncLog }> {
    const feed = feedsStore.find((f) => f.id === feedId);
    if (!feed) throw new Error("Feed not found");

    let items: ParsedRssItem[];
    try {
      items = await fetchSourceItems(feed);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Source could not be read";
      feed.status = "ERROR";
      const log: FeedSyncLog = {
        id: `log-${Date.now()}`,
        feedId: feed.id,
        feedName: feed.name,
        syncedAt: new Date().toISOString(),
        itemsFound: 0,
        itemsAdded: 0,
        itemsDuplicate: 0,
        status: "FAILED",
        message,
      };
      syncLogsStore.unshift(log);
      return { addedJobs: [], log };
    }

    const knownKeys = new Set<string>();
    const newJobs: Job[] = [];
    let duplicates = 0;

    for (const item of items) {
      const key = sourceKey(item, feed);
      if (!key || knownKeys.has(key) || ingestedSourceKeys.has(key)) {
        duplicates += 1;
        continue;
      }
      knownKeys.add(key);
      ingestedSourceKeys.add(key);

      const employer = sourceEmployer(feed, item);
      const applyUrl = item.applyUrl || item.link || feed.url;
      const cleanDescription = item.description || `Vacancy imported from ${feed.name}.`;
      const slugBase = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const job: Job = {
        id: `feed-job-${Date.now()}-${newJobs.length}`,
        code: `FEED-${Date.now().toString(36).toUpperCase()}-${newJobs.length}`,
        slug: `${slugBase || "imported-job"}-${Date.now().toString().slice(-5)}`,
        title: item.title,
        employer,
        listingType: "partner_feed",
        status: "INACTIVE",
        industry: item.category || feed.category || "Information Technology",
        shortSnippet: cleanDescription.slice(0, 240),
        descriptionHtml: `<p>${cleanDescription.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
        responsibilities: [],
        qualifications: [],
        requiredSkills: [],
        employmentType: "FULL_TIME",
        workMode: /remote/i.test(`${feed.name} ${item.title} ${item.location || ""}`) ? "REMOTE" : "ONSITE",
        district: item.location || feed.district || "Colombo",
        city: item.location || feed.district || "Colombo",
        country: "LK",
        salaryCurrency: "LKR",
        salaryPeriod: "MONTH",
        isSalaryDisclosed: false,
        sourceType: feed.sourceType === "API" ? "PARTNER_RSS" : "PARTNER_RSS",
        sourceName: feed.name,
        sourceUrl: item.link || feed.url,
        applyUrl,
        applicationUrl: applyUrl,
        directApplyAllowed: true,
        permissionStatus: "PENDING",
        datePosted: item.pubDate || new Date().toISOString(),
        lastCheckedAt: new Date().toISOString(),
        validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false,
        viewsCount: 0,
        applicationsCount: 0,
      };
      newJobs.push(job);
    }

    feed.status = "ACTIVE";
    feed.lastSyncAt = new Date().toISOString();
    feed.itemsIngestedCount += newJobs.length;

    const log: FeedSyncLog = {
      id: `log-${Date.now()}`,
      feedId: feed.id,
      feedName: feed.name,
      syncedAt: new Date().toISOString(),
      itemsFound: items.length,
      itemsAdded: newJobs.length,
      itemsDuplicate: duplicates,
      status: "SUCCESS",
      message: `Found ${items.length} source records, imported ${newJobs.length}, skipped ${duplicates} duplicates. New imports are awaiting moderation.`,
    };
    syncLogsStore.unshift(log);
    return { addedJobs: newJobs, log };
  },
};
