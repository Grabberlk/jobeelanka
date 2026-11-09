import { getSupabaseAdminClient } from "@/lib/supabase";
import { Job, Employer } from "../jobs/types";
import { FeedSyncLog, JobFeed } from "./types";

function mapFeed(row: Record<string, any>): JobFeed {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    category: row.category || "Information Technology",
    district: row.district || "Colombo",
    sourceType: row.source_type || "RSS",
    status: row.status || "ACTIVE",
    trustLevel: row.trust_level || "MANUAL",
    autoPublish: Boolean(row.auto_publish),
    lastDiscoveryAt: row.last_discovery_at || undefined,
    lastDiscoveryStatus: row.last_discovery_status || undefined,
    lastSyncAt: row.last_sync_at || undefined,
    itemsIngestedCount: Number(row.items_ingested_count || 0),
    autoSyncIntervalMinutes: Number(row.auto_sync_interval_minutes || 60),
  };
}

export async function loadPersistentFeeds(): Promise<JobFeed[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  const { data, error } = await client.from("job_feeds").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load feeds: ${error.message}`);
  return (data || []).map(mapFeed);
}

export async function loadPersistentSyncLogs(): Promise<FeedSyncLog[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  const { data, error } = await client.from("feed_sync_logs").select("*").order("synced_at", { ascending: false }).limit(100);
  if (error) throw new Error(`Could not load sync logs: ${error.message}`);
  return (data || []).map((row: Record<string, any>) => ({
    id: row.id,
    feedId: row.feed_id,
    feedName: row.feed_name,
    syncedAt: row.synced_at,
    itemsFound: Number(row.items_found || 0),
    itemsAdded: Number(row.items_added || 0),
    itemsDuplicate: Number(row.items_duplicate || 0),
    status: row.status,
    message: row.message,
  }));
}

export async function persistFeed(feed: JobFeed): Promise<void> {
  const client = getSupabaseAdminClient();
  if (!client) return;
  const { error } = await client.from("job_feeds").upsert({
    id: feed.id,
    name: feed.name,
    url: feed.url,
    category: feed.category,
    district: feed.district,
    source_type: feed.sourceType,
    status: feed.status,
    trust_level: feed.trustLevel || "MANUAL",
    auto_publish: Boolean(feed.autoPublish),
    last_discovery_at: feed.lastDiscoveryAt || null,
    last_discovery_status: feed.lastDiscoveryStatus || null,
    last_sync_at: feed.lastSyncAt || null,
    items_ingested_count: feed.itemsIngestedCount,
    auto_sync_interval_minutes: feed.autoSyncIntervalMinutes,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });
  if (error) throw new Error(`Could not persist feed: ${error.message}`);
}

export async function removePersistentFeed(id: string): Promise<void> {
  const client = getSupabaseAdminClient();
  if (!client) return;
  const { error } = await client.from("job_feeds").delete().eq("id", id);
  if (error) throw new Error(`Could not remove feed: ${error.message}`);
}

export interface SourceCandidate {
  url: string;
  name: string;
  category?: string;
  district?: string;
}

function canonicalSourceUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    for (const key of Array.from(url.searchParams.keys())) {
      if (/^(utm_|gclid|fbclid|_gl)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return null;
  }
}

function sourceUrlForDiscovery(value: string): string | null {
  const canonical = canonicalSourceUrl(value);
  if (!canonical) return null;
  try {
    const url = new URL(canonical);
    const path = url.pathname.toLowerCase();
    const isStructured = /(?:rss|atom|feed|\.xml$|\.json$|\/api(?:\/|$))/.test(path);
    if (isStructured || /(?:careers?|vacanc(?:y|ies)|recruit|employment|join-us)/.test(path)) return canonical;
    return `${url.origin}/`;
  } catch {
    return canonical;
  }
}

export async function loadSourceCandidates(): Promise<SourceCandidate[]> {
  const client = getSupabaseAdminClient();
  const candidates = new Map<string, SourceCandidate>();
  const add = (raw: unknown, name: string, category?: string, district?: string) => {
    if (typeof raw !== "string") return;
    const url = canonicalSourceUrl(raw);
    if (!url || /jobeelanka\.(vercel\.app|com)/i.test(url)) return;
    const key = url.toLowerCase();
    if (!candidates.has(key)) candidates.set(key, { url, name, category, district });
  };

  if (!client) return [];
  const [{ data: employers, error: employerError }, { data: jobs, error: jobError }] = await Promise.all([
    client.from("employers").select("display_name,website,district"),
    client.from("jobs").select("source_name,source_url,industry,district"),
  ]);
  if (employerError) throw new Error(`Could not load employer source links: ${employerError.message}`);
  if (jobError) throw new Error(`Could not load job source links: ${jobError.message}`);
  for (const row of employers || []) add(row.website, row.display_name || "Employer website", undefined, row.district);
  for (const row of jobs || []) {
    const discoveryUrl = typeof row.source_url === "string" ? sourceUrlForDiscovery(row.source_url) : null;
    add(discoveryUrl, row.source_name || "Job source", row.industry, row.district);
  }
  return Array.from(candidates.values());
}

export async function persistSyncLog(log: FeedSyncLog): Promise<void> {
  const client = getSupabaseAdminClient();
  if (!client) return;
  const { error } = await client.from("feed_sync_logs").upsert({
    id: log.id,
    feed_id: log.feedId,
    feed_name: log.feedName,
    synced_at: log.syncedAt,
    items_found: log.itemsFound,
    items_added: log.itemsAdded,
    items_duplicate: log.itemsDuplicate,
    status: log.status,
    message: log.message,
  }, { onConflict: "id" });
  if (error) throw new Error(`Could not persist sync log: ${error.message}`);
}

function employerRow(employer: Employer) {
  return {
    id: employer.id,
    slug: employer.slug,
    legal_name: employer.legalName || employer.displayName,
    display_name: employer.displayName,
    logo: employer.logo || "",
    district: employer.district || "Colombo",
    website: employer.website || "",
    verified_domain: employer.verifiedDomain || "",
    official_whatsapp: employer.officialWhatsApp || null,
    slbfe_license_number: employer.slbfeLicenseNumber || null,
    verification_status: employer.verificationStatus || "PENDING",
    is_featured: Boolean(employer.isFeatured),
    about: employer.about || "",
  };
}

function jobRow(job: Job) {
  return {
    id: job.id,
    code: job.code || `JL${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    slug: job.slug,
    title: job.title,
    employer_id: job.employer?.id || null,
    industry: job.industry || "Information Technology",
    listing_type: job.listingType || "partner_feed",
    city: job.city || "Colombo",
    district: job.district || "Colombo",
    country: job.country || "LK",
    work_mode: job.workMode || "ONSITE",
    employment_type: job.employmentType || "FULL_TIME",
    salary_min: job.salaryMin || null,
    salary_max: job.salaryMax || null,
    salary_currency: job.salaryCurrency || "LKR",
    salary_period: job.salaryPeriod || "MONTH",
    is_salary_disclosed: Boolean(job.isSalaryDisclosed),
    short_snippet: job.shortSnippet || "",
    description_html: job.descriptionHtml || "",
    responsibilities: job.responsibilities || [],
    qualifications: job.qualifications || [],
    required_skills: job.requiredSkills || [],
    date_posted: job.datePosted || new Date().toISOString(),
    valid_through: job.validThrough || null,
    last_checked_at: job.lastCheckedAt || new Date().toISOString(),
    views_count: job.viewsCount || 0,
    featured: Boolean(job.featured),
    status: job.status || "INACTIVE",
    permission_status: job.permissionStatus || "PENDING",
    source_type: job.sourceType || "PARTNER_RSS",
    source_name: job.sourceName || null,
    source_url: job.sourceUrl || null,
    application_url: job.applicationUrl || job.applyUrl || job.sourceUrl || "https://jobeelanka.vercel.app",
    apply_url: job.applyUrl || null,
    apply_email: job.applyEmail || null,
    apply_whatsapp: job.applyWhatsApp || null,
    show_whatsapp: Boolean(job.showWhatsApp),
    show_email: Boolean(job.showEmail),
    show_phone: Boolean(job.showPhone),
    applications_count: job.applicationsCount || 0,
    updated_at: new Date().toISOString(),
  };
}

