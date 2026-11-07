# JobeeLanka: Comparative Review and New Website Strategy

**Reviewed:** 6 November 2026  
**Compared with:** Lanka Careers & Talents, https://www.lankacareersandtalents.com/  
**Proposed main brand/domain:** JobeeLanka, https://www.jobeelanka.com/

## 1. Final recommendation

Use **JobeeLanka** as the main public brand for the new platform:

> **JobeeLanka — Sri Lanka’s trusted jobs and career directory**

Use Lanka Careers & Talents as the legacy source and content asset. Do not run two competing public websites with the same jobs, categories, and employer pages. Build the new experience on JobeeLanka, migrate useful content and links, and eventually 301-redirect equivalent old URLs from Lanka Careers & Talents where technically and legally possible.

The correct business model is:

> **A polished, curated job and employer referral directory funded primarily by AdSense, with optional paid employer visibility later.**

JobeeLanka does not need to become a full applicant-tracking system. The platform can own the discovery experience while the employer, recruiter, or original job website owns the application process. Every listing must tell the visitor exactly where the application goes:

- Apply on employer website
- Contact verified recruiter
- Send WhatsApp enquiry
- Email HR/recruiter
- View original job source

This keeps the product simpler, reduces personal-data risk, and matches the actual business purpose.

## 2. Comparison of the two websites

### Lanka Careers & Talents

Lanka Careers & Talents presents a broad career directory with employer and career-site links across Sri Lanka, overseas jobs, government, NGOs, universities, and private companies. Its strongest asset is the depth of its directory and its professional/employer-link concept.

Its weaknesses are a text-heavy presentation, a directory-first user journey, mixed content purposes, limited visible job-level action, and a technical crawlability concern: direct checks found that `/robots.txt` and `/sitemap.xml` returned an anti-bot verification HTML page rather than valid robots text and XML. The brand name is also longer and less memorable for a consumer job-search destination.

### JobeeLanka

JobeeLanka is shorter, more memorable, and better suited to a focused national job brand. Its homepage has a simpler category model, location navigation, search, Popular Jobs, Career Hub, Talents & Skills, Resource Centre, and Telegram concepts. The category names are generally understandable and its location model already exposes granular Colombo-area locations.

The main limitation is that the current site is still visually and functionally a directory template. The homepage does not immediately communicate a premium search experience, the category page inspected showed little visible job-level content in the extracted page, and the detail page largely explains how the old ecosystem works rather than guiding a visitor to a current vacancy.

The current JobeeLanka HTML also includes Google AdSense and analytics scripts, including two AdSense script references. This confirms that advertising has been considered in the existing implementation, but it does not confirm current AdSense approval, policy compliance, or revenue. Consolidate the scripts, use the current official implementation, and validate the account and consent setup before launch.

### Decision

JobeeLanka should become the front door because it is shorter and more focused. Preserve the best legacy directory content, but redesign the product around current jobs, employer discovery, source transparency, and fast referral actions.

## 3. Product positioning

Do not describe the site as an employer, recruiter, or agency. Use language such as:

> JobeeLanka helps job seekers discover Sri Lankan job opportunities, employer career pages, recruitment websites, internships, government vacancies, remote work, and overseas employment resources. Applications and hiring decisions are handled by the employer or original job source.

This statement is valuable because it sets user expectations, reduces impersonation risk, and explains why the platform may send a user to another website.

The home page should include a visible note:

> **Application notice:** JobeeLanka is a discovery and referral platform. Unless a listing says otherwise, your application, CV, WhatsApp message, or email will go directly to the employer, recruiter, or original job publisher. We do not guarantee hiring outcomes.

## 4. Refined site architecture

### Main navigation

- Find Jobs
- Companies
- Industries
- Locations
- Popular Jobs
- Government & Public Sector
- Overseas Jobs
- Career Resources
- For Employers
- About / Contact

