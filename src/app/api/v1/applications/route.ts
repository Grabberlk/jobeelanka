import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.jobId || !body.candidateName || !body.candidateEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required application fields" },
        { status: 400 }
      );
    }

    if (!body.pdpaConsentGiven) {
      return NextResponse.json(
        { success: false, error: "PDPA Consent is required under Sri Lankan law" },
        { status: 400 }
      );
    }

    const application = JobRepository.submitApplication({
      jobId: body.jobId,
      candidateName: body.candidateName,
      candidateEmail: body.candidateEmail,
      candidatePhone: body.candidatePhone,
      cvFileName: body.cvFileName || "Resume.pdf",
      coverNote: body.coverNote,
      pdpaConsentGiven: body.pdpaConsentGiven,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted and encrypted under PDPA rules",
        data: application,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  const apps = jobId
    ? JobRepository.getApplicationsByJobId(jobId)
    : JobRepository.getAllApplications();

  return NextResponse.json({
    success: true,
    data: apps,
    total: apps.length,
  });
}

