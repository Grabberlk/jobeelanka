import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/modules/auth/admin-auth";
import { loadSourceCandidates, SourceCandidate, persistFeed } from "@/modules/feeds/persistence";
import { JobRepository } from "@/modules/jobs/repository";
import { FeedIngestionService } from "@/modules/feeds/rss-parser";

function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("jobeelanka_admin_session")?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export async function GET(req: NextRequest) {
  const admin = checkAdminAuth(req);
  if (!admin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    let candidates: SourceCandidate[] = [];

    // 1. Try loading from Supabase
    try {
      candidates = await loadSourceCandidates();
    } catch (err) {
      console.warn("Could not load candidates from Supabase, falling back to repository:", err);
    }

    // 2. If DB had 0 or not configured, extract from runtime repository
    if (candidates.length === 0) {
      const candidatesMap = new Map<string, SourceCandidate>();
      const addCandidate = (rawUrl?: string, name = "Employer", category?: string, district?: string) => {
        if (!rawUrl || !rawUrl.startsWith("http")) return;
        try {
          const u = new URL(rawUrl);
          if (/jobeelanka\.(vercel\.app|com)/i.test(u.hostname)) return;
          const key = u.origin.toLowerCase();
          if (!candidatesMap.has(key)) {
            candidatesMap.set(key, {
              url: `${u.origin}/`,
              name,
              category,
              district: district || "Colombo",
            });
          }
        } catch {
          // ignore malformed
        }
      };

      for (const emp of JobRepository.getAllEmployers()) {
        addCandidate(emp.website, emp.displayName, undefined, emp.district);
      }
      for (const job of JobRepository.getAllJobs(true)) {
        addCandidate(job.sourceUrl, job.sourceName || job.employer?.displayName, job.industry, job.district);
      }
      candidates = Array.from(candidatesMap.values());
    }

    return NextResponse.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load source candidates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const admin = checkAdminAuth(req);
  if (!admin && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const candidateList: SourceCandidate[] = body.candidates || [];

    if (!Array.isArray(candidateList) || candidateList.length === 0) {
      return NextResponse.json(
        { success: false, error: "No candidates selected." },
        { status: 400 }
      );
    }

    const addedFeeds = [];

    for (const c of candidateList) {
      const newFeed = FeedIngestionService.addFeed({
        name: c.name || "Auto-Discovered Source",
        url: c.url,
        category: c.category || "Information Technology",
        district: c.district || "Colombo",
        sourceType: "BOT_DISCOVERED",
        status: "ACTIVE",
        trustLevel: "MANUAL",
        autoPublish: false,
        autoSyncIntervalMinutes: 180,
      });

      try {
        await persistFeed(newFeed);
      } catch (dbErr) {
        console.warn("Could not persist feed to Supabase:", dbErr);
      }

      addedFeeds.push(newFeed);
    }

    return NextResponse.json({
      success: true,
      count: addedFeeds.length,
      message: `Registered ${addedFeeds.length} source candidates into Ingestion Manager.`,
      data: addedFeeds,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register candidates." },
      { status: 500 }
    );
  }
}