Keep Talents & Skills as a later phase. A public CV marketplace creates substantially higher privacy, moderation, and consent obligations. It should not be part of the initial AdSense-first launch unless there is a strong, documented reason.

### Homepage

The homepage should feel like a modern search product, not a list of links:

1. Header with JobeeLanka logo, Find Jobs, Companies, Resources, Post a Listing, and a clean account link.
2. Hero: “Find your next opportunity in Sri Lanka.”
3. Search bar with keyword, location, and industry.
4. Quick filters: New today, Colombo, Remote, Internships, Government, Overseas.
5. Featured current jobs or employer opportunities.
6. Browse by industry with simple icon cards.
7. Browse by location.
8. Verified employer directory.
9. Career guides and practical resources.
10. Telegram/email alert signup with clear consent.
11. AdSense placements only where they do not look like job-navigation buttons.

### Job directory page

Each card should show:

- Job title or opportunity title
- Employer/source name
- Location
- Industry
- Employment type, if known
- Posted/checked date
- Source label: Employer, Recruiter, Government, Partner feed, or External site
- Verification level
- Action: View details / Apply externally

Do not publish stale cards indefinitely. Show “Last checked” and mark inactive or archive listings that fail a freshness check.

### Listing detail page

For a directory listing, the detail page should contain original value rather than being a thin redirect page:

- Clear title
- Employer or source name
- What the listing is about
- Industry and location
- Who is hiring or where the application goes
- Application method
- Official source link
- WhatsApp/email action if explicitly provided and verified
- “Why this source is listed” or a short editorial note
- Related jobs and related employers
- Safety notice
- Report incorrect or expired listing

If the page only contains a title, one paragraph copied from another site, and a button, it may be weak for users, organic search, and AdSense. Add useful context, freshness, source attribution, and related navigation.

## 5. Directory listing types

Use an explicit `listingType` field:

1. **Employer career page** — direct link to the organisation’s official jobs page.
2. **Specific vacancy** — a single current vacancy with an official application URL.
3. **Recruiter vacancy** — recruitment agency or headhunter listing, with agency identity and contact method.
4. **Government vacancy** — official department or public-sector source.
5. **Partner feed job** — imported with permission from an API/RSS/CSV partner.
6. **Career resource** — internship, training, scholarship, CV, or professional-development resource.
7. **Employer profile** — evergreen company page with current career links.

This avoids mixing “company career page,” “job ad,” “resource,” and “recruitment agency” in one ambiguous card type.

## 6. AdSense-first monetisation model

AdSense should support a useful site; it should not be the reason pages exist. Google’s policies prohibit artificial clicks, encouraging users to click ads, deceptive navigation, and site behaviour that makes ads look like menus or downloads. Google also requires publishers to follow publisher policies and can disable ad serving for violations. [1] [2]

### Best pages for ads

- Industry landing pages with real job listings and explanatory content
- Location landing pages
- Employer profile pages
- Career guides and interview resources
- Government and overseas-job safety explainers
- Search results with enough useful content and clear navigation
- Job detail pages with a modest related-content unit

### Pages where ads should be limited

- Login, signup, submission, report, and contact-confirmation pages
- Very short external redirect pages
- Pages dominated by a single apply button
- Empty search results
- Thin category pages with no current listings
- User-generated content awaiting moderation

### Suggested desktop layout

- One responsive display unit below the header or hero
- Main content column with listings
- One right-rail unit on wide screens only
- One in-content unit after a meaningful block of listings or editorial content
- One footer or related-content unit if it does not interfere with navigation

### Suggested mobile layout

- One ad after the first meaningful content block
- One ad midway through longer category/resource pages
- Avoid sticky ads covering apply buttons, filters, or WhatsApp actions
- Keep the first viewport focused on search and job discovery

Do not label ads as “Apply,” “HR contact,” “Jobs,” or “Sponsored job” in a way that could confuse users. Use “Advertisement” or the platform’s standard ad labelling. Do not ask users to click ads, and do not create accidental-click layouts.

### Revenue expectations

