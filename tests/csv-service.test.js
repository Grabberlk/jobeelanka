const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("CSV Service Suite", async (t) => {
  const csvPath = path.join(__dirname, "../data/view_jobs_ads_9_all_1131.csv");

  await t.test("Legacy CSV file exists and has valid header", () => {
    assert.ok(fs.existsSync(csvPath), "view_jobs_ads_9_all_1131.csv must exist in data/");
    const firstLine = fs.readFileSync(csvPath, "utf-8").split(/\r?\n/)[0];
    assert.ok(firstLine.includes("ad_code"), "CSV header must contain ad_code");
    assert.ok(firstLine.includes("fldweblink"), "CSV header must contain fldweblink");
    assert.ok(firstLine.includes("cityname"), "CSV header must contain cityname");
  });

  await t.test("CSV line count matches 1,132 rows (1 header + 1,131 data)", () => {
    const lines = fs.readFileSync(csvPath, "utf-8").split(/\r?\n/).filter(Boolean);
    assert.equal(lines.length, 1132, "CSV should have 1132 lines");
  });
});

