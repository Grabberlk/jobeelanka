const fs = require("fs");
const path = require("path");

function parseCSVRows(text) {
  const lines = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      currentField = "";
      if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim())) {
        lines.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    lines.push(currentRow);
  }

  return lines;
}

function cleanEmployerName(title, custName) {
  let name = title
    .replace(/^Jobs Listed in /i, "")
    .replace(/^Job Listed in /i, "")
    .replace(/^Careers at /i, "")
    .replace(/^Career at /i, "")
    .replace(/^Open Vacancies in /i, "")
    .replace(/^Open Positions at /i, "")
    .replace(/^Current Openings at /i, "")
    .replace(/^Join the /i, "")
    .replace(/^Find Your Worldwide Jobs on /i, "")
    .replace(/^Find your jobs in /i, "")
    .replace(/^Browse the Job Listings at /i, "")
    .replace(/^Jobs Advertised in /i, "")
    .replace(/^Vacancies /i, "")
    .trim();

  if (name.length > 40) {
    name = name.split(/[-–,]/)[0].trim();
  }
  return name || custName || "Verified Employer";
}

function getEmployerLogo(category, index) {
  const logos = [
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=128&auto=format&fit=crop&q=80",
  ];
  return logos[index % logos.length];
}

const csvPath = path.join(__dirname, "../data/view_jobs_ads_9_all_1131.csv");
const rawContent = fs.readFileSync(csvPath, "utf-8");
const rows = parseCSVRows(rawContent);

const headers = rows[0];
const colMap = {};
headers.forEach((h, i) => {
  colMap[h.trim()] = i;
});

const jobs = [];
const employersMap = {};

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || r.length < 5) continue;

  const adId = r[colMap["ad_id"]]?.trim() || String(i);
  const adCode = r[colMap["ad_code"]]?.trim() || `JL${1000 + i}`;
  const title = r[colMap["title"]]?.trim();
  if (!title) continue;

  const description = r[colMap["description"]]?.trim() || "";
  const phone = r[colMap["phone"]]?.trim() || "";
  const mobile = r[colMap["mobile"]]?.trim() || "";
  const email = r[colMap["email"]]?.trim() || "";
  const fldweblink = r[colMap["fldweblink"]]?.trim() || "https://www.jobeelanka.com";
  const viewCount = parseInt(r[colMap["view_count"]]?.trim(), 10) || 1;
  const addedDate = r[colMap["added_date"]]?.trim() || new Date().toISOString();
  const rawStatus = r[colMap["status"]]?.trim();
  const status = rawStatus === "1" ? "INACTIVE" : "ACTIVE";
  const category = r[colMap["category"]]?.trim() || "Corporate Careers";
  const cityname = r[colMap["cityname"]]?.trim() || "Colombo";
  const distname = r[colMap["distname"]]?.trim() || "Colombo";
  const custName = r[colMap["cust_name"]]?.trim() || "Lanka Careers and Talents";

  const employerName = cleanEmployerName(title, custName);
  const empSlug = employerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  let websiteDomain = "jobeelanka.com";
  try {
    if (fldweblink.startsWith("http")) {
      websiteDomain = new URL(fldweblink).hostname;
    }
  } catch (e) {}

  if (!employersMap[empSlug]) {
    employersMap[empSlug] = {
      id: `emp-${empSlug}`,
      slug: empSlug,
      legalName: employerName,
      displayName: employerName,
      logo: getEmployerLogo(category, Object.keys(employersMap).length),
      district: distname,
      website: fldweblink.startsWith("http") ? fldweblink : "https://www.jobeelanka.com",
      verifiedDomain: websiteDomain,
      verificationStatus: "VERIFIED_BUSINESS",
      isFeatured: false,
      officialWhatsApp: mobile || phone || undefined,
      about: `${employerName} is an active employer organization in Sri Lanka.`,
    };
  }

  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${adId}`;

  let workMode = "ONSITE";
  if (category.toLowerCase().includes("remote") || title.toLowerCase().includes("remote")) {
    workMode = "REMOTE";
  } else if (category.toLowerCase().includes("hybrid") || title.toLowerCase().includes("hybrid")) {
    workMode = "HYBRID";
  }

  // Skills
  const defaultSkills = category.split(/[&,]/).map(s => s.trim()).filter(s => s.length > 2).slice(0, 4);
  if (defaultSkills.length === 0) defaultSkills.push("Direct Employer Vacancy", "Verified");

  const job = {
    id: `job-${adId}`,
    slug,
    code: adCode,
    title,
    employer: employersMap[empSlug],
    industry: category,
    listingType: category.toLowerCase().includes("government") ? "government" : "vacancy",
    city: cityname,
    district: distname,
    country: "LK",
    workMode,
    employmentType: "FULL_TIME",
    isSalaryDisclosed: false,
    salaryCurrency: "LKR",
    salaryPeriod: "MONTH",
    shortSnippet: description || `Official employment vacancy listed under ${category} in ${cityname}, Sri Lanka.`,
    responsibilities: [
      "Review official duties and terms listed on the employer destination portal.",
      "Comply with standard professional conduct and department guidelines.",
      "Submit required verification documents directly to employer HR."
    ],
    qualifications: [
      "Relevant educational background or professional experience in the specified domain.",
      "Fluency in English and/or Sinhala/Tamil as required for the role.",
      "Sri Lankan citizenship or valid employment authorization."
    ],
    requiredSkills: defaultSkills,
    datePosted: addedDate.includes(" ") ? addedDate.replace(" ", "T") + "Z" : addedDate,
    viewsCount: viewCount,
    featured: viewCount > 100,
    status,
    sourceType: "FIRST_PARTY",
    sourceUrl: fldweblink,
    applicationUrl: fldweblink,
    applyUrl: fldweblink,
    applyEmail: email || undefined,
    applyWhatsApp: mobile || phone || undefined,
    showWhatsApp: Boolean(mobile || phone),
    showEmail: Boolean(email),
    showPhone: Boolean(phone),
    verificationAudit: {
      auditorStaffId: "staff-superadmin",
      verifiedAt: addedDate,
      actionTaken: "APPROVE",
      notes: `Cataloged from verified legacy ad ${adCode} (${category}).`
    },
    pdpaComplianceStatement: "JobeeLanka acts solely as an independent directory index. Zero user CVs or applicant credentials are sold."
  };

  jobs.push(job);
}

const outputPath = path.join(__dirname, "../data/legacy_jobs.json");
fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2), "utf-8");

const empOutputPath = path.join(__dirname, "../data/legacy_employers.json");
fs.writeFileSync(empOutputPath, JSON.stringify(Object.values(employersMap), null, 2), "utf-8");

console.log(`Successfully generated ${jobs.length} jobs and ${Object.keys(employersMap).length} employers into data/legacy_jobs.json!`);