AdSense income depends on traffic volume, country mix, device mix, viewability, seasonality, and advertiser demand. Sri Lankan traffic may have lower RPM than some Western markets, so the plan should optimise for useful organic traffic and repeat usage rather than expecting high revenue from a small number of pages. Add direct employer sponsorship, featured employer profiles, and career-event partnerships only after the directory has audience and trust.

## 7. Job and RSS integration under the directory model

The new platform can remain referral-first while supporting structured feeds.

### Feed sources

- Direct employer RSS/XML/JSON/CSV feeds
- Approved recruitment partner feeds
- ITPro.lk API/RSS after written permission
- Official government vacancy pages or approved notices
- Employer career pages with permission
- Manual listings submitted by employers/recruiters

ITPro.lk documents a developer API with `GET /api/v1/jobs`, `GET /api/v1/jobs/{id}`, and partner capabilities for job publishing and updates. It also documents all-jobs, category, location, and job-type RSS feeds. Start with a permission-based ITPro partnership rather than scraping. [3] [4]

### Feed record requirements

Every feed item must store:

- Original title
- Source organisation
- Original URL
- Source type
- Date first seen
- Date last checked
- Original publication date if supplied
- Closing date if supplied
- Location
- Industry
- Destination/application URL
- Permission status
- Canonical/source attribution
- Duplicate hash
- Active/expired status

### Freshness rules

- Employer career pages: check daily where allowed
- RSS/API feeds: check every 15–60 minutes depending on partner limits
- Manual listings: require an expiry date or re-confirmation every 30 days
- Government notices: retain the original notice date and closing date
- Dead links: pause immediately and queue for review

## 8. SEO model for a referral directory

### Important schema decision

Use `JobPosting` JSON-LD only when the JobeeLanka page itself contains a complete, accurate, current job posting and a genuine application path. Google’s guidance requires core properties such as title, full description, date posted, hiring organisation, location or remote details, and accurate expiry information. [5]

For a thin employer-directory page that merely links to an external careers website, do not pretend that the page is the full job posting. Use normal page metadata, `Organization` or `ItemList` where appropriate, clear canonical/source links, and useful editorial content. This is safer and more accurate.

### SEO page groups

Create these indexable page types:

- `/jobs/`
- `/jobs-in-sri-lanka/`
- `/jobs-in-colombo/`
- `/jobs-in-kandy/`
- `/remote-jobs-sri-lanka/`
- `/internships-sri-lanka/`
- `/government-jobs-sri-lanka/`
- `/overseas-jobs-for-sri-lankans/`
- `/industry/it-technology/`
- `/industry/banking-finance/`
- `/location/colombo/`
- `/companies/`
- `/company/{slug}/`
- `/resources/{slug}/`

Do not index thousands of empty or duplicate filter combinations. Use canonical URLs and `noindex` for thin faceted pages.

### Migration from the old domains

Build a URL mapping spreadsheet:

- Old URL
- New canonical URL
- Content type
- Redirect status
- Canonical decision
- Source ownership/permission
- Date reviewed

Where equivalent pages exist, use permanent redirects. Do not redirect every old page to the new homepage. Preserve useful category and employer relevance. If both domains remain live temporarily, avoid duplicate descriptions and duplicate job pages.

## 9. Brand and UI direction

### Brand

Use a wordmark such as:

> **JobeeLanka**  
> *Find jobs. Find employers. Find your next opportunity.*

Use “JobeeLanka” consistently rather than alternating between Jobee Lanka, Jobeelanka Careers, and Lanka Careers & Talents. Keep the legal/company identity in the footer, not in the main headline.

### Visual system

- Base: warm white background, dark charcoal text, deep green primary actions
- Accent: amber or coral only for highlights, not every button
- Cards: 12–16px radius, light border, soft shadow used sparingly
- Icons: consistent line icons for industry and location
- Typography: modern sans-serif with strong H1/H2 hierarchy
- Buttons: one dominant action per card; secondary source link as text/button
- Mobile: bottom-friendly filter controls, large tap targets, sticky search—not sticky advertising

