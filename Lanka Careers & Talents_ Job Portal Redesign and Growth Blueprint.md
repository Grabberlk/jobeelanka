# Lanka Careers & Talents: Next-Gen Job Discovery OS & Growth Blueprint
**Autonomous Platform Engineering, Bento-Grid UX, Generative Engine Optimization (GEO), Programmatic Video & Architecture Decision Records**

* **Version:** 2.0.0 (Enterprise Specification)
* **Date:** November 2026
* **Target Domain:** https://www.lankacareersandtalents.com/
* **Jurisdiction & Legal Baseline:** Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022 & 2025 Amendments; Sri Lanka Bureau of Foreign Employment (SLBFE) Act.
* **Governing Skills & Frameworks:** `/architecture`, `/architecture-patterns`, `/architecture-decision-records`, `/seo-geo`, `/seo-plan`, `/ui-ux-pro-max`, `/remotion`, `framer-motion`, `/cavecrew`.

---

## Table of Contents
1. [Executive Vision & Strategic Paradigm Shift](#1-executive-vision--strategic-paradigm-shift)
2. [Domain-Driven Design (DDD) & System Architecture](#2-domain-driven-design-ddd--system-architecture)
3. [Architecture Decision Records (ADRs)](#3-architecture-decision-records-adrs)
   - [ADR-001: Modular Monolith on Next.js 15+ App Router with Edge Caching](#adr-001-modular-monolith-on-nextjs-15-app-router-with-edge-caching)
   - [ADR-002: Dual-Store Strategy (PostgreSQL + pgvector & Hybrid Meilisearch)](#adr-002-dual-store-strategy-postgresql--pgvector--hybrid-meilisearch)
   - [ADR-003: Hexagonal Core with Transactional Outbox & BullMQ Async Pipeline](#adr-003-hexagonal-core-with-transactional-outbox--bullmq-async-pipeline)
   - [ADR-004: Edge-Level Crawler Whitelisting, Custom robots.txt & Anti-Bot Bypass](#adr-004-edge-level-crawler-whitelisting-custom-robotstxt--anti-bot-bypass)
   - [ADR-005: Bento-Grid Micro-UI System with Tailwind CSS v4 & Framer Motion](#adr-005-bento-grid-micro-ui-system-with-tailwind-css-v4--framer-motion)
   - [ADR-006: Programmatic Video Generation Engine via Remotion](#adr-006-programmatic-video-generation-engine-via-remotion)
   - [ADR-007: Privacy-First CV Vault & PDPA No. 9 Compliance Framework](#adr-007-privacy-first-cv-vault--pdpa-no-9-compliance-framework)
   - [ADR-008: Cavecrew Agentic Development Swarm & Continuous QA Delivery](#adr-008-cavecrew-agentic-development-swarm--continuous-qa-delivery)
4. [Bento-Grid Experience Architecture & UI/UX Pro Max](#4-bento-grid-experience-architecture--uiux-pro-max)
5. [Fluid Motion System (Framer Motion Choreography)](#5-fluid-motion-system-framer-motion-choreography)
6. [Programmatic Video Generation Pipeline (Remotion Engine)](#6-programmatic-video-generation-pipeline-remotion-engine)
7. [Comprehensive SEO & Generative Engine Optimization (GEO) Strategy](#7-comprehensive-seo--generative-engine-optimization-geo-strategy)
8. [Data Contracts, Entity Schemas & Core APIs](#8-data-contracts-entity-schemas--core-apis)
9. [Cavecrew Execution & Agentic Engineering Protocol](#9-cavecrew-execution--agentic-engineering-protocol)
10. [Four-Phase Implementation Roadmap & Success Metrics](#10-four-phase-implementation-roadmap--success-metrics)
11. [Master Autonomous Build Prompt](#11-master-autonomous-build-prompt)
12. [Primary References & Authorities](#12-primary-references--authorities)

---

## 1. Executive Vision & Strategic Paradigm Shift

The original Lanka Careers & Talents web property operated as a valuable, hand-curated catalog of Sri Lankan employment links across 1,000+ organizations. However, modern talent acquisition dynamics in Sri Lanka and its global diaspora have outgrown static link listings. Candidates expect immediate friction-free discovery, instant verification, localized direct action (WhatsApp, Direct Apply, Email), and hyper-relevant salary intelligence. Employers demand verified candidates, effortless vacancy syndication, and branded social amplification.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Lanka Careers & Talents OS                        │
│                                                                        │
│  ┌────────────────────────┐              ┌──────────────────────────┐  │
│  │   Job Discovery &      │              │  Verified Employer Hub   │  │
│  │   Action Platform      │              │  & Talent Pipeline       │  │
│  │  - Instant Search      │              │  - 1-Click Vacancy Post  │  │
│  │  - Bento Career Cockpit│              │  - WhatsApp & ATS Sync   │  │
│  │  - 1-Tap Apply / WA    │              │  - Auto-Video Reels      │  │
│  └───────────┬────────────┘              └────────────┬─────────────┘  │
│              │                                        │                │
│              ▼                                        ▼                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │     Trust, GEO & Intelligence Layer (Edge & Outbox Core)         │  │
│  │  - SLBFE Overseas Checks      - PDPA No. 9 Private CV Vault      │  │
│  │  - Schema.org JobPosting      - LLMs.txt & Passage Citability    │  │
│  │  - Remotion Dynamic Video     - Meilisearch + pgvector Match     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### The Strategic Pillars:
1. **From Link Directory to Unified Action Platform:** Every role is a structured canonical entity offering verified application vectors: native encrypted CV apply, official verified WhatsApp direct message (`wa.me` prefilled string), verified direct employer career link, or structured hiring email.
2. **Bento-Grid Experience Architecture:** Replace outdated, bloated text listings with a modular, responsive **Bento-Box UI/UX** that surfaces high-density information (freshness indicators, real-time salary metrics, district geography, remote tags, verified trust seals) with zero cognitive overload.
3. **Generative Engine Optimization (GEO) & Programmatic SEO First:** Built to dominate not only Google Search and Google Jobs (`JobPosting` JSON-LD), but also AI search engines (Perplexity, ChatGPT Search, Google AI Overviews, Claude) via atomic 134–167 word answer passages, full machine-readable `/llms.txt`, and verified entity graphs.
4. **Programmatic Video Pipeline via Remotion:** Automated generation of 15s/30s 9:16 vertical motion graphic reels and 16:9 social video cards for every verified featured vacancy and weekly industry roundup, giving Lanka Careers unmatched viral organic distribution across TikTok, Instagram, and LinkedIn.
5. **Frictionless Engineering with Cavecrew Swarms:** Engineering tasks, audits, and deployments are executed through lean, token-efficient subagent pipelines (`cavecrew-investigator`, `cavecrew-builder`, `cavecrew-reviewer`), ensuring high codebase velocity and strict QA enforcement.

---

## 2. Domain-Driven Design (DDD) & System Architecture

The new system is designed as a **Modular Monolith** employing **Hexagonal Architecture (Ports and Adapters)**. This guarantees strict boundary separation between business logic, persistence layers, and external integration vectors while maintaining simple single-repository deployment velocity.

### Bounded Contexts Map

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       BOUNDED CONTEXTS                                             │
├─────────────────────┬─────────────────────┬─────────────────────┬──────────────────────────────────┤
│ 1. Identity & Auth  │ 2. Job Catalog      │ 3. Employer & Trust │ 4. Application Engine            │
│ - Candidate IAM     │ - Vacancy CRUD      │ - KYC & Verification│ - One-Tap Apply                  │
│ - Employer IAM      │ - Multi-facet Index │ - SLBFE Registry    │ - Encrypted CV Vault             │
│ - RBAC & Audit Log  │ - Expiry Engine     │ - Company Profile   │ - Direct WhatsApp Dispatch       │
├─────────────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ 5. Ingestion & Feed │ 6. Notifications    │ 7. Video Engine     │ 8. SEO & Knowledge Graph         │
│ - ITPro.lk Sync     │ - WhatsApp Notifier │ - Remotion Worker   │ - JSON-LD Generator              │
│ - ATS & RSS Parsers │ - Telegram Broadcast│ - Video CDN Upload  │ - llms.txt & Edge Sitemaps       │
│ - Deduplication Core│ - Transactional Mail│ - Social Asset Pack │ - Programmatic Landing Routing   │
└─────────────────────┴─────────────────────┴─────────────────────┴──────────────────────────────────┘
```

### Hexagonal Layer Separation

```
        ┌──────────────────────────────────────────────────────────────┐
        │                 Driving Adapters (Primary)                   │
        │  [Next.js App Router]  [REST API /v1]  [Cron Event Triggers] │
        └──────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                     Application Services                     │
        │  - JobPostCommandService         - ApplicationWorkflowService│
        │  - FeedIngestionCoordinator      - VerificationOrchestrator  │
        └──────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                         Domain Core                          │
        │  Entities: Job, Employer, Application, CandidateProfile     │
        │  Value Objects: SalaryRange, ContactChannel, LocationPoint  │
        │  Domain Events: JobPublished, JobReported, ApplicationSent   │
        └──────────────────────────────┬───────────────────────────────┘
                                       │
                                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                 Driven Adapters (Secondary)                  │
        │  [PostgreSQL / Drizzle]   [Meilisearch]   [AWS S3/Cloudflare]│
        │  [BullMQ / Redis Outbox]  [Remotion CLI]  [WhatsApp API/SES] │
        └──────────────────────────────────────────────────────────────┘
```

---

## 3. Architecture Decision Records (ADRs)

Following the standard MADR (Markdown Architecture Decision Record) specification:

```
ADR Index:
- ADR-001: Modular Monolith on Next.js 15+ App Router with Edge Caching
- ADR-002: Dual-Store Strategy (PostgreSQL + pgvector & Hybrid Meilisearch)
- ADR-003: Hexagonal Core with Transactional Outbox & BullMQ Async Pipeline
- ADR-004: Edge-Level Crawler Whitelisting, Custom robots.txt & Anti-Bot Bypass
- ADR-005: Bento-Grid Micro-UI System with Tailwind CSS v4 & Framer Motion
- ADR-006: Programmatic Video Generation Engine via Remotion
- ADR-007: Privacy-First CV Vault & PDPA No. 9 Compliance Framework
- ADR-008: Cavecrew Agentic Development Swarm & Continuous QA Delivery
```

---

### ADR-001: Modular Monolith on Next.js 15+ App Router with Edge Caching

* **Status:** Accepted
* **Context:** The platform requires blazing fast server rendering for SEO/GEO crawlers, dynamic interactive Bento dashboards for applicants and recruiters, and low operational overhead. A microservices architecture would introduce severe networking, deployment, and transactional complexity for a high-traffic regional marketplace.
* **Decision:** Adopt a **Modular Monolith** pattern built on Next.js 15+ App Router, TypeScript, React Server Components (RSC), and Server Actions, with strict domain folder encapsulation under `src/modules/{domain}`.
* **Consequences:**
  * *Positive:* Ultra-fast TTFB via edge page caching (`stale-while-revalidate`), seamless server-rendered SEO markup, single CI/CD build pipeline, and zero inter-service network latency for core queries.
  * *Negative:* Care must be taken to prevent coupling between module domains (enforced by ESLint boundary rules).

---

### ADR-002: Dual-Store Strategy (PostgreSQL + pgvector & Hybrid Meilisearch)

* **Status:** Accepted
* **Context:** Job searches require instant multi-faceted filtering (District, Industry, Salary, Work Mode, Verification Status), typo-tolerant lexical searching in English/Sinhala/Tamil transliterations, plus semantic matching ("AI Engineer" matching "Machine Learning Specialist"). PostgreSQL alone with basic `LIKE` or basic text search falls short on typo tolerance and multi-lingual relevance at scale.
* **Decision:**
  1. **Primary OLTP Record of Truth:** PostgreSQL 16 (via Drizzle ORM) with `pgvector` extension for storing candidate profile embeddings and job description vector representations.
  2. **Search & Discovery Engine:** Meilisearch instance synced via Outbox events for ultra-fast (<15ms) client-side faceted filtering, prefix search, and geo-radius distance matching.
* **Consequences:**
  * *Positive:* Sub-20ms search experiences, instant multi-facet counters ("IT (42)", "Colombo (88)"), and semantic matching capability.
  * *Negative:* Requires an asynchronous synchronization pipeline between Postgres and Meilisearch.

---

### ADR-003: Hexagonal Core with Transactional Outbox & BullMQ Async Pipeline

* **Status:** Accepted
* **Context:** Operations like sending candidate notifications, synchronizing partner feeds (ITPro.lk, partner RSS), dispatching Telegram job broadcasts, triggering video renders, and updating search indexes must never block user HTTP transactions or cause data inconsistency if external APIs fail.
* **Decision:** Implement a **Transactional Outbox Pattern** in PostgreSQL:
  1. Primary state change (e.g. `jobs` insert) and domain event (`outbox_events` insert) write inside a single ACID database transaction.
  2. A dedicated BullMQ worker running on Redis polls/listens to the outbox table, executing background tasks with guaranteed at-least-once delivery, exponential backoff, and dead-letter queue (DLQ) containment.
* **Consequences:**
  * *Positive:* Zero lost events, decoupled integrations, robust resilience against partner API outages.
  * *Negative:* Requires managing Redis infrastructure and monitoring DLQ alerts.

---

### ADR-004: Edge-Level Crawler Whitelisting, Custom robots.txt & Anti-Bot Bypass

* **Status:** Accepted
* **Context:** The site audit revealed that `/robots.txt` and `/sitemap.xml` returned an anti-bot Cloudflare/WAF challenge page ("Please wait while your request is being verified") instead of raw text/XML. This prevents Googlebot, Bingbot, and LLM search agents (GPTBot, PerplexityBot, ClaudeBot) from indexing job records, neutralizing organic traffic.
* **Decision:**
  1. Reconfigure Cloudflare / Edge WAF rules to unconditionally bypass Managed Challenges for verified search engine bots and AI crawlers based on user-agent and verified ASN/reverse-DNS.
  2. Serve raw static/edge-cached responses for `/robots.txt`, `/sitemap.xml`, and `/llms.txt` directly from the Next.js edge route handlers with `Content-Type: text/plain; charset=utf-8` and `Content-Type: application/xml`.
  3. Continuous automated health check (`tests/e2e/crawler-access.spec.ts`) runs hourly to verify raw non-HTML headers.
* **Consequences:**
  * *Positive:* Guarantees 100% crawler indexing and Google Jobs ingestion.
  * *Negative:* Requires edge firewall exception maintenance.

---

### ADR-005: Bento-Grid Micro-UI System with Tailwind CSS v4 & Framer Motion

* **Status:** Accepted
* **Context:** Traditional job directories present walls of plain text cards that cause user fatigue and lack visual hierarchy. The user requested a "Bento-like dashboard or better", requiring a modern, high-converting visual system that handles varying content densities on both mobile and desktop.
* **Decision:** Standardize all core portal interfaces on a **Bento-Grid layout system** built with Tailwind CSS v4, Radix UI primitives, and Framer Motion spring animations.
  - The UI uses an asymmetric 12-column CSS Grid where cards span dynamic `col-span` and `row-span` modules.
  - Public discovery, candidate portal, and recruiter dashboards share unified Bento tokens.
* **Consequences:**
  * *Positive:* Distinctive, visually impressive, responsive, scannable layout; flexible card slots for salary badges, live tickers, maps, and video previews.
  * *Negative:* Requires rigorous responsive breakpoint testing to ensure clean stacking on narrow mobile viewports.

---

### ADR-006: Programmatic Video Generation Engine via Remotion

* **Status:** Accepted
* **Context:** Organic social distribution (TikTok, Instagram Reels, YouTube Shorts, LinkedIn Video) is the highest-converting traffic source for Sri Lankan tech and professional talent. Manual video creation for each job post is economically unfeasible.
* **Decision:** Integrate a **Remotion Programmatic Video Engine** (`@remotion/core`, `@remotion/bundler`) running in a sandboxed Node.js background worker:
  1. On approval of a "Featured" or "Verified" job vacancy, an event triggers Remotion with the job's dynamic props (Title, Company, Salary, Location, Top 3 Skills, QR Code).
  2. Remotion renders a 15-second 1080x1920 (9:16) MP4 video with smooth spring motion graphics, dynamic typography, and employer logo animation.
  3. Output video is saved to object storage and automatically shared to Telegram / downloaded by recruiters.
* **Consequences:**
  * *Positive:* Zero manual effort video production; viral shareable recruitment marketing collateral.
  * *Negative:* Video rendering is CPU/GPU intensive; requires worker queue rate-limiting to prevent server spikes.

---

### ADR-007: Privacy-First CV Vault & PDPA No. 9 Compliance Framework

* **Status:** Accepted
* **Context:** Sri Lanka’s Personal Data Protection Act No. 9 of 2022 and 2025 operational enforcement mandates strict data minimization, clear purpose-specific consent, candidate right-to-be-forgotten, and encrypted storage of personally identifiable information (PII). Exposing candidate CVs or personal WhatsApp numbers publicly would violate national law.
* **Decision:**
  1. Candidate CVs are encrypted at rest using AES-256 in private S3-compatible object storage with time-limited (15-minute) presigned URLs granted only to verified hiring employers who received an explicit application.
  2. WhatsApp contact links are generated only for employers who provide verified, affirmative business consent.
  3. Every candidate interaction stores a cryptographic consent ledger in `consents` table with explicit withdrawal endpoints.
* **Consequences:**
  * *Positive:* Enterprise-grade trust, immune to legal PDPA sanctions, builds candidate confidence.
  * *Negative:* Slightly higher friction for recruiter onboarding (requires business validation).

---

### ADR-008: Cavecrew Agentic Development Swarm & Continuous QA Delivery

* **Status:** Accepted
* **Context:** Developing and maintaining a multifaceted marketplace requires rapid feature development, deep codebase auditing, and automated regression testing without inflating agent token budgets or polluting context windows.
* **Decision:** Implement the `/cavecrew` delegation architecture:
  1. `cavecrew-investigator`: Pinpoints file locations, call sites, and dependency trees using terse grep/AST syntax (70% token savings).
  2. `cavecrew-builder`: Executes surgical 1–2 file implementations with exact line ranges and instant re-read verification.
  3. `cavecrew-reviewer`: Performs automated strict PR diff audits classifying findings by severity (🔴 Critical, 🟡 Warning, 🔵 Optimization) with zero conversational filler.
* **Consequences:**
  * *Positive:* 60%+ reduction in LLM context consumption, deterministic code review, high engineering velocity.
  * *Negative:* Output is tersely structured and requires automated parsing scripts.

---

## 4. Bento-Grid Experience Architecture & UI/UX Pro Max

The user interface follows the **Bento-Grid Design Language**: asymmetric modular cards, rounded borders (`rounded-2xl` / `rounded-3xl`), subtle glassmorphism backdrop blurs, crisp micro-borders, and interactive hover depth.

### Color Palette & Design Tokens
```
┌──────────────────┬─────────────────┬──────────────────────────────────────────┐
│ Token Name       │ Hex Value       │ Semantic Purpose                         │
├──────────────────┼─────────────────┼──────────────────────────────────────────┤
│ Brand Emerald    │ #059669         │ Primary Trust & Action Color (CTAs, Badges)│
│ Emerald Glow     │ #10B981         │ Hover states, active filters, indicators │
│ Deep Slate Navy  │ #0F172A         │ Primary Canvas Background / Dark Contrast│
│ Surface Slate    │ #1E293B         │ Bento Card Background (Dark mode)        │
│ Pure White / Off │ #F8FAFC         │ Bento Card Canvas (Light mode)           │
│ Electric Teal    │ #0D9488         │ Secondary Accents, Remote work badges    │
│ Warm Amber Gold  │ #F59E0B         │ Verified Trust Seal, Featured Placement  │
│ Crimson Alert    │ #EF4444         │ Urgent / Scam Warnings / Expiry badges   │
└──────────────────┴─────────────────┴──────────────────────────────────────────┘
```

### 1. Public Homepage Bento Hero Layout (Desktop 12-Column Grid)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  BENTO CELL A (col-span-8, row-span-2)          │ BENTO CELL B (col-span-4, row-span-1) │
│  "Find Your Next Role in Sri Lanka & Remote"   │ "Live Market Pulse"                   │
│  - Mega Omnisearch (Role, Skill, Location)      │ - 1,420 Active Roles Today            │
│  - Interactive District/Remote Quick Pills      │ - 180 First-Party Verified Employers  │
│  - Search Action CTA (Emerald Glow)             │ - Live Ticker: "Sysco LABS posted..." │
├─────────────────────────────────────────────────┼───────────────────────────────────────┤
│  BENTO CELL C (col-span-4, row-span-2)          │ BENTO CELL D (col-span-4, row-span-1) │
│  "Sri Lanka Salary Benchmarks"                  │ "Overseas & Remote Radar"             │
│  - Interactive LKR & USD Tech Salary Slider     │ - UAE, Singapore, UK, Aus, Remote     │
│  - Real-time percentile chart preview           │ - SLBFE Licensed Agency Verification  │
├─────────────────────────────────────────────────┼───────────────────────────────────────┤
│  BENTO CELL E (col-span-4, row-span-1)          │ BENTO CELL F (col-span-4, row-span-1) │
│  "1-Click WhatsApp Quick Connect"               │ "Featured Video Spotlight (Remotion)" │
│  - Direct connection to verified recruiters     │ - 15s Auto-Reel: "IFS Lead Architect" │
└─────────────────────────────────────────────────┴───────────────────────────────────────┘
```

### 2. Candidate "Career Cockpit" Bento Dashboard

The authenticated candidate dashboard is an intuitive, all-in-one command center:
* **Cell 1 (Profile & CV Health):** Shows CV completeness gauge (85%), parsed skills tags, and 1-click update.
* **Cell 2 (Application Tracker Kanban):** Mini-kanban tracking applications through `Sent` → `Viewed by Recruiter` → `Shortlisted` → `Interview`.
* **Cell 3 (Instant Alert Feeds):** Configured Telegram & WhatsApp alert status with custom filters ("Colombo + Hybrid + Senior React").
* **Cell 4 (Salary Match Radar):** Real-time comparative chart comparing candidate's target compensation against current marketplace postings.
* **Cell 5 (Saved Vacancies & Deadlines):** Cards with urgency countdown timers ("Closing in 2 days").

### 3. Recruiter "Talent Command Center" Bento Dashboard

* **Cell 1 (Active Postings Matrix):** Active jobs, total views, application count, and WhatsApp click-through metrics.
* **Cell 2 (Instant Candidate Ingestion Drawer):** Incoming verified applicants with anonymized preview and secure presigned CV download.
* **Cell 3 (Quick Vacancy Launcher):** 3-minute structured posting tool with auto-filling skills suggestions and instant salary percentile benchmarking.
* **Cell 4 (Remotion Social Reel Export):** Preview and instant download of the auto-generated 9:16 Instagram Reel / TikTok recruitment video.

---

## 5. Fluid Motion System (Framer Motion Choreography)

To ensure the new website feels hyper-smooth, responsive, and tactile, all micro-interactions and route transitions are choreographed using `framer-motion`.

### Animation Standards & Spring Tokens
```typescript
// src/lib/motion.ts
export const bentoSpring = {
  type: "spring",
  stiffness: 350,
  damping: 28,
  mass: 0.8,
};

export const gentleFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

export const bentoCardHover = {
  rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  hover: { 
    scale: 1.015, 
    boxShadow: "0 12px 30px -10px rgba(5,150,105,0.15)",
    transition: bentoSpring 
  },
  tap: { scale: 0.985 }
};
```

### Key Framer Motion Implementations:
1. **Shared Layout (`layoutId`) for Search Filter Expansion:** When clicking a filter tag (e.g. `Colombo` or `Remote`), the job card results smoothly morph without jarring page jumps.
2. **Expandable Job Detail Sheet Drawer:** On mobile, tapping a job card expands an overlay sheet using `framer-motion` drag-to-dismiss gestures.
3. **Live Number Count-Up:** Real-time counters (e.g. "1,420 Live Jobs") animate smoothly on page load using Framer Motion's `useSpring` and `useTransform`.
4. **Staggered Bento Grid Entrance:** Cards stagger entrance (`staggerChildren: 0.06`) so the interface builds naturally in front of the user.

---

## 6. Programmatic Video Generation Pipeline (Remotion Engine)

To drive viral talent acquisition, Lanka Careers integrates **Remotion** as a headless Node.js service that renders customized, branded video assets for every featured vacancy and weekly digest.

### Remotion Architecture Workflow
```
[Employer Posts Featured Job] ──► [Outbox Event: JobApproved]
                                         │
                                         ▼
                                [BullMQ: VideoQueue Worker]
                                         │
                                         ▼
                                [Remotion Bundler / CLI]
                      Reads: Job Title, Company, Logo, District,
                             Salary Badge, Top 3 Skills, QR Code
                                         │
                                         ▼
                                [Render MP4 (1080x1920)]
                                         │
                                         ▼
                                [Cloudflare R2 Storage]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
       [Telegram Channel Broadcast]                [Recruiter Dashboard Download]
       (Auto-posted with video reel)               ("Share to LinkedIn / TikTok")
```

### Remotion React Component Blueprint
```tsx
// src/remotion/compositions/JobReel.tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Img } from "remotion";

export interface JobReelProps {
  jobTitle: string;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  salaryText: string;
  topSkills: string[];
  qrCodeUrl: string;
}

export const JobReel: React.FC<JobReelProps> = ({
  jobTitle,
  companyName,
  companyLogoUrl,
  location,
  salaryText,
  topSkills,
  qrCodeUrl
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth entrance spring
  const titleSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });
  const badgeSpring = spring({ frame: frame - 30, fps, config: { damping: 10 } });
  const qrSpring = spring({ frame: frame - 60, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill className="bg-slate-950 text-white font-sans p-12 flex flex-col justify-between">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950" />

      {/* Header: Brand & Company Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Img src={companyLogoUrl} className="w-16 h-16 rounded-xl border border-slate-700 bg-white p-1" />
          <div>
            <h3 className="text-2xl font-bold text-slate-100">{companyName}</h3>
            <span className="text-emerald-400 font-semibold text-lg flex items-center gap-1">
              ✓ Verified Sri Lankan Employer
            </span>
          </div>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/30 text-sm font-bold">
          Lanka Careers Spotlight
        </div>
      </div>

      {/* Main Feature: Job Title & Location */}
      <div className="relative z-10 my-auto">
        <div 
          style={{ transform: `scale(${titleSpring})`, opacity: titleSpring }}
          className="space-y-4"
        >
          <div className="inline-block bg-slate-800 text-slate-300 px-4 py-1.5 rounded-lg text-lg">
            📍 {location}
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
            {jobTitle}
          </h1>
          <div className="text-3xl font-bold text-emerald-400">
            {salaryText}
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div 
          style={{ transform: `scale(${badgeSpring})`, opacity: badgeSpring }}
          className="flex flex-wrap gap-3 mt-6"
        >
          {topSkills.map((skill, i) => (
            <span key={i} className="bg-slate-800/80 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-lg font-medium">
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Dynamic QR Code & 1-Tap CTA */}
      <div 
        style={{ transform: `translateY(${interpolate(qrSpring, [0, 1], [40, 0])}px)`, opacity: qrSpring }}
        className="relative z-10 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex items-center justify-between"
      >
        <div>
          <h4 className="text-2xl font-bold text-white">Scan to Apply Instantly</h4>
          <p className="text-slate-400 text-base">Direct on LankaCareers.com or WhatsApp</p>
        </div>
        <Img src={qrCodeUrl} className="w-24 h-24 rounded-xl bg-white p-1" />
      </div>
    </AbsoluteFill>
  );
};
```

---

## 7. Comprehensive SEO & Generative Engine Optimization (GEO) Strategy

### Citability Engineering for AI Search (Perplexity, ChatGPT, Claude, Gemini)
To ensure that Lanka Careers & Talents is cited as the primary authority when users ask AI search agents questions like *"What is the average software engineer salary in Sri Lanka?"* or *"How can I find verified tech jobs in Colombo?"*:

1. **Optimal Passage Length (134–167 words):** Every programmatic landing page begins with an atomic, self-contained definition block answering the query directly within the first 40 words.
2. **The `llms.txt` and `llms-full.txt` Standard:** Deployed at `/llms.txt` and `/llms-full.txt`, providing an index of all categories, districts, average salaries, and verified employer rosters in clean markdown syntax.
3. **Structured Question Headings:** Headings follow exact conversational prompts: `## What is the Salary for Software Engineers in Colombo (2026)?`, `## How to Verify Overseas Job Offers with the SLBFE?`.

```markdown
<!-- Example of Citability Block on /salaries/software-engineer-sri-lanka -->
### What is the average software engineer salary in Sri Lanka?
As of 2026, the median monthly salary for a Senior Software Engineer in Sri Lanka is 
LKR 380,000 to LKR 550,000 (or $1,250 to $1,800 USD equivalent for foreign-denominated contracts), 
based on verified data from Lanka Careers & Talents. Entry-level associate engineers earn between 
LKR 120,000 and LKR 180,000 per month. Compensation varies significantly based on technology stack, 
with Cloud Architecture (AWS/GCP), Go, Rust, and AI Engineering commanding the highest compensation premiums. 
Over 45% of tech roles in Colombo offer hybrid or remote working arrangements.
```

### Complete Schema.org Entity Graph
Every indexable job listing automatically injects rich JSON-LD conforming to Google Job Search guidelines:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JobPosting",
      "@id": "https://www.lankacareersandtalents.com/jobs/senior-devops-engineer-colombo-ifs-4892#job",
      "title": "Senior DevOps Engineer",
      "description": "<p>Full job description with verified responsibilities, requirements, and tech stack...</p>",
      "identifier": {
        "@type": "PropertyValue",
        "name": "Lanka Careers",
        "value": "LC-4892"
      },
      "datePosted": "2026-11-06T08:00:00+05:30",
      "validThrough": "2026-12-15T23:59:59+05:30",
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "IFS Sri Lanka",
        "sameAs": "https://www.ifs.com",
        "logo": "https://www.lankacareersandtalents.com/logos/ifs.webp"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Orion City, 752 Dr Danister De Silva Mawatha",
          "addressLocality": "Colombo",
          "addressRegion": "Western Province",
          "postalCode": "00900",
          "addressCountry": "LK"
        }
      },
      "jobLocationType": "TELECOMMUTE",
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "LKR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 400000,
          "maxValue": 650000,
          "unitText": "MONTH"
        }
      },
      "directApply": true
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.lankacareersandtalents.com/" },
        { "@type": "ListItem", "position": 2, "name": "IT Jobs", "item": "https://www.lankacareersandtalents.com/it-jobs-in-sri-lanka" },
        { "@type": "ListItem", "position": 3, "name": "Colombo", "item": "https://www.lankacareersandtalents.com/jobs-in-colombo" },
        { "@type": "ListItem", "position": 4, "name": "Senior DevOps Engineer" }
      ]
    }
  ]
}
</script>
```

### Strategic Programmatic URL Architecture
```
/                                              -> Bento Home & Omnisearch
/jobs                                          -> Global Multi-Faceted Discovery Matrix
/jobs-in-sri-lanka                             -> Primary National Hub
/jobs-in-[colombo|kandy|gampaha|galle|jaffna]   -> Top 25 Sri Lankan Districts
/[industry]-jobs-in-sri-lanka                  -> Top 18 Industries (IT, Banking, Apparel, etc.)
/remote-jobs-for-sri-lankans                   -> Global Remote Roles for Sri Lankan Talent
/overseas-jobs-for-sri-lankans                 -> SLBFE-Verified Foreign Opportunities
/salaries/[role]-salary-in-sri-lanka           -> Dynamic Salary Benchmarks
/companies/[slug]                              -> Verified Employer Profiles & Vacancies
/resources/cv-templates-[english|sinhala|tamil]-> Trilingual Career Accelerator Tools
/safety/verify-overseas-recruitment-agencies   -> SLBFE Safety & Scam Prevention Guide
```

---

## 8. Data Contracts, Entity Schemas & Core APIs

### Production PostgreSQL Schema (Drizzle ORM Definition)
```typescript
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const workModeEnum = pgEnum('work_mode', ['ONSITE', 'HYBRID', 'REMOTE']);
export const employmentTypeEnum = pgEnum('employment_type', ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']);
export const verificationStatusEnum = pgEnum('verification_status', ['UNVERIFIED', 'EMAIL_VERIFIED', 'BUSINESS_VERIFIED', 'SLBFE_LICENSED', 'REJECTED']);
export const jobStatusEnum = pgEnum('job_status', ['DRAFT', 'PENDING_MODERATION', 'PUBLISHED', 'EXPIRED', 'ARCHIVED']);

export const employers = pgTable('employers', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  legalName: text('legal_name').notNull(),
  displayName: text('display_name').notNull(),
  businessRegistrationNumber: text('br_number'),
  websiteUrl: text('website_url'),
  logoUrl: text('logo_url'),
  verifiedDomain: text('verified_domain'),
  officialWhatsApp: text('official_whatsapp'),
  slbfeLicenseNumber: text('slbfe_license_number'),
  verificationStatus: verificationStatusEnum('verification_status').default('UNVERIFIED').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employerId: uuid('employer_id').references(() => employers.id).notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  descriptionHtml: text('description_html').notNull(),
  employmentType: employmentTypeEnum('employment_type').notNull(),
  workMode: workModeEnum('work_mode').notNull(),
  district: text('district').notNull(), // Colombo, Kandy, Galle, etc.
  city: text('city').notNull(),
  country: text('country').default('LK').notNull(),
  salaryCurrency: text('salary_currency').default('LKR').notNull(),
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  salaryPeriod: text('salary_period').default('MONTH').notNull(),
  isSalaryDisclosed: boolean('is_salary_disclosed').default(false).notNull(),
  requiredSkills: jsonb('required_skills').$type<string[]>().default([]).notNull(),
  sourceType: text('source_type').default('FIRST_PARTY').notNull(), // FIRST_PARTY, ITPRO_FEED, RSS_IMPORT
  sourceUrl: text('source_url'),
  applyUrl: text('apply_url'),
  applyEmail: text('apply_email'),
  applyWhatsApp: text('apply_whatsapp'),
  directApplyAllowed: boolean('direct_apply_allowed').default(true).notNull(),
  status: jobStatusEnum('status').default('PENDING_MODERATION').notNull(),
  datePosted: timestamp('date_posted', { withTimezone: true }),
  validThrough: timestamp('valid_through', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  candidateName: text('candidate_name').notNull(),
  candidateEmail: text('candidate_email').notNull(),
  candidatePhone: text('candidate_phone').notNull(),
  cvStoragePath: text('cv_storage_path').notNull(), // Private S3 Key
  coverNote: text('cover_note'),
  pdpaConsentGiven: boolean('pdpa_consent_given').notNull(),
  consentTimestamp: timestamp('consent_timestamp', { withTimezone: true }).defaultNow().notNull(),
  status: text('status').default('SUBMITTED').notNull(), // SUBMITTED, VIEWED, SHORTLISTED, REJECTED
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const outboxEvents = pgTable('outbox_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  aggregateType: text('aggregate_type').notNull(), // JOB, EMPLOYER, APPLICATION
  aggregateId: uuid('aggregate_id').notNull(),
  eventType: text('event_type').notNull(), // JobPublished, VideoRequested, AlertDispatched
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  retryCount: integer('retry_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## 9. Cavecrew Execution & Agentic Engineering Protocol

To build and maintain Lanka Careers & Talents with surgical efficiency, the development team operates via the `/cavecrew` three-subagent workflow:

```
                  ┌──────────────────────────────────────────────┐
                  │                 MAIN THREAD                  │
                  │   Orchestrates Goals, Verifies Final Outputs │
                  └───────┬──────────────────────┬───────────────┘
                          │                      │
             Need Code    │                      │ Need Multi-File
             Location     │                      │ Diff Audit
                          ▼                      ▼
         ┌────────────────────────┐      ┌────────────────────────┐
         │ cavecrew-investigator  │      │   cavecrew-reviewer    │
         │ - AST symbol scan      │      │ - Severity diff audit  │
         │ - Ultra-terse output   │      │ - No conversational slop│
         │ - Returns file:line    │      │ - Totals: 🔴 🟡 🔵     │
         └───────────┬────────────┘      └────────────────────────┘
                     │
             Exact Site Known
                     ▼
         ┌────────────────────────┐
         │    cavecrew-builder    │
         │ - 1-2 file edits only  │
         │ - Verified line ranges │
         │ - Re-reads & tests OK  │
         └────────────────────────┘
```

### Delegation Rules:
* **Locating Code:** Delegate to `cavecrew-investigator` ("Locate where `applyWhatsApp` link is constructed"). Output is delivered in terse `path:line` format to conserve 60%+ context budget.
* **Writing Components:** Hand the exact path to `cavecrew-builder` for surgical edits.
* **Diff Audit & Pre-Merge Gate:** Route all pull requests to `cavecrew-reviewer` to audit for security vulnerabilities, memory leaks, and PDPA compliance violations before acceptance.

---

## 10. Four-Phase Implementation Roadmap & Success Metrics

```
Phase 0: Infrastructure & Crawler Repair (Weeks 1-2)
├── Fix Cloudflare WAF bot-challenge rule for /robots.txt & /sitemap.xml
├── Stand up Next.js 15+ repository with Tailwind v4, Radix & Framer Motion
└── Establish PostgreSQL 16 + Redis BullMQ pipeline

Phase 1: MVP Core Discovery & Bento Portal (Weeks 3-6)
├── Deploy Bento-Grid Public Homepage & Job Search Engine
├── Launch Employer Verification & 1-Click Job Submission
├── Launch 1-Tap Candidate Application & WhatsApp Routing
└── Implement full JobPosting JSON-LD & /llms.txt

Phase 2: Partner Ingestion & Remotion Video Engine (Weeks 7-10)
├── Implement ITPro.lk API/RSS certified sync adapter
├── Integrate Remotion Worker for 9:16 vertical Job Reel video exports
├── Launch Automated Telegram Channel Vacancy Broadcaster
└── Roll out Candidate "Career Cockpit" & Alert Subscriptions

Phase 3: Marketplace Expansion & Monetization (Weeks 11-14)
├── Recruiter Talent Command Center & Analytics Dashboard
├── Featured Job Placement & Automated Stripe/LKR Gateway
├── Trilingual Sinhala/Tamil/English Resource Hub
└── Automated Cavecrew Continuous Review & Invariant CI/CD
```

### Key Performance Indicators (KPIs)
* **Time-to-Action:** Candidate lands on homepage and completes apply/WhatsApp click in **< 45 seconds**.
* **Search Performance:** Complex 4-facet query resolves in **< 25 milliseconds**.
* **Organic Search Indexing:** **100%** of live vacancies indexed in Google Jobs within 12 hours of publication.
* **AI Search Citation Rate:** Ranked in the top 3 cited sources in Perplexity & ChatGPT for Sri Lankan tech and diaspora queries.
* **Social Engagement:** Remotion-generated 9:16 reels achieve **5x higher candidate click-through** than static job links.

---

## 11. Master Autonomous Build Prompt

```text
Build a production-grade, full-stack Sri Lankan & diaspora career operating system called "Lanka Careers & Talents" (https://www.lankacareersandtalents.com/).

Architecture:
- Next.js 15+ App Router, TypeScript, React Server Components, Server Actions.
- Modular Monolith with Hexagonal Domain separation: Identity, JobCatalog, EmployerTrust, ApplicationEngine, Ingestion, Notifications, VideoEngine, SeoGeo.
- PostgreSQL 16 with Drizzle ORM; Redis + BullMQ for Transactional Outbox background processing.
- Meilisearch for sub-20ms multi-faceted and typo-tolerant search.
- Headless Remotion engine for programmatic 9:16 vertical video reel generation.

Design & UX:
- Bento-Grid layout language: 12-column dynamic CSS grid, rounded-2xl cards, glassmorphic accents.
- Color tokens: Emerald Trust (#059669), Slate Navy (#0F172A), Electric Teal (#0D9488), Amber Gold (#F59E0B).
- Fluid animations with Framer Motion (spring physics: stiffness 350, damping 28).
- Candidate "Career Cockpit" Bento Dashboard and Recruiter "Talent Command Center".
- Verified application channels: Internal Encrypted CV Apply, Official WhatsApp wa.me link with prefilled role message, Direct Employer URL, and Structured Hiring Email.

SEO & GEO:
- High Citability 134–167 word atomic answers for AI search engines (Perplexity, ChatGPT, Claude).
- Machine-readable /llms.txt and /llms-full.txt endpoints.
- Validated Schema.org JobPosting, BreadcrumbList, Organization, and FAQPage JSON-LD.
- Edge-rendered robots.txt and sitemap.xml completely bypassing anti-bot challenges.
- Interactive OpenAPI 3.0 Documentation at /swagger, /api-docs, and /api/swagger.json.

Administration & Staff Governance:
- Admin Portal at /admin with multi-persona verification switcher.
- 1 Super Admin (admin@lankacareers.com) + 2 Staff (staff1@lankacareers.com, staff2@lankacareers.com).
- Direct queue triage for employer KYC, SLBFE license verification, and scam alert containment.

Compliance & Trust:
- Strict compliance with Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022.
- Private encrypted S3 object storage for candidate CVs with 15-minute presigned URLs.
- Anti-scam safeguards, no-applicant-fee enforcement, and SLBFE overseas recruiter verification tags.

Delivery & Cavecrew:
- Develop modular code using Cavecrew subagent protocols (investigator -> builder -> reviewer).
- Zero conversational filler in CI/CD review gates.
```

---

## 12. Primary References & Authorities

1. **Google Search Central:** *Job Posting Structured Data Specification* — [https://developers.google.com/search/docs/appearance/structured-data/job-posting](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
2. **Data Protection Authority of Sri Lanka:** *Personal Data Protection Act No. 9 of 2022 & 2025 Amendments* — [https://www.dpa.gov.lk/](https://www.dpa.gov.lk/)
3. **Sri Lanka Bureau of Foreign Employment (SLBFE):** *Licensed Foreign Employment Agencies Registry* — [https://www.slbfe.lk/](https://www.slbfe.lk/)
4. **ITPro.lk Developer API & RSS Syndication:** *Developer Documentation* — [https://itpro.lk/developer/](https://itpro.lk/developer/) & [https://itpro.lk/api-swagger/](https://itpro.lk/api-swagger/)
5. **Remotion Documentation:** *Programmatic Video in React* — [https://www.remotion.dev/docs](https://www.remotion.dev/docs)
6. **Ahrefs AI Search & Citations Research (2025/2026):** *GEO & Generative AI Brand Citations Analysis* — [https://ahrefs.com/blog/ai-search-study/](https://ahrefs.com/blog/ai-search-study/)
7. **Google Search Central:** *Sitemaps & Edge Crawler Access Overview* — [https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
