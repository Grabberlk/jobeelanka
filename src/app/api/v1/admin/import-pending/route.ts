import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { JobRepository } from "@/modules/jobs/repository";
import { persistImportedJobs } from "@/modules/feeds/persistence";
import { AnalyzedJobPreview } from "@/modules/feeds/types";
import { previewsToJobs } from "@/modules/feeds/bot/job-importer";

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
    const autoPublish = Boolean(body.autoPublish);

    if (!Array.isArray(previews) || previews.length === 0) {
      return NextResponse.json(
        { success: false, error: "No vacancies provided to import." },
        { status: 400 }
      );
    }

    const newJobs = previewsToJobs(previews, sourceName, autoPublish);

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
      message: autoPublish
        ? `Successfully published ${newJobs.length} listings to directory.`
        : `Successfully imported ${newJobs.length} listings into Moderation Queue as INACTIVE + PENDING.`,
      jobs: newJobs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to import jobs." },
      { status: 500 }
    );
  }
}
