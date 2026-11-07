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

-- 4. STAFF TABLE (Admin Governance Cockpit & RBAC)
create table if not exists public.staff (
  id text primary key,
  name text not null,
  email text unique not null,
  role text not null default 'MODERATOR_STAFF',
  department text not null default 'Job Moderation & Quality Assurance',
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'ACTIVE',
  two_factor_enabled boolean not null default false,
  avatar_url text,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Performance Index for Staff
create index if not exists idx_staff_email on public.staff(email);
create index if not exists idx_staff_role on public.staff(role);

-- Enable Row Level Security (RLS) on Staff
alter table public.staff enable row level security;

-- Only authenticated Super Admins / service role can access Staff table
create policy "Allow full access for service role on staff"
  on public.staff for all
  using (auth.role() = 'service_role');

-- Admin Users RLS Policies (For staff users authenticated via Supabase Auth)
create policy "Allow staff with SUPER_ADMIN role to manage staff table"
  on public.staff for all
  using (
    auth.role() = 'service_role' or 
    exists (
      select 1 from public.staff s
      where s.email = (auth.jwt() ->> 'email')
      and s.role = 'SUPER_ADMIN'
      and s.status = 'ACTIVE'
    )
  );

create policy "Allow authenticated staff to manage jobs"
  on public.jobs for all
  using (
    auth.role() = 'service_role' or
    exists (
      select 1 from public.staff s
      where s.email = (auth.jwt() ->> 'email')
      and s.status = 'ACTIVE'
    )
  );

create policy "Allow authenticated staff to manage employers"
  on public.employers for all
  using (
    auth.role() = 'service_role' or
    exists (
      select 1 from public.staff s
      where s.email = (auth.jwt() ->> 'email')
      and s.status = 'ACTIVE'
    )
  );

create policy "Allow authenticated staff to view candidate applications"
  on public.applications for select
  using (
    auth.role() = 'service_role' or
    exists (
      select 1 from public.staff s
      where s.email = (auth.jwt() ->> 'email')
      and s.status = 'ACTIVE'
    )
  );

-- Seed Root Super Administrators
insert into public.staff (id, name, email, role, department, permissions, status, two_factor_enabled)
values 
  ('staff-super-1', 'Rajeevan', 'contactrajeevan@hotmail.com', 'SUPER_ADMIN', 'Platform Governance & Strategic Direction', '["ALL_PRIVILEGES", "MANAGE_STAFF", "APPROVE_EMPLOYERS", "OVERRIDE_MODERATION", "VIEW_AUDIT_LOGS", "SYSTEM_SETTINGS", "API_KEY_ISSUANCE", "CSV_IMPORT_EXPORT"]'::jsonb, 'ACTIVE', true),
  ('staff-super-2', 'Anas', 'anasbikes1992@gmail.com', 'SUPER_ADMIN', 'Operations & Commercial Partnerships', '["ALL_PRIVILEGES", "MANAGE_STAFF", "APPROVE_EMPLOYERS", "OVERRIDE_MODERATION", "VIEW_AUDIT_LOGS", "SYSTEM_SETTINGS", "API_KEY_ISSUANCE", "CSV_IMPORT_EXPORT"]'::jsonb, 'ACTIVE', true)
on conflict (email) do update 
set 
  role = excluded.role,
  department = excluded.department,
  permissions = excluded.permissions,
  status = excluded.status;


