-- Automatic source-driven directory pipeline. Apply after 20261108_ingestion_moderation.sql.

alter table public.job_feeds add column if not exists trust_level text not null default 'MANUAL';
alter table public.job_feeds add column if not exists auto_publish boolean not null default false;
alter table public.job_feeds add column if not exists last_discovery_at timestamptz;
alter table public.job_feeds add column if not exists last_discovery_status text;

create index if not exists idx_job_feeds_auto_publish on public.job_feeds(auto_publish, status);
create index if not exists idx_jobs_application_url on public.jobs(application_url);

-- Existing explicit partner/verified feeds can be automated. Unknown website sources remain manual.
update public.job_feeds
set auto_publish = true
where trust_level in ('PARTNER_FEED', 'TRUSTED_EMPLOYER')
  and source_type in ('RSS', 'API');
