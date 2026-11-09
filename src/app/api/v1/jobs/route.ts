import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";
import { WorkMode, EmploymentType } from "@/modules/jobs/types";
import { loadPersistentJobs } from "@/modules/feeds/persistence";

let isHydrated = false;

async function ensureHydrated() {
  if (isHydrated) return;
  try {
    const dbJobs = await loadPersistentJobs(true);
    if (dbJobs && dbJobs.length > 0) {
      JobRepository.hydrateJobs(dbJobs);
    }
  } catch {
    // Memory store remains authoritative if Supabase is offline
  } finally {
    isHydrated = true;
  }
}

export async function GET(request: NextRequest) {
  await ensureHydrated();

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") || undefined;
  const district = searchParams.get("district") || undefined;
  const industry = searchParams.get("industry") || undefined;
  const workMode = (searchParams.get("workMode") as WorkMode) || undefined;
  const employmentType = (searchParams.get("employmentType") as EmploymentType) || undefined;
  const salaryMin = searchParams.get("salaryMin") ? Number(searchParams.get("salaryMin")) : undefined;
  const isVerifiedOnly = searchParams.get("isVerifiedOnly") === "true";
  const includeInactive = searchParams.get("includeInactive") === "true";

  const data = JobRepository.searchJobs({
    query,
    district,
    industry,
    workMode,
    employmentType,
    salaryMin,
    isVerifiedOnly,
    includeInactive,
  });

  return NextResponse.json(
    {
      success: true,
      data: data.jobs,
      total: data.total,
      facets: data.facets,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.district) {
      return NextResponse.json(
        { success: false, error: "Title and District are required" },
        { status: 400 }
      );
    }

    const newJob = JobRepository.createJob(body);

    return NextResponse.json(
      {
        success: true,
        message: "Job vacancy created successfully",
        data: newJob,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create job vacancy" },
      { status: 500 }
    );
  }
}
