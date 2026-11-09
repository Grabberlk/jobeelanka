const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on("error", reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        resolve({ status: res.statusCode, text: data, headers: res.headers });
      });
    }).on("error", reject);
  });
}

test("Live Port 3001 Server Integration Suite", async (t) => {
  await t.test("GET /api/v1/jobs returns 200 with > 1000 active listings by default", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/jobs");
    assert.equal(res.status, 200);
    assert.ok(res.data.success, "API should return success: true");
    assert.ok(res.data.total >= 1080, `Expected >= 1080 active jobs, got ${res.data.total}`);
  });

  await t.test("GET /api/v1/jobs?includeInactive=true returns all 1,140+ directory jobs", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/jobs?includeInactive=true");
    assert.equal(res.status, 200);
    assert.ok(res.data.total > 1140, `Expected > 1140 total jobs, got ${res.data.total}`);
  });

  await t.test("GET /api/v1/jobs?district=Colombo returns filtered Colombo listings", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/jobs?district=Colombo");
    assert.equal(res.status, 200);
    assert.ok(res.data.data.length > 50, "Should have more than 50 Colombo vacancies");
    for (const job of res.data.data.slice(0, 10)) {
      assert.equal(job.district.toLowerCase(), "colombo");
    }
  });

  await t.test("GET /api/v1/jobs/csv returns valid RFC 4180 CSV export with UTF-8 BOM", async () => {
    const res = await fetchText("http://localhost:3001/api/v1/jobs/csv");
    assert.equal(res.status, 200);
    assert.ok(res.headers["content-type"].includes("text/csv"));
    assert.ok(res.text.includes("code,title,employer,category"), "CSV should have standard headers");
    assert.ok(res.text.includes("24V40504BJC"), "Export should contain legacy ad codes");
  });

  await t.test("GET /about, /privacy, /terms return 200 with required disclosures", async () => {
    const about = await fetchText("http://localhost:3001/about");
    assert.equal(about.status, 200);

    const privacy = await fetchText("http://localhost:3001/privacy");
    assert.equal(privacy.status, 200);
    assert.ok(privacy.text.includes("PDPA No. 9 of 2022"), "Privacy page must cite Sri Lanka PDPA");

    const terms = await fetchText("http://localhost:3001/terms");
    assert.equal(terms.status, 200);
    assert.ok(terms.text.includes("We are independent organisation"), "Terms must contain independence disclaimer");
  });

  await t.test("Job detail page contains mandatory independence disclaimer", async () => {
    const res = await fetchText("http://localhost:3001/jobs/jobs-listed-in-akaramhub-2476");
    assert.equal(res.status, 200);
    assert.ok(res.text.includes("We are independent organisation and not associated with or sponsored by the organisation above"));
    assert.ok(res.text.includes("0094701781816"), "Should reveal contact phone/WhatsApp");
  });

  await t.test("GET /api/v1/jobs/[id]/apply redirects with 307 to apply destination", async () => {
    const res = await fetch("http://localhost:3001/api/v1/jobs/job-1/apply", {
      redirect: "manual",
    });
    assert.equal(res.status, 307);
    const location = res.headers.get("location");
    assert.ok(location, "Redirect location header must be present");
  });
});
