# JobeeLanka (Sri Lanka's Curated Job & Employer Directory)

A production-grade, fast, mobile-first Sri Lankan job discovery platform and referral directory built with **Next.js 15+ App Router**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL (Supabase)**.

---

## 🌟 Key Features

1. **Curated Job Directory Engine:**
   - 1,140+ verified opportunities cataloged across all 25 districts of Sri Lanka and accredited overseas openings.
   - Filterable by Category / Industry (120+ sectors), District, Work Mode (Remote, Hybrid, Onsite), and verified employers.

2. **Direct Referral & Contact Channels:**
   - **Direct Destination Links:** 1-Click apply on official employer websites and portals.
   - **Interactive Contact Reveal:** Visible phone/WhatsApp number and HR email tabs with 1-click clipboard copy and direct chat/email launchers.
   - **Independence & Attribution Guarantee:** Unambiguous statutory disclaimer on every job card and vacancy detail:
     > *"We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose. Click below to the organisation's web site."*

3. **Immersive Bento Back-Office Cockpit (`/admin`):**
   - Real-time Bento KPI metrics: Active listings, Inactive drafts, WhatsApp vectors, Direct email channels, and Categories.
   - Instant iOS ON/OFF status toggles directly in catalog rows.
   - Batch CSV Import and Export with RFC 4180 compliance, UTF-8 BOM, and legacy database header mapping.

4. **SEO, GEO & AdSense Compliance:**
   - Schema.org `JobPosting`, `BreadcrumbList`, and `Organization` structured data graphs for Google Search and AI Overviews.
   - High-quality content pages: `/about`, `/privacy` (PDPA No. 9 of 2022 & GDPR compliant), `/terms`, and `/safety` (SLBFE Anti-Scam protection).
   - Dynamic `/sitemap.xml`, edge `/robots.txt`, and `/llms.txt`.

5. **Automated Test Suite:**
   - Native Node.js test runner suite (`pnpm test`) covering CSV parsing, repository queries, null safety guards, and live server endpoints.

---

## 🚀 Quickstart

```bash
# Install dependencies
pnpm install

# Run automated test suite
pnpm test

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start -p 3001
```

---

## 📁 Project Architecture

```
├── data/
│   ├── legacy_jobs.json             # 1,131 cataloged jobs
│   ├── legacy_employers.json        # 1,129 verified employers
│   └── view_jobs_ads_9_all_1131.csv # Raw legacy dataset
├── src/
│   ├── app/                         # Next.js App Router (pages, API routes)
│   │   ├── about/                   # About Us mission page
│   │   ├── admin/                   # Bento Back-Office Cockpit
│   │   ├── api/v1/jobs/             # REST endpoints (CRUD & CSV)
│   │   ├── jobs/                    # Directory search & dynamic [slug] detail
│   │   ├── privacy/                 # PDPA No. 9 & AdSense Privacy Policy
│   │   └── terms/                   # Independent Directory Terms
│   ├── components/                  # Bento Grid & Job Card components
│   └── modules/                     # Job Repository & CSV Services
├── supabase/
│   ├── migrations/                  # PostgreSQL DDL schema & RLS policies
│   └── seed.js                      # Automated bulk database seeder
└── tests/                           # 20 automated unit & integration tests
```

---

## 📜 License & Compliance

Complies with the **Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA)**. JobeeLanka does not charge candidate placement fees or sell applicant credentials.
