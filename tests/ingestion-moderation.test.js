const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      }
    );
    req.on("error", reject);
    if (options.body) {
      req.write(typeof options.body === "string" ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

test("Ingestion & Moderation Pipeline Suite", async (t) => {
  await t.test("GET /api/v1/moderation returns HTTP 200 with array data", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/moderation");
    assert.equal(res.status, 200);
    assert.ok(res.data.success, "Response should be success: true");
    assert.ok(Array.isArray(res.data.data), "Moderation items should be an array");
  });

  await t.test("PATCH /api/v1/moderation returns 401 when no admin session cookie present", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: { jobId: "job-1", decision: "APPROVE" },
    });
    assert.equal(res.status, 401);
    assert.equal(res.data.success, false);
  });

  await t.test("GET /api/cron/feeds triggers and returns success 200", async () => {
    const res = await fetchJson("http://localhost:3001/api/cron/feeds");
    assert.equal(res.status, 200);
    assert.ok(res.data.success, "Cron should succeed");
    assert.ok(typeof res.data.feedsProcessed === "number", "Feeds processed count present");
  });

  await t.test("Feed sources endpoint GET /api/v1/feeds returns registered feeds", async () => {
    const res = await fetchJson("http://localhost:3001/api/v1/feeds");
    assert.equal(res.status, 200);
    assert.ok(res.data.success, "Feed endpoint should return success");
    assert.ok(res.data.data.feeds.length >= 4, "Should have preconfigured feed sources");
  });
});

