export interface JobFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  district: string;
  sourceType: "RSS" | "API" | "SCRAPER_LEAD";
  status: "ACTIVE" | "PAUSED" | "ERROR";
  lastSyncAt?: string;
  itemsIngestedCount: number;
  autoSyncIntervalMinutes: number;
}

export interface FeedSyncLog {
  id: string;
  feedId: string;
  feedName: string;
  syncedAt: string;
  itemsFound: number;
  itemsAdded: number;
  itemsDuplicate: number;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
  message: string;
}

export const PRECONFIGURED_FEEDS: JobFeed[] = [
  {
    id: "feed-itpro-all",
    name: "ITPro.lk All Tech Vacancies",
    url: "https://itpro.lk/rss/all/",
    category: "Information Technology",
    district: "Colombo",
    sourceType: "RSS",
    status: "ACTIVE",
    lastSyncAt: "2026-11-06T02:00:00Z",
    itemsIngestedCount: 42,
    autoSyncIntervalMinutes: 60,
  },
  {
    id: "feed-itpro-remote",
    name: "ITPro.lk Remote Jobs Sri Lanka",
    url: "https://itpro.lk/rss/location-remote/",
    category: "Information Technology",
    district: "Colombo",
    sourceType: "RSS",
    status: "ACTIVE",
    lastSyncAt: "2026-11-06T02:30:00Z",
    itemsIngestedCount: 18,
    autoSyncIntervalMinutes: 60,
  },
  {
    id: "feed-slbfe-overseas",
    name: "SLBFE Verified Foreign Jobs Feed",
    url: "https://www.slbfe.lk/feeds/approved-vacancies.xml",
    category: "Overseas Careers (SLBFE Verified)",
    district: "Colombo",
    sourceType: "RSS",
    status: "ACTIVE",
    lastSyncAt: "2026-11-05T20:00:00Z",
    itemsIngestedCount: 65,
    autoSyncIntervalMinutes: 120,
  },
  {
    id: "feed-apparel-leads",
    name: "Sri Lanka Apparel & Manufacturing Leads",
    url: "https://jobeelanka.com/leads/apparel-rss.xml",
    category: "Apparel & Manufacturing",
    district: "Gampaha",
    sourceType: "SCRAPER_LEAD",
    status: "ACTIVE",
    lastSyncAt: "2026-11-06T00:15:00Z",
    itemsIngestedCount: 29,
    autoSyncIntervalMinutes: 180,
  },
];

