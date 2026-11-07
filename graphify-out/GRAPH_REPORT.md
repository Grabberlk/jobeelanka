# Graph Report - Lanka Careers  (2026-11-08)

## Corpus Check
- 88 files · ~386,498 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .csv 2, .example 1, (none) 1)

## Summary
- 450 nodes · 787 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc24ce44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- react
- repository.ts
- admin/page.tsx
- JobeeLanka: Comparative Review and New Website Strategy
- rss-parser.ts
- compilerOptions
- cn
- Lanka Careers & Talents: Next-Gen Job Discovery OS & Growth Blueprint
- app/layout.tsx
- motion.ts
- next.config.mjs
- csv-service.test.js
- generate-legacy-json.js
- staff/route.ts
- JobeeLanka (Sri Lanka's Curated Job & Employer Directory)
- .mcp.json

## God Nodes (most connected - your core abstractions)
1. `next` - 43 edges
2. `react` - 36 edges
3. `lucide-react` - 27 edges
4. `cn()` - 24 edges
5. `JobeeLanka: Comparative Review and New Website Strategy` - 18 edges
6. `compilerOptions` - 16 edges
7. `JobRepository` - 15 edges
8. `Job` - 14 edges
9. `Lanka Careers & Talents: Next-Gen Job Discovery OS & Growth Blueprint` - 14 edges
10. `buildWhatsAppUrl()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AdminPortalPage()` --calls--> `formatDateRelative()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/utils.ts
- `GET()` --calls--> `verifyAdminSessionToken()`  [EXTRACTED]
  src/app/api/v1/auth/admin/route.ts → src/modules/auth/admin-auth.ts
- `CompaniesPage()` --calls--> `AdSlot()`  [EXTRACTED]
  src/app/companies/page.tsx → src/components/ads/AdSlot.tsx
- `JobDetailPage()` --calls--> `AdSlot()`  [EXTRACTED]
  src/app/jobs/[slug]/page.tsx → src/components/ads/AdSlot.tsx
- `JobsSearchContent()` --calls--> `AdSlot()`  [EXTRACTED]
  src/app/jobs/page.tsx → src/components/ads/AdSlot.tsx

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (41): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^1.16.0, next@15.1.12, react@19.0.0, react-dom@19.0.0, @supabase/supabase-js@^2.119.0 (+33 more)

### Community 1 - "react"
Cohesion: 0.06
Nodes (33): lucide-react, next, react, metadata, metadata, metadata, CompaniesPage(), metadata (+25 more)

### Community 2 - "repository.ts"
Cohesion: 0.06
Nodes (22): RFC-4180, RouteParams, RouteParams, JobsPage(), JobsSearchContent(), ApplyModal(), JobFilters(), JobFiltersProps (+14 more)

### Community 3 - "admin/page.tsx"
Cohesion: 0.15
Nodes (22): AdminPortalPage(), AdminTab, JobDetailPage(), JobDetailPageProps, ApplyModalProps, DirectEmployerApplyBox(), DirectEmployerApplyBoxProps, JobCard() (+14 more)

### Community 4 - "JobeeLanka: Comparative Review and New Website Strategy"
Cohesion: 0.04
Nodes (46): 10. Recommended database model, 11. Employer listing workflow, 12. What should be in the first release, 13. Suggested implementation stack, 14. 90-day launch plan, 15. Key metrics for this business model, 16. Revised copy-ready build prompt, 1. Final recommendation (+38 more)

### Community 5 - "rss-parser.ts"
Cohesion: 0.15
Nodes (8): FeedIngestionService, feedsStore, ParsedRssItem, syncLogsStore, FeedSyncLog, JobFeed, PRECONFIGURED_FEEDS, SEED_EMPLOYERS

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "cn"
Cohesion: 0.15
Nodes (17): Avatar, AvatarFallback, AvatarImage, Button, ButtonProps, buttonVariants, Card, CardContent (+9 more)

### Community 8 - "Lanka Careers & Talents: Next-Gen Job Discovery OS & Growth Blueprint"
Cohesion: 0.05
Nodes (39): 10. Four-Phase Implementation Roadmap & Success Metrics, 11. Master Autonomous Build Prompt, 12. Primary References & Authorities, 1. Executive Vision & Strategic Paradigm Shift, 1. Public Homepage Bento Hero Layout (Desktop 12-Column Grid), 2. Candidate "Career Cockpit" Bento Dashboard, 2. Domain-Driven Design (DDD) & System Architecture, 3. Architecture Decision Records (ADRs) (+31 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.24
Nodes (8): inter, jsonLdOrg, jsonLdWebSite, metadata, RootLayout(), viewport, Footer(), Navbar()

### Community 10 - "motion.ts"
Cohesion: 0.33
Nodes (5): bentoCardHover, bentoSpring, containerStagger, gentleFade, itemStagger

### Community 12 - "csv-service.test.js"
Cohesion: 0.09
Nodes (15): assert, { test, describe }, assert, fs, path, test, assert, test (+7 more)

### Community 14 - "generate-legacy-json.js"
Cohesion: 0.11
Nodes (12): colMap, csvPath, employersMap, empOutputPath, fs, jobs, outputPath, path (+4 more)

### Community 15 - "staff/route.ts"
Cohesion: 0.15
Nodes (18): checkAuth(), DELETE(), GET(), POST(), staffList, checkAuth(), POST(), GET() (+10 more)

### Community 16 - "JobeeLanka (Sri Lanka's Curated Job & Employer Directory)"
Cohesion: 0.33
Nodes (5): JobeeLanka (Sri Lanka's Curated Job & Employer Directory), 🌟 Key Features, 📜 License & Compliance, 📁 Project Architecture, 🚀 Quickstart

## Knowledge Gaps
- **1 isolated node(s):** `RFC-4180`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 222 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `react` to `package.json`, `repository.ts`, `admin/page.tsx`, `rss-parser.ts`, `app/layout.tsx`, `staff/route.ts`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **What connects `RFC-4180` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06090808416389812 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `package.json`, `repository.ts`, `admin/page.tsx`, `cn`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05960755275823769 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `package.json`, `repository.ts`, `admin/page.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `repository.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06108597285067873 - nodes in this community are weakly interconnected._