### Job card example

```text
[Company logo]  Verified employer
Senior Software Engineer
ABC Technologies · Colombo · Full-time
Posted 2 days ago · Salary not disclosed

[View opportunity]  [Apply on employer site]
```

For a pure company career page:

```text
[Company logo]  Employer career page
MAS Holdings
Apparel and manufacturing · Sri Lanka
Current vacancies are published on the official careers website.

[View official careers page]
```

## 10. Recommended database model

```text
users
employers
employer_verifications
categories
locations
listings
listing_sources
feed_connections
feed_runs
listing_events
saved_listings
saved_searches
alert_subscriptions
reports
moderation_cases
content_pages
redirect_map
ad_slots
consents
audit_logs
```

Key `listings` fields:

```text
id
slug
type: employer_page | vacancy | recruiter | government | resource
status: draft | pending | published | paused | expired | removed
title
employer_id
source_name
source_url
apply_url
apply_email
apply_whatsapp
location_id
category_id
description_html
summary
published_at
last_checked_at
expires_at
verification_status
permission_status
canonical_url
```

The platform should not collect candidate CVs in the MVP. If you later add CV upload, store it privately with explicit consent, retention/deletion tools, and strong access control. Sri Lanka’s Data Protection Authority identifies the Personal Data Protection Act framework and the Authority’s regulatory role, so candidate data should not be treated as an afterthought. [6]

## 11. Employer listing workflow

1. Employer or recruiter registers.
2. They provide organisation name, website, business email, contact person, and source/application URL.
3. The system sends email verification.
4. Moderator checks the domain, source, contact method, and job legitimacy.
5. Listing is published with a verification label.
6. The source is checked periodically.
7. Expired or broken listings are paused.
8. Reports trigger review and possible takedown.

Verification labels should be specific:

- Email verified
- Website verified
- Employer reviewed
- Official employer source
- Partner feed
- Overseas agency licence check where applicable

Never use a generic “100% verified job” badge that implies a guarantee of employment.

## 12. What should be in the first release

### Include

- Polished homepage
- Keyword/location/industry search
- Current listing cards
- Employer and source profiles
- External application actions
- WhatsApp and email buttons where verified
- Manual employer submission
- RSS/API ingestion framework
- Admin moderation
- Freshness and expiry
- AdSense-ready layout
- Privacy, terms, report, and source disclosure pages
- XML sitemap, robots.txt, canonicals, metadata, analytics, and Search Console

### Defer

- Public candidate CV marketplace
- Complex employer ATS
- Candidate ranking/recruiter search
- Paid subscriptions
- In-platform chat
- AI job matching
- Large-scale unauthorised scraping

## 13. Suggested implementation stack

- **Frontend:** Next.js/TypeScript with server-rendered public pages
- **Backend:** REST API with role-based access
- **Database:** PostgreSQL
- **Search:** PostgreSQL full-text search first; Meilisearch later
- **Feed workers:** scheduled jobs with retries, logs, deduplication, and expiry
- **Storage:** only public logos initially; private CV storage only in a later phase
- **Analytics:** Google Analytics/Search Console plus privacy-conscious event tracking
- **Ads:** one central AdSense component with page-type placement rules
- **Admin:** moderation queue, source checker, redirect manager, feed monitor, ad-slot controls

## 14. 90-day launch plan

### Days 1–15: brand and migration foundation

Confirm JobeeLanka brand ownership, domain/DNS, hosting, analytics, Search Console, AdSense account status, old database, logo rights, and source permissions. Create the redirect map and clean the employer/category data.

### Days 16–40: build the public experience

Create the homepage, job directory, listing detail, employer pages, category pages, location pages, resources, contact actions, and admin moderation. Create `robots.txt`, XML sitemaps, canonical tags, and structured metadata.

### Days 41–60: populate and integrate

