import { NextRequest, NextResponse } from "next/server";
import { JobRepository } from "@/modules/jobs/repository";
import { CsvService } from "@/modules/csv/csv-service";

/**
 * GET /api/v1/jobs/csv
 * Returns CSV file export of jobs, or template if ?template=true
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isTemplate = searchParams.get("template") === "true";

  if (isTemplate) {
    const csvContent = CsvService.generateCsvTemplate();
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="jobeelanka_template.csv"',
        "Cache-Control": "no-cache",
      },
    });
  }

  const jobs = JobRepository.getAllJobs(true);
  const csvContent = CsvService.exportJobsToCsv(jobs);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jobeelanka_directory_export_${new Date().toISOString().split("T")[0]}.csv"`,
      "Cache-Control": "no-cache",
    },
  });
}

/**
 * POST /api/v1/jobs/csv
 * Imports jobs from raw CSV text or { csvText: string } payload
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let csvText = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      csvText = body.csvText || "";
    } else {
      csvText = await request.text();
    }

    if (!csvText || !csvText.trim()) {
      return NextResponse.json(
        { success: false, error: "Empty CSV content provided." },
        { status: 400 }
      );
    }

    const { jobs, errors } = CsvService.parseJobsFromCsv(csvText);

    if (jobs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid jobs could be parsed from the CSV file.",
          details: errors,
        },
        { status: 400 }
      );
    }

    const importedCount = JobRepository.batchImportJobs(jobs);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedCount} jobs into the directory.`,
      importedCount,
      errors: errors.length > 0 ? errors : undefined,
      jobs: JobRepository.getAllJobs(true),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process CSV file.",
      },
      { status: 500 }
    );
  }
}

