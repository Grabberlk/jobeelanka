-- Persistent ingestion and moderation layer for JobeeLanka.
-- Apply after 20261107_init_jobeelanka.sql.

alter table public.jobs add column if not exists permission_status text not null default 'APPROVED';
alter table public.jobs add column if not exists last_checked_at timestamptz;
alter table public.jobs add column if not exists moderation_note text;
alter table public.jobs add column if not exists moderated_at timestamptz;
create index if not exists idx_jobs_permission_status on public.jobs(permission_status);
create index if not exists idx_jobs_source_url on public.jobs(source_url);

create table if not exists public.job_feeds (
  id text primary key,
  name text not null,
  url text not null,
  category text not null default 'Information Technology',
  district text not null default 'Colombo',
  source_type text not null default 'RSS',
  status text not null default 'ACTIVE',
  last_sync_at timestamptz,
  items_ingested_count integer not null default 0,
  auto_sync_interval_minutes integer not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists idx_job_feeds_url on public.job_feeds(url);
create index if not exists idx_job_feeds_status on public.job_feeds(status);

create table if not exists public.feed_sync_logs (
  id text primary key,
  feed_id text not null references public.job_feeds(id) on delete cascade,
  feed_name text not null,
  synced_at timestamptz not null default now(),
  items_found integer not null default 0,
  items_added integer not null default 0,
  items_duplicate integer not null default 0,
  status text not null,
  message text not null default ''
);
create index if not exists idx_feed_sync_logs_feed on public.feed_sync_logs(feed_id, synced_at desc);

alter table public.job_feeds enable row level security;
alter table public.feed_sync_logs enable row level security;
create policy "Service role manages job feeds" on public.job_feeds for all using (auth.role() = 'service_role');
create policy "Service role manages feed logs" on public.feed_sync_logs for all using (auth.role() = 'service_role');

-- Imported listings remain hidden until an administrator approves them.
-- Existing curated jobs keep their current visibility and become APPROVED.
update public.jobs set permission_status = 'APPROVED' where permission_status is null;
