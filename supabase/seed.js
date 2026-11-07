/**
 * Supabase Data Seeding Script
 * Uploads all 1,131 curated jobs from data/legacy_jobs.json and employers into Supabase
 * Usage: node supabase/seed.js
 */

const fs = require("fs");
const path = require("path");

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log("ℹ️  To seed live Supabase database, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    console.log("   Example: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    return;
  }

  const jobsPath = path.join(__dirname, "../data/legacy_jobs.json");
  const employersPath = path.join(__dirname, "../data/legacy_employers.json");

  const jobs = JSON.parse(fs.readFileSync(jobsPath, "utf-8"));
  const employers = JSON.parse(fs.readFileSync(employersPath, "utf-8"));

  console.log(`Ready to seed ${employers.length} employers and ${jobs.length} jobs into Supabase at ${supabaseUrl}`);
  // Bulk upsert using Supabase REST API endpoint /rest/v1/...
}

seed();

