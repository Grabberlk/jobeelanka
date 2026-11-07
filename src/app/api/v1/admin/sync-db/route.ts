import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { JobRepository } from "@/modules/jobs/repository";

function checkAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not set in environment.",
      },
      { status: 503 }
    );
  }

  try {
    const employers = JobRepository.getAllEmployers();
    const jobs = JobRepository.getAllJobs(true);

    // 1. Upsert Employers in batches of 50
    let employersCount = 0;
    for (let i = 0; i < employers.length; i += 50) {
      const batch = employers.slice(i, i + 50).map((emp) => ({
        id: emp.id,
        slug: emp.slug,
        legal_name: emp.legalName || emp.displayName,
        display_name: emp.displayName,
        logo: emp.logo || "",
        district: emp.district || "Colombo",
        website: emp.website || "",
        verified_domain: emp.verifiedDomain || "",
        official_whatsapp: emp.officialWhatsApp || null,
        verification_status: emp.verificationStatus || "VERIFIED_BUSINESS",
        is_featured: Boolean(emp.isFeatured),
        about: emp.about || "",
      }));

      const { error } = await supabase.from("employers").upsert(batch, { onConflict: "id" });
      if (error) {
        throw new Error(`Employers batch error: ${error.message}`);
      }
      employersCount += batch.length;
    }

    // 2. Upsert Jobs in batches of 50
    let jobsCount = 0;
    for (let i = 0; i < jobs.length; i += 50) {
      const batch = jobs.slice(i, i + 50).map((job) => ({
        id: job.id,
        code: job.code || `JL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        slug: job.slug,
        title: job.title,
        employer_id: job.employer?.id,
        industry: job.industry || "Information Technology",
        listing_type: job.listingType || "vacancy",
        city: job.city || "Colombo",
        district: job.district || "Colombo",
        country: "LK",
        work_mode: job.workMode || "ONSITE",
        employment_type: job.employmentType || "FULL_TIME",
        salary_min: job.salaryMin || null,
        salary_max: job.salaryMax || null,
        salary_currency: job.salaryCurrency || "LKR",
        salary_period: job.salaryPeriod || "MONTH",
        is_salary_disclosed: Boolean(job.isSalaryDisclosed),
        short_snippet: job.shortSnippet || "",
        description_html: job.descriptionHtml || `<p>${job.shortSnippet || ""}</p>`,
        responsibilities: job.responsibilities || [],
        qualifications: job.qualifications || [],
        required_skills: job.requiredSkills || [],
        benefits: (job as any).benefits || [],
        date_posted: job.datePosted || new Date().toISOString(),
        views_count: job.viewsCount || 1,
        featured: Boolean(job.featured),
        status: job.status || "ACTIVE",
        source_type: job.sourceType || "FIRST_PARTY",
        application_url: job.applicationUrl || job.applyUrl || job.sourceUrl || "https://",
        apply_url: job.applyUrl || null,
        apply_email: job.applyEmail || null,
        apply_whatsapp: job.applyWhatsApp || null,
        show_whatsapp: Boolean(job.showWhatsApp),
        show_email: Boolean(job.showEmail),
        show_phone: Boolean(job.showPhone),
      }));

      const { error } = await supabase.from("jobs").upsert(batch, { onConflict: "id" });
      if (error) {
        throw new Error(`Jobs batch error: ${error.message}`);
      }
      jobsCount += batch.length;
    }

    return NextResponse.json({
      success: true,
      message: `Database synchronized successfully! Seeded ${employersCount} employers and ${jobsCount} vacancies.`,
      stats: { employersCount, jobsCount },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
