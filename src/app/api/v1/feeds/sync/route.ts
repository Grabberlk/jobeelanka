import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";
import { JobRepository } from "@/modules/jobs/repository";

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

    // Ingest into master job repository
    if (addedJobs.length > 0) {
      JobRepository.injectFeedJobs(addedJobs);
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