Add 100–300 fresh, clearly sourced listings. Add the first approved RSS/API connector, manual employer submission, source checking, stale-listing expiry, and alert signup.

### Days 61–75: SEO and policy review

Publish 15–25 useful career resources, test mobile performance, validate metadata and links, check AdSense placements, add privacy/cookie consent as required, and submit sitemaps.

### Days 76–90: public launch

Launch with a small group of employers, universities, training providers, and career communities. Measure search-to-detail clicks, external apply clicks, source freshness, organic indexing, returning users, and ad viewability. Fix weak pages before adding more categories.

## 15. Key metrics for this business model

- Organic impressions and clicks
- Returning job-seeker sessions
- Search-to-listing click rate
- Listing-to-external-apply click rate
- WhatsApp/email/source-link click rate
- Fresh live listings
- Broken/expired listing rate
- Verified employer count
- Employer repeat submissions
- Average page engagement on content pages
- Ad viewability and revenue per thousand sessions
- Ad policy violations or limited-ad warnings
- Reported scam/incorrect-listing rate

The most important business KPI is not raw page views. It is **qualified referral actions per fresh listing**, because useful referrals create repeat users and organic growth, while low-value pages create policy and SEO risk.

## 16. Revised copy-ready build prompt

```text
Build a polished, mobile-first website called “JobeeLanka” at jobeelanka.com.

Positioning:
JobeeLanka is Sri Lanka’s trusted jobs and career directory. It helps users discover employer career pages, current vacancies, recruitment websites, government opportunities, internships, remote work, and overseas employment resources. JobeeLanka is a discovery and referral platform. Applications, WhatsApp messages, emails, interviews, and hiring decisions are handled by the employer, recruiter, or original job source unless a listing explicitly says otherwise.

Business model:
- Primary monetisation: Google AdSense on high-value search, category, employer, location, and career-resource pages.
- Secondary future monetisation: paid featured employer profiles, sponsored listings, employer visibility packages, and career-event partnerships.
- Do not make candidate payments required to apply.
- Do not encourage ad clicks.
- Do not place ads where they can be mistaken for search filters, navigation, download buttons, or apply buttons.

Brand and design:
- Use JobeeLanka as the only main brand.
- Tagline: “Find jobs. Find employers. Find your next opportunity.”
- Visual style: modern, premium, clean, accessible, warm white background, dark charcoal text, deep green primary actions, amber/coral accent, rounded cards, strong typography, consistent icons, generous whitespace.
- Do not make the site look like an old directory, classifieds page, or ad farm.
- Keep search and employer-referral actions more visually prominent than advertising.

Homepage:
- Header: logo, Find Jobs, Companies, Industries, Locations, Resources, Post a Listing, Sign in.
- Hero heading: “Find your next opportunity in Sri Lanka”.
- Search fields: keyword, city/district, industry.
- Quick filters: New today, Colombo, Remote, Internships, Government, Overseas.
- Featured fresh listings.
- Browse by industry.
- Browse by location.
- Verified employers.
- Career resources.
- Email/Telegram alert signup with explicit consent.
- Include a clear application notice explaining that applications usually go to the employer or original source.

Listing types:
1. Employer career page.
2. Specific vacancy.
3. Recruiter vacancy.
4. Government vacancy.
5. Approved partner-feed listing.
6. Training/internship/resource listing.
7. Employer profile.

Every listing must show:
- Title
- Employer/source
- Listing type
- Location
- Industry
- Posted or last checked date
- Expiry/active status
- Verification level
- Source URL
- Application destination
- View details / Apply externally button
- WhatsApp/email actions only when explicitly verified and consented
- Report listing button

Important referral rules:
- Do not pretend JobeeLanka is the employer.
- Clearly label “Apply on employer website”, “Contact recruiter”, “Send WhatsApp enquiry”, or “Email HR”.
- Use safe wa.me and mailto links with URL-encoded text.
- Do not expose candidate CVs or personal data publicly.
- Do not scrape external sites without permission.
- Store source URL, permission status, date first seen, date last checked, and expiry date.
- Automatically pause broken, expired, or unconfirmed listings.

Public routes:
/, /jobs, /jobs/[slug], /companies, /companies/[slug], /industry/[slug], /location/[slug], /resources, /post-a-listing, /about, /contact, /privacy, /terms, /safety, /report-listing.

Employer workflow:
- Employer/recruiter registration.
- Email and domain verification.
- Submit employer career page or specific vacancy.
- Add official source URL, application URL, email, and WhatsApp contact if authorised.
- Moderator review.
- Publish with a precise badge: Email verified, Website verified, Employer reviewed, Official employer source, or Partner feed.
- Employer can edit, pause, renew, and expire listings.

Feed integrations:
- Build a feed adapter interface for RSS, XML, JSON, CSV, and REST API.
- Support approved ITPro.lk API/RSS partnership after credentials and written permission.
- Add scheduled sync, retries, rate limits, deduplication, normalisation, source attribution, and expiry.
- Never make unauthorised scraping the primary source.

AdSense implementation:
- Create reusable ad components controlled by page type.
- Homepage: limited display advertising below the search/primary content.
- Category/resource pages: one ad after meaningful content and another lower on long pages.
- Listing pages: modest ad placement that never competes with the apply/source action.
- No ads on login, submission success, report, empty-result, or thin redirect pages.
- No ad placement that resembles navigation or an apply button.
- Include privacy/cookie disclosures and keep ads separate from editorial labels.

SEO:
- Server-render public HTML.
- Unique title, meta description, canonical, Open Graph, breadcrumbs, one H1, internal links.
- Generate XML sitemaps for listings, employers, categories, locations, and resources.
- Ensure /robots.txt returns valid plain text and /sitemap.xml returns valid XML.
- Use JobPosting JSON-LD only when the page contains a complete current job description and genuine application path. For a simple external employer-directory page, use normal metadata and source attribution instead of pretending it is a full JobPosting.
- Noindex empty/duplicate faceted search URLs.
- Create useful landing pages for Sri Lanka jobs, Colombo jobs, remote jobs, internships, government jobs, IT jobs, banking jobs, and overseas jobs.

Technical stack:
- Next.js/TypeScript or equivalent server-rendered framework.
- PostgreSQL.
- REST API.
- Full-text search initially, Meilisearch later.
- Scheduled workers for feeds, freshness, expiry, alerts, and link checks.
- Admin dashboard for moderation, sources, listings, redirects, SEO health, and ad slots.
- Strong role-based access, rate limiting, audit logs, backups, monitoring, and tests.

Do not include in the MVP:
- Public candidate CV marketplace.
- Full applicant tracking system.
- In-platform chat.
- AI matching.
- Unauthorised scraping.
- Ad-heavy layouts.

Acceptance criteria:
- A visitor can find a relevant Sri Lankan opportunity in fewer than three interactions.
- Every listing makes the application destination obvious.
- A visitor can open the official employer site, WhatsApp, or email from the listing.
- A listing expires or pauses when stale.
- Duplicate feed items are merged while preserving source attribution.
- Public pages are crawlable without an anti-bot challenge.
- Ads never resemble navigation or application buttons.
- The site has enough original context and useful navigation to function as a real career directory rather than a collection of thin redirects.
```

## References

[1]: https://support.google.com/adsense/answer/48182?hl=en "Google AdSense Program policies"

[2]: https://support.google.com/adsense/answer/10502938?hl=en "Google Publisher Policies"

[3]: https://itpro.lk/developer/ "ITPro.lk Developer API"

[4]: https://itpro.lk/rss/ "ITPro.lk RSS feeds"

[5]: https://developers.google.com/search/docs/appearance/structured-data/job-posting "Google Search Central: Job posting structured data"

[6]: https://www.dpa.gov.lk/ "Data Protection Authority of Sri Lanka"
