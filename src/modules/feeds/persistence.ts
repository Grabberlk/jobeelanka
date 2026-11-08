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
