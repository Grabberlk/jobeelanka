import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const employer = JobRepository.getEmployerById(id) || JobRepository.getEmployerBySlug(id);

  if (!employer) {
    return NextResponse.json({ success: false, error: "Employer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: employer });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = JobRepository.updateEmployer(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Employer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Employer contact & KYC updated successfully",
      data: updated,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = JobRepository.deleteEmployer(id);

  if (!deleted) {
    return NextResponse.json({ success: false, error: "Employer not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Employer removed successfully" });
}