export async function persistImportedJobs(jobs: Job[]): Promise<void> {
  const client = getSupabaseAdminClient();
  if (!client || jobs.length === 0) return;
  const employers = Array.from(new Map(jobs.map((job) => [job.employer.id, job.employer])).values());
  const { error: employerError } = await client.from("employers").upsert(employers.map(employerRow), { onConflict: "id" });
  if (employerError) throw new Error(`Could not persist imported employers: ${employerError.message}`);
  const { error: jobError } = await client.from("jobs").upsert(jobs.map(jobRow), { onConflict: "id" });
  if (jobError) throw new Error(`Could not persist imported jobs: ${jobError.message}`);
}

function mapDatabaseJob(row: Record<string, any>): Job {
  const employerRow = Array.isArray(row.employers) ? row.employers[0] : row.employers;
  const employer: Employer = {
    id: employerRow?.id || row.employer_id || `employer-${row.id}`,
    slug: employerRow?.slug || String(employerRow?.display_name || row.source_name || "employer").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    legalName: employerRow?.legal_name || employerRow?.display_name || row.source_name || "Employer",
    displayName: employerRow?.display_name || row.source_name || "Employer",
    logo: employerRow?.logo || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=128&auto=format&fit=crop&q=80",
    district: employerRow?.district || row.district || "Colombo",
    website: employerRow?.website || row.source_url || row.application_url || "",
    verifiedDomain: employerRow?.verified_domain || "",
    officialWhatsApp: employerRow?.official_whatsapp || undefined,
    slbfeLicenseNumber: employerRow?.slbfe_license_number || undefined,
    verificationStatus: employerRow?.verification_status || "PENDING",
    isFeatured: Boolean(employerRow?.is_featured),
    about: employerRow?.about || "",
  };
  return {
    id: row.id,
    code: row.code,
    slug: row.slug,
    title: row.title,
    employer,
    listingType: row.listing_type || "vacancy",
    status: row.status || "ACTIVE",
    industry: row.industry || "Information Technology",
    shortSnippet: row.short_snippet || "",
    descriptionHtml: row.description_html || "",
    responsibilities: row.responsibilities || [],
    qualifications: row.qualifications || [],
    requiredSkills: row.required_skills || [],
    employmentType: row.employment_type || "FULL_TIME",
    workMode: row.work_mode || "ONSITE",
    district: row.district || "Colombo",
    city: row.city || row.district || "Colombo",
    country: row.country || "LK",
    salaryMin: row.salary_min || undefined,
    salaryMax: row.salary_max || undefined,
    salaryCurrency: row.salary_currency || "LKR",
    salaryPeriod: row.salary_period || "MONTH",
    isSalaryDisclosed: Boolean(row.is_salary_disclosed),
    sourceType: row.source_type || "FIRST_PARTY",
    sourceName: row.source_name || undefined,
    sourceUrl: row.source_url || undefined,
    applyUrl: row.apply_url || row.application_url || row.source_url,
    applicationUrl: row.application_url || row.apply_url || row.source_url,
    applyEmail: row.apply_email || undefined,
    applyWhatsApp: row.apply_whatsapp || undefined,
    showWhatsApp: Boolean(row.show_whatsapp),
    showEmail: Boolean(row.show_email),
    showPhone: Boolean(row.show_phone),
    directApplyAllowed: true,
    datePosted: row.date_posted || row.created_at || new Date().toISOString(),
    lastCheckedAt: row.last_checked_at || undefined,
    permissionStatus: row.permission_status || "APPROVED",
    validThrough: row.valid_through || new Date(Date.now() + 30 * 86400000).toISOString(),
    featured: Boolean(row.featured),
    viewsCount: Number(row.views_count || 0),
    applicationsCount: Number(row.applications_count || 0),
  };
}

