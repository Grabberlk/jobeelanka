import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const job = JobRepository.getJobById(id) || JobRepository.getJobBySlug(id);

  if (!job) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: job });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = JobRepository.updateJob(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      data: updated,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = JobRepository.deleteJob(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Job deleted successfully" });
}

