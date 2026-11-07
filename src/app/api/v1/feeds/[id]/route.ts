import { NextRequest, NextResponse } from "next/server";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = FeedIngestionService.deleteFeed(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Feed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead RSS feed deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete feed" },
      { status: 500 }
    );
  }
}

