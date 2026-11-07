import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Robots.txt for JobeeLanka (https://www.jobeelanka.com)
# Optimized for Googlebot, Bingbot, and Generative AI Agents (GPTBot, PerplexityBot, ClaudeBot)

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /swagger
Disallow: /dashboard/
Disallow: /*?*query=

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://www.jobeelanka.com/sitemap.xml
LLMs-Txt: https://www.jobeelanka.com/llms.txt
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

