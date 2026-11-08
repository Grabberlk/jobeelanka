import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";
import { persistFeed, loadPersistentFeeds } from "@/modules/feeds/persistence";

export async function GET() {
  try {
    const dbFeeds = await loadPersistentFeeds();
    if (dbFeeds && dbFeeds.length > 0) {
      FeedIngestionService.hydrateFeeds(dbFeeds);
    }
  } catch (err) {
    console.warn("Could not load persistent feeds from Supabase:", err);
  }

  const feeds = FeedIngestionService.getAllFeeds();
  const logs = FeedIngestionService.getSyncLogs();
  return NextResponse.json({
    success: true,
    data: {
      feeds,
      logs,
      totalFeeds: feeds.length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.url) {
      return NextResponse.json(
        { success: false, error: "Feed Name and RSS/XML URL are required" },
        { status: 400 }
      );
    }

    const newFeed = FeedIngestionService.addFeed({
      name: body.name,
      url: body.url,
      category: body.category || "Information Technology",
      district: body.district || "Colombo",
      sourceType: body.sourceType || "RSS",
      status: "ACTIVE",
      autoSyncIntervalMinutes: Number(body.autoSyncIntervalMinutes) || 60,
    });

    try {
      await persistFeed(newFeed);
    } catch (dbErr) {
      console.warn("Could not persist feed to Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Lead RSS feed source registered successfully",
      data: newFeed,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add feed source" },
      { status: 500 }
    );
  }
}
