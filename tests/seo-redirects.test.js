const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("SEO & Redirects Configuration Suite", async (t) => {
  const redirectsPath = path.join(__dirname, "../src/lib/redirects.json");

  await t.test("redirects.json is valid and covers retired routes", () => {
    assert.ok(fs.existsSync(redirectsPath), "redirects.json must exist");
    const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf-8"));
    assert.ok(Array.isArray(redirects), "redirects must be an array");

    const sources = redirects.map(r => r.source);
    assert.ok(sources.includes("/salaries"), "/salaries must be redirected");
    assert.ok(sources.includes("/vacancies"), "/vacancies must be redirected");
    assert.ok(sources.includes("/post-a-vacancy"), "/post-a-vacancy must be redirected");
    assert.ok(sources.includes("/report"), "/report must be redirected");
  });

  await t.test("robots.txt route disallows /admin", () => {
    const robotsPath = path.join(__dirname, "../src/app/robots.txt/route.ts");
    assert.ok(fs.existsSync(robotsPath), "robots.txt route must exist");
    const content = fs.readFileSync(robotsPath, "utf-8");
    assert.ok(content.includes("/admin"), "robots.txt must protect /admin");
    assert.ok(content.includes("sitemap.xml"), "robots.txt must point to sitemap.xml");
  });

  await t.test("sitemap.xml route includes legal and safety pages", () => {
    const sitemapPath = path.join(__dirname, "../src/app/sitemap.xml/route.ts");
    assert.ok(fs.existsSync(sitemapPath), "sitemap.xml route must exist");
    const content = fs.readFileSync(sitemapPath, "utf-8");
    assert.ok(content.includes("/about"), "sitemap must include /about");
    assert.ok(content.includes("/privacy"), "sitemap must include /privacy");
    assert.ok(content.includes("/terms"), "sitemap must include /terms");
  });
});

