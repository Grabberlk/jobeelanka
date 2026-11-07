import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: "Status field is required" },
        { status: 400 }
      );
    }

    const updated = JobRepository.updateApplicationStatus(id, body.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${body.status}`,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}

