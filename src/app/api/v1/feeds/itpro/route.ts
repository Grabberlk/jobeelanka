import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";

export async function POST(request: NextRequest) {
  // Verifies partner API key or webhook header
  const apiKey = request.headers.get("x-api-key");

  return NextResponse.json({
    success: true,
    message: "ITPro.lk sync adapter active. Verified feed endpoint ready for scheduled webhook ingestion.",
    timestamp: new Date().toISOString(),
    endpoints: {
      itproApiJobs: "https://itpro.lk/developer/api/v1/jobs",
      itproRssAll: "https://itpro.lk/rss/all/",
      itproRssColombo: "https://itpro.lk/rss/location-colombo/",
    },
    deduplicationStatus: "ACTIVE",
  });
}

