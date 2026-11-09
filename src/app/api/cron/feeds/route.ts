import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";
import { JobRepository } from "@/modules/jobs/repository";
import {
  persistImportedJobs,
  persistSyncLog,
  loadPersistentFeeds,
  archiveExpiredDatabaseJobs,
} from "@/modules/feeds/persistence";

async function executeCronSync(req: NextRequest) {
  // Optional security check for Vercel Cron Secret
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  // 1. Hydrate dynamic feeds from Supabase if connected
  try {
    const dbFeeds = await loadPersistentFeeds();
    if (dbFeeds && dbFeeds.length > 0) {
      FeedIngestionService.hydrateFeeds(dbFeeds);
    }
  } catch (err) {
    console.warn("[Cron] Could not load feeds from Supabase, using in-memory registry:", err);
  }

  const activeFeeds = FeedIngestionService.getActiveFeeds();
  const results = [];

  for (const feed of activeFeeds) {
    try {
      const { addedJobs, log } = await FeedIngestionService.syncFeed(feed.id);

      if (addedJobs.length > 0) {
        JobRepository.injectFeedJobs(addedJobs);
        try {
          await persistImportedJobs(addedJobs);
        } catch (dbErr) {
          console.warn(`[Cron] Supabase persist failed for feed ${feed.id}:`, dbErr);
        }
      }

      try {
        await persistSyncLog(log);
      } catch (logErr) {
        console.warn(`[Cron] Supabase sync log failed for feed ${feed.id}:`, logErr);
      }

      results.push({
        feedId: feed.id,
        feedName: feed.name,
        added: addedJobs.length,
        status: log.status,
      });
    } catch (e: any) {
      results.push({
        feedId: feed.id,
        feedName: feed.name,
        error: e.message || "Failed sync",
      });
    }
  }

  // 2. Archive expired listings automatically
  const memoryArchived = JobRepository.archiveExpiredJobs();
  let dbArchived = 0;
  try {
    dbArchived = await archiveExpiredDatabaseJobs();
  } catch (e) {
    console.warn("[Cron] Database job expiration sweep skipped:", e);
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    feedsProcessed: activeFeeds.length,
    archivedCount: memoryArchived + dbArchived,
    results,
  });
}

export async function GET(req: NextRequest) {
  return executeCronSync(req);
}

export async function POST(req: NextRequest) {
  return executeCronSync(req);
}

