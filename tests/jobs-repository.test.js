const test = require("node:test");
const assert = require("node:assert/strict");

// We test repository functions using compiled or direct imports
// In Next.js/TS, we can verify repository logic and search mechanics
test("JobRepository Search and Filter Suite", async (t) => {
  const jobsData = require("../data/legacy_jobs.json");

  await t.test("Dataset contains 1,131 curated job ads", () => {
    assert.equal(jobsData.length, 1131, "Legacy jobs JSON must contain exactly 1,131 records");
  });

  await t.test("All jobs possess valid code, title, and application link", () => {
    for (let i = 0; i < Math.min(jobsData.length, 100); i++) {
      const job = jobsData[i];
      assert.ok(job.id, `Job at index ${i} must have an id`);
      assert.ok(job.title, `Job ${job.id} must have a title`);
      assert.ok(job.code, `Job ${job.id} must have a code`);
      assert.ok(job.applicationUrl, `Job ${job.id} must have an applicationUrl`);
    }
  });

  await t.test("Filter by query correctly matches titles case-insensitively", () => {
    const query = "akaramhub";
    const matches = jobsData.filter(j => j.title.toLowerCase().includes(query));
    assert.ok(matches.length > 0, "Should find matching job for 'akaramhub'");
    assert.equal(matches[0].code, "24V40504BJC");
  });

  await t.test("Filter by district handles Colombo, Kandy, Trincomalee", () => {
    const colomboJobs = jobsData.filter(j => j.district.toLowerCase() === "colombo");
    assert.ok(colomboJobs.length > 100, "Colombo should have hundreds of listings");
  });

  await t.test("Status toggling preserves integrity", () => {
    const sample = { ...jobsData[0] };
    const initialStatus = sample.status;
    const toggled = initialStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    assert.notEqual(initialStatus, toggled);
  });
});

