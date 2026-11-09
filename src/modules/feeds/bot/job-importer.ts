import { AnalyzedJobPreview } from "../types";
import { Employer, Job } from "../../jobs/types";

export function previewsToJobs(
  previews: AnalyzedJobPreview[],
  sourceName: string,
  autoPublish = false
): Job[] {
  const batchId = Date.now();
  return previews
    .filter((preview) => preview.title && preview.applyUrl && /^https?:\/\//i.test(preview.applyUrl))
    .map((p, index) => {
      const company = p.company || "External Employer";
      const companySlug = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "external-employer";
      const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "vacancy";
      const employer: Employer = {
        id: `emp-bot-${companySlug}`,
        slug: companySlug,
        legalName: company,
        displayName: company,
        logo: p.companyLogo || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=128&auto=format&fit=crop&q=80",
        district: p.district || "Colombo",
        website: p.sourceUrl || p.applyUrl,
        verifiedDomain: (() => { try { return new URL(p.sourceUrl || p.applyUrl).hostname.replace(/^www\./, ""); } catch { return "external-source"; } })(),
        verificationStatus: autoPublish ? "PARTNER_SOURCE" : "PENDING",
        isFeatured: false,
        about: `Discovered and indexed via JobeeBot from ${sourceName}.`,
      };
      return {
        id: `job-bot-${batchId}-${index}`,
        code: `BOT-${batchId.toString(36).toUpperCase()}-${index + 1}`,
        slug: `${titleSlug}-${batchId.toString().slice(-5)}-${index}`,
        title: p.title,
        employer,
        listingType: "partner_feed",
        status: autoPublish ? "ACTIVE" : "INACTIVE",
        permissionStatus: autoPublish ? "APPROVED" : "PENDING",
        industry: p.industry || "Information Technology",
        shortSnippet: p.shortSnippet || `Vacancy at ${company}: ${p.title}.`,
        descriptionHtml: `<p>${(p.shortSnippet || p.title).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
        responsibilities: [],
        qualifications: [],
        requiredSkills: [],
        employmentType: p.employmentType || "FULL_TIME",
        workMode: p.workMode || "ONSITE",
        district: p.district || "Colombo",
        city: p.location || p.district || "Colombo",
        country: "LK",
        salaryCurrency: "LKR",
        salaryPeriod: "MONTH",
        isSalaryDisclosed: false,
        sourceType: "VERIFIED_LINK",
        sourceName,
        sourceUrl: p.sourceUrl,
        applyUrl: p.applyUrl,
        applicationUrl: p.applyUrl,
        directApplyAllowed: true,
        datePosted: p.postedDate || new Date().toISOString(),
        validThrough: p.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastCheckedAt: new Date().toISOString(),
        featured: false,
        viewsCount: 0,
        applicationsCount: 0,
      } as Job;
    });
}
