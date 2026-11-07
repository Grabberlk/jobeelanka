import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";

export async function GET() {
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

    return NextResponse.json({
      success: true,
      message: "Lead RSS feed source registered successfully",
      data: newFeed,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Failed to add feed source" },
      { status: 500 }
    );
  }
}

