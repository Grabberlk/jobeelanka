# Graph Report - Lanka Careers  (2026-11-06)

## Corpus Check
- Corpus is ~36,532 words - fits in a single context window. You may not need a graph.

## Summary
- 260 nodes · 562 edges · 14 communities (11 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cluster 0
- Cluster 1
- Cluster 2
- Cluster 3
- Cluster 4
- Cluster 5
- Cluster 6
- Cluster 7
- Cluster 8
- Cluster 9
- Cluster 10
- Cluster 11

## God Nodes (most connected - your core abstractions)
1. `react` - 35 edges
2. `next` - 30 edges
3. `lucide-react` - 24 edges
4. `cn()` - 24 edges
5. `compilerOptions` - 16 edges
6. `Job` - 14 edges
7. `JobRepository` - 12 edges
8. `buildWhatsAppUrl()` - 11 edges
9. `HomePage()` - 10 edges
10. `JobCard()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `JobDetailPage()` --calls--> `DynamicJobReelPlayer`  [EXTRACTED]
  src/app/jobs/[slug]/page.tsx → src/components/video/DynamicJobReelPlayer.tsx
- `JobsSearchContent()` --calls--> `JobCard()`  [EXTRACTED]
  src/app/jobs/page.tsx → src/components/jobs/JobCard.tsx
- `HomePage()` --calls--> `ApplyModal()`  [EXTRACTED]
  src/app/page.tsx → src/components/jobs/ApplyModal.tsx
- `HomePage()` --calls--> `JobCard()`  [EXTRACTED]
  src/app/page.tsx → src/components/jobs/JobCard.tsx
- `BentoCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/bento/BentoCard.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 3 thin omitted)

### Community 0 - "Cluster 0"
Cohesion: 0.07
Nodes (38): dependencies, clsx@^2.1.1, lucide-react@^1.16.0, next@15.1.7, react@19.0.0, react-dom@19.0.0, @remotion/player@^4.0.240, tailwind-merge@^3.0.2 (+30 more)

### Community 1 - "Cluster 1"
Cohesion: 0.14
Nodes (17): lucide-react, react, CandidateDashboardPage(), EmployerDashboardPage(), HomePage(), metadata, BentoCard(), BentoCardProps (+9 more)

### Community 2 - "Cluster 2"
Cohesion: 0.08
Nodes (10): next, metadata, RouteParams, RouteParams, SwaggerDocsPage(), applicationsStore, employersStore, JobRepository (+2 more)

### Community 3 - "Cluster 3"
Cohesion: 0.15
Nodes (22): class-variance-authority@^0.7.1, class-variance-authority, AdminPortalPage(), JobDetailPage(), JobDetailPageProps, ApplyModalProps, DirectEmployerApplyBox(), DirectEmployerApplyBoxProps (+14 more)

### Community 4 - "Cluster 4"
Cohesion: 0.12
Nodes (16): metadata, JobsPage(), JobsSearchContent(), ApplyModal(), JobFilters(), JobFiltersProps, INDUSTRIES, SALARY_BENCHMARKS (+8 more)

### Community 5 - "Cluster 5"
Cohesion: 0.13
Nodes (13): AdminTab, ModerationItem, SEED_ADMIN_AND_STAFF, SEED_MODERATION_QUEUE, StaffUser, FeedIngestionService, feedsStore, ParsedRssItem (+5 more)

### Community 6 - "Cluster 6"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "Cluster 7"
Cohesion: 0.18
Nodes (14): Avatar, AvatarFallback, AvatarImage, Card, CardContent, CardDescription, CardFooter, CardHeader (+6 more)

### Community 8 - "Cluster 8"
Cohesion: 0.36
Nodes (4): remotion@^4.0.240, remotion, JobReel(), JobReelProps

### Community 9 - "Cluster 9"
Cohesion: 0.32
Nodes (6): inter, metadata, RootLayout(), viewport, Footer(), Navbar()

### Community 10 - "Cluster 10"
Cohesion: 0.33
Nodes (5): bentoCardHover, bentoSpring, containerStagger, gentleFade, itemStagger

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Cluster 2` to `Cluster 0`, `Cluster 1`, `Cluster 3`, `Cluster 4`, `Cluster 5`, `Cluster 9`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Should `Cluster 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06538461538461539 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Cluster 1` to `Cluster 0`, `Cluster 2`, `Cluster 3`, `Cluster 4`, `Cluster 5`, `Cluster 7`, `Cluster 8`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Should `Cluster 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13968253968253969 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Cluster 1` to `Cluster 0`, `Cluster 2`, `Cluster 3`, `Cluster 4`, `Cluster 5`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `Cluster 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `Cluster 3` be split into smaller, more focused modules?**
  _Cohesion score 0.14838709677419354 - nodes in this community are weakly interconnected._