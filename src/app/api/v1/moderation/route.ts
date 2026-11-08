import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { getPendingModerationItems, moderateJob } from "@/modules/feeds/persistence";
import { JobRepository } from "@/modules/jobs/repository";
import { ModerationItem } from "@/modules/admin/data";

function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const moderationList: ModerationItem[] = [];

    // 1. Try fetching from Supabase if configured
    try {
      const dbPending = await getPendingModerationItems();
      if (dbPending && dbPending.length > 0) {
        for (const row of dbPending) {
          moderationList.push({
            id: `mod-${row.id}`,
            jobId: row.id,
            type: "JOB",
            title: `Review Listing: ${row.title}`,
            entityName: row.employers?.display_name || row.source_name || "External Organization",
            submittedBy: row.source_name || "Automated Ingestion Feed",
            submittedAt: row.created_at || new Date().toISOString(),
            status: "PENDING",
            riskScore: "LOW",
            notes: `Imported from ${row.source_url || row.source_name || "partner feed"}. Awaiting verification.`,
          });
        }
      }
    } catch (dbErr) {
      console.warn("Could not load moderation items from Supabase:", dbErr);
    }

    // 2. Fetch pending jobs from runtime JobRepository
    const memoryPending = JobRepository.getAllJobs(true).filter(
      (j) => j.permissionStatus === "PENDING"
    );
    for (const job of memoryPending) {
      if (!moderationList.some((m) => m.jobId === job.id)) {
        moderationList.push({
          id: `mod-${job.id}`,
          jobId: job.id,
          type: "JOB",
          title: `Review Listing: ${job.title}`,
          entityName: job.employer?.displayName || job.sourceName || "External Organization",
          submittedBy: job.sourceName || "Automated Ingestion Feed",
          submittedAt: job.datePosted || new Date().toISOString(),
          status: "PENDING",
          riskScore: "LOW",
          notes: job.moderationNote || `Imported lead from ${job.sourceUrl || job.sourceName || "partner feed"}. Awaiting verification.`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: moderationList,
      total: moderationList.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch moderation queue" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const admin = checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized: admin login required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { jobId, decision, note } = body;

    if (!jobId || !["APPROVE", "REJECT"].includes(decision)) {
      return NextResponse.json(
        { success: false, error: "Valid jobId and decision ('APPROVE' | 'REJECT') are required." },
        { status: 400 }
      );
    }

    const nextPermissionStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    const nextStatus = decision === "APPROVE" ? "ACTIVE" : "INACTIVE";

    // 1. Update in memory runtime JobRepository
    const updatedJob = JobRepository.updateJob(jobId, {
      permissionStatus: nextPermissionStatus,
      status: nextStatus,
      moderationNote: note || undefined,
      moderatedAt: new Date().toISOString(),
    });

    // 2. Update in Supabase PostgreSQL
    try {
      await moderateJob(jobId, decision, note);
    } catch (dbErr) {
      console.warn("Could not sync moderation status to Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} ${decision === "APPROVE" ? "approved for directory display" : "rejected and hidden"}.`,
      data: updatedJob,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Moderation action failed" },
      { status: 500 }
    );
  }
}
