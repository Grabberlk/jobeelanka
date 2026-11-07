import { NextResponse } from "next/server";
import { SEED_JOBS, SRI_LANKA_DISTRICTS } from "@/modules/jobs/data";

export async function GET() {
  const baseUrl = "https://www.jobeelanka.com";

  const staticRoutes = [
    "",
    "/jobs",
    "/companies",
    "/safety",
    "/report-listing",
    "/about",
    "/privacy",
    "/terms",
  ];

  const jobUrls = SEED_JOBS.map(
    (job) => `
    <url>
      <loc>${baseUrl}/jobs/${job.slug}</loc>
      <lastmod>${job.datePosted ? job.datePosted.split("T")[0] : "2026-11-06"}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`
  ).join("");

  const districtUrls = SRI_LANKA_DISTRICTS.filter((d) => d !== "All Districts")
    .map(
      (district) => `
    <url>
      <loc>${baseUrl}/jobs?district=${encodeURIComponent(district)}</loc>
      <lastmod>2026-11-06</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join("");

  const staticUrls = staticRoutes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>2026-11-06</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${jobUrls}
  ${districtUrls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

