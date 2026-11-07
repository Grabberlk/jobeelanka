import { NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

export async function GET() {
  const employers = JobRepository.getAllEmployers();
  return NextResponse.json({
    success: true,
    data: employers,
    total: employers.length,
  });
}