export async function loadPersistentJobs(includeInactive = false): Promise<Job[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  let query = client.from("jobs").select("*, employers(*)");
  if (!includeInactive) query = query.eq("status", "ACTIVE").eq("permission_status", "APPROVED");
  const { data, error } = await query.order("date_posted", { ascending: false });
  if (error) throw new Error(`Could not load persistent jobs: ${error.message}`);
  return (data || []).map(mapDatabaseJob);
}

export async function getPendingModerationItems(): Promise<any[] | null> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  const { data, error } = await client
    .from("jobs")
    .select("id,title,status,permission_status,created_at,source_name,source_url,application_url,employers(display_name,verification_status)")
    .eq("permission_status", "PENDING")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load moderation queue: ${error.message}`);
  return data || [];
}

export async function moderateJob(id: string, decision: "APPROVE" | "REJECT", note?: string): Promise<any> {
  const client = getSupabaseAdminClient();
  if (!client) return null;
  const update = {
    permission_status: decision === "APPROVE" ? "APPROVED" : "REJECTED",
    status: decision === "APPROVE" ? "ACTIVE" : "INACTIVE",
    moderation_note: note || null,
    moderated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client.from("jobs").update(update).eq("id", id).select("*").single();
  if (error) throw new Error(`Could not update moderation status: ${error.message}`);
  return data;
}

export async function archiveExpiredDatabaseJobs(): Promise<number> {
  const client = getSupabaseAdminClient();
  if (!client) return 0;
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("jobs")
    .update({ status: "INACTIVE", updated_at: now })
    .eq("status", "ACTIVE")
    .lt("valid_through", now)
    .select("id");
  if (error) {
    console.warn("Could not archive expired jobs in database:", error.message);
    return 0;
  }
  return data?.length || 0;
}
