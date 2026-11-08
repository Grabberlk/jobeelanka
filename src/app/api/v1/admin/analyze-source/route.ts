import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { SourceAnalyzerService } from "@/modules/feeds/bot/source-analyzer";

function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function POST(req: NextRequest) {
  // Allow authenticated admin, or dev environment inspection
  const admin = checkAdminAuth(req);
  if (!admin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized: admin login required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const targetUrl = (body.url || "").trim();

    if (!targetUrl || !targetUrl.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "A valid http:// or https:// URL is required." },
        { status: 400 }
      );
    }

    const report = await SourceAnalyzerService.analyzeSource(targetUrl);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to analyze source URL." },
      { status: 500 }
    );
  }
}
