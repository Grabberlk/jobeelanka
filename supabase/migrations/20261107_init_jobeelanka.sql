-- =============================================================================
-- JobeeLanka Database Schema for Supabase (PostgreSQL 16)
-- Matching JobeeLanka Directory Data Model & PDPA Compliance
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. EMPLOYERS TABLE
create table if not exists public.employers (
  id text primary key,
  slug text unique not null,
  legal_name text not null,
  display_name text not null,
  logo text not null,
  district text not null default 'Colombo',
  website text not null,
  verified_domain text not null,
  official_whatsapp text,
  slbfe_license_number text,
  verification_status text not null default 'VERIFIED_BUSINESS',
  is_featured boolean not null default false,
  about text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. JOBS TABLE
create table if not exists public.jobs (
  id text primary key,
  code text unique not null,
  slug text unique not null,
  title text not null,
  employer_id text references public.employers(id) on delete cascade,
  department text,
  industry text not null default 'Information Technology',
  listing_type text not null default 'vacancy',
  city text not null default 'Colombo',
  district text not null default 'Colombo',
  country text not null default 'LK',
  work_mode text not null default 'ONSITE',
  employment_type text not null default 'FULL_TIME',
  salary_min numeric,
  salary_max numeric,
  salary_currency text not null default 'LKR',
  salary_period text not null default 'MONTH',
  is_salary_disclosed boolean not null default false,
  short_snippet text not null default '',
  description_html text,
  responsibilities jsonb not null default '[]'::jsonb,
  qualifications jsonb not null default '[]'::jsonb,
  required_skills jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  date_posted timestamptz not null default now(),
  valid_through timestamptz,
  views_count integer not null default 1,
  featured boolean not null default false,
  status text not null default 'ACTIVE',
  source_type text not null default 'FIRST_PARTY',
  source_name text,
  source_url text,
  application_url text not null,
  apply_url text,
  apply_email text,
  apply_whatsapp text,
  show_whatsapp boolean not null default false,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  applications_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. APPLICATIONS TABLE (PDPA Compliant)
create table if not exists public.applications (
  id text primary key,
  job_id text references public.jobs(id) on delete cascade,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text not null,
  cv_file_name text not null,
  cover_note text,
  pdpa_consent_given boolean not null default true,
  status text not null default 'SUBMITTED',
  created_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_district on public.jobs(district);
create index if not exists idx_jobs_industry on public.jobs(industry);
create index if not exists idx_jobs_slug on public.jobs(slug);
create index if not exists idx_jobs_code on public.jobs(code);
create index if not exists idx_employers_slug on public.employers(slug);

-- Enable Row Level Security (RLS)
alter table public.employers enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Public Read Policies (Job seekers can browse active jobs and employers)
create policy "Allow public read access to verified employers"
  on public.employers for select
  using (true);

create policy "Allow public read access to active jobs"
  on public.jobs for select
  using (status = 'ACTIVE');

-- Public Candidates can submit applications
create policy "Allow public candidate submissions"
  on public.applications for insert
  with check (pdpa_consent_given = true);

-- Service Role / Admin has full control
create policy "Allow full access for service role on jobs"
  on public.jobs for all
  using (auth.role() = 'service_role');

create policy "Allow full access for service role on employers"
  on public.employers for all
  using (auth.role() = 'service_role');

create policy "Allow full access for service role on applications"
  on public.applications for all
  using (auth.role() = 'service_role');

