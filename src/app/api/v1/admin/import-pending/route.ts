import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { JobRepository } from "@/modules/jobs/repository";
import { persistImportedJobs } from "@/modules/feeds/persistence";
import { AnalyzedJobPreview } from "@/modules/feeds/types";
import { Job, Employer } from "@/modules/jobs/types";

function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function POST(req: NextRequest) {
  const admin = checkAdminAuth(req);
  if (!admin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized: admin login required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const previews: AnalyzedJobPreview[] = body.jobs || [];
    const sourceName = body.sourceName || "JobeeBot Discovery";

    if (!Array.isArray(previews) || previews.length === 0) {
      return NextResponse.json(
        { success: false, error: "No vacancies provided to import." },
        { status: 400 }
      );
    }

    const newJobs: Job[] = [];

    for (let i = 0; i < previews.length; i++) {
      const p = previews[i];
      const companySlug = (p.company || "enterprise")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const employer: Employer = {
        id: `emp-bot-${companySlug || "ext"}`,
        slug: companySlug || "external-employer",
        legalName: p.company || "External Employer",
        displayName: p.company || "External Employer",
        logo: p.companyLogo || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=128&auto=format&fit=crop&q=80",
        district: p.district || "Colombo",
        website: p.sourceUrl || p.applyUrl,
        verifiedDomain: companySlug ? `${companySlug}.lk` : "example.lk",
        verificationStatus: "PENDING",
        isFeatured: false,
        about: `Discovered and indexed via JobeeBot from ${sourceName}.`,
      };

      const titleSlug = (p.title || "vacancy")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const job: Job = {
        id: `job-bot-${Date.now()}-${i}`,
        code: `BOT-${Date.now().toString(36).toUpperCase()}-${i + 1}`,
        slug: `${titleSlug}-${Date.now().toString().slice(-4)}`,
        title: p.title,
        employer,
        listingType: "partner_feed",
        status: "INACTIVE", // Crucial: Staged as INACTIVE
        permissionStatus: "PENDING", // Crucial: Awaiting human moderation
        industry: p.industry || "Information Technology",
        shortSnippet: p.shortSnippet || `Vacancy at ${p.company}: ${p.title}.`,
        descriptionHtml: `<p>${p.shortSnippet || p.title}</p>`,
        responsibilities: [],
        qualifications: [],
        requiredSkills: [],
        employmentType: p.employmentType || "FULL_TIME",
        workMode: p.workMode || "ONSITE",
        district: p.district || "Colombo",
        city: p.district || "Colombo",
        country: "LK",
        salaryCurrency: "LKR",
        salaryPeriod: "MONTH",
        isSalaryDisclosed: false,
        sourceType: "PARTNER_RSS",
        sourceName,
        sourceUrl: p.sourceUrl,
        applyUrl: p.applyUrl,
        applicationUrl: p.applyUrl,
        directApplyAllowed: true,
        datePosted: p.postedDate || new Date().toISOString(),
        validThrough: p.closingDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false,
        viewsCount: 0,
        applicationsCount: 0,
      };

      newJobs.push(job);
    }

    // 1. Inject into runtime store
    JobRepository.injectFeedJobs(newJobs);

    // 2. Persist to Supabase if configured
    try {
      await persistImportedJobs(newJobs);
    } catch (dbErr) {
      console.warn("Could not persist bot jobs to Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      count: newJobs.length,
      message: `Successfully imported ${newJobs.length} listings into Moderation Queue as INACTIVE + PENDING.`,
      jobs: newJobs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to import pending jobs." },
      { status: 500 }
    );
  }
}
