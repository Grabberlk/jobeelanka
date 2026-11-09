import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const job = JobRepository.getJobById(id);

  if (!job) {
    // If not in local repository, attempt Supabase lookup
    const client = getSupabaseAdminClient();
    if (client) {
      const { data } = await client
        .from("jobs")
        .select("id, apply_url, application_url, source_url, applications_count")
        .eq("id", id)
        .single();

      if (data) {
        const targetUrl = data.apply_url || data.application_url || data.source_url || "/";
        // Fire-and-forget increment in Supabase
        client
          .from("jobs")
          .update({ applications_count: (data.applications_count || 0) + 1 })
          .eq("id", id)
          .then();

        return NextResponse.redirect(new URL(targetUrl, req.url), 307);
      }
    }
    return NextResponse.redirect(new URL("/jobs", req.url), 307);
  }

  // Increment view/apply count
  job.applicationsCount = (job.applicationsCount || 0) + 1;
  const targetUrl =
    job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website || "/";

  // If Supabase is connected, update database counter in background
  const client = getSupabaseAdminClient();
  if (client) {
    client
      .from("jobs")
      .update({ applications_count: job.applicationsCount })
      .eq("id", job.id)
      .then();
  }

  return NextResponse.redirect(new URL(targetUrl, req.url), 307);
}
