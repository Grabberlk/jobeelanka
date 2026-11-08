import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";
import { JobRepository } from "@/modules/jobs/repository";
import { persistImportedJobs, persistSyncLog } from "@/modules/feeds/persistence";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feedId = body.feedId;

    if (!feedId) {
      return NextResponse.json(
        { success: false, error: "feedId is required" },
        { status: 400 }
      );
    }

    const { addedJobs, log } = await FeedIngestionService.syncFeed(feedId);

    // Ingest into master job repository (memory store)
    if (addedJobs.length > 0) {
      JobRepository.injectFeedJobs(addedJobs);
      try {
        await persistImportedJobs(addedJobs);
      } catch (dbErr) {
        console.warn("Could not persist imported jobs to Supabase:", dbErr);
      }
    }

    try {
      await persistSyncLog(log);
    } catch (logErr) {
      console.warn("Could not persist feed sync log to Supabase:", logErr);
    }

    return NextResponse.json({
      success: true,
      message: log.message,
      data: {
        syncedItemsCount: addedJobs.length,
        log,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Feed sync failed" },
      { status: 500 }
    );
  }
}
