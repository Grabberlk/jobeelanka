import { Job, Employer } from "../jobs/types";

/**
 * CSV Service for JobeeLanka Job Portal Directory
 * Matching the exact structure of the legacy back-office:
 * Code | Title | Employer | Category | City | District | Url | Logo | Status | Views | ShowWhatsApp | ShowEmail | ShowPhone
 */

export interface CsvJobRow {
  code: string;
  title: string;
  employer: string;
  category: string;
  city: string;
  district: string;
  url: string;
  logo: string;
  status: "ACTIVE" | "INACTIVE";
  views: number;
  showWhatsApp: boolean;
  showEmail: boolean;
  showPhone: boolean;
  dateAdded: string;
}

export const CsvService = {
  /**
   * Generates a sample CSV template for admin data entry
   */
  generateCsvTemplate(): string {
    const headers = [
      "code",
      "title",
      "employer",
      "category",
      "city",
      "district",
      "url",
      "logo",
      "status",
      "views",
      "showWhatsApp",
      "showEmail",
      "showPhone",
      "dateAdded",
    ];

    const sampleRows = [
      [
        "110B0PNNQ1R",
        "Careers in WHO World Health Organisation Sri Lanka",
        "WHO Sri Lanka",
        "INGO's in Sri Lanka",
        "Any part of Sri Lanka",
        "Colombo",
        "https://www.who.int/careers",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=128&auto=format&fit=crop&q=80",
        "ACTIVE",
        "1945",
        "false",
        "false",
        "false",
        "2026-11-06",
      ],
      [
        "1683Q1F80C6",
        "Jobs advertised in UNDP - Sri Lanka",
        "UNDP Sri Lanka",
        "UN Missions in Sri Lanka",
        "Worldwide",
        "Colombo",
        "https://www.undp.org/sri-lanka/careers",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=128&auto=format&fit=crop&q=80",
        "ACTIVE",
        "1356",
        "false",
        "false",
        "false",
        "2026-11-06",
      ],
      [
        "1TJNCATS9UG",
        "Careers at UB Finance",
        "UB Finance",
        "Finance Company Sites",
        "Colombo 2",
        "Colombo",
        "https://ubf.lk/careers",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=128&auto=format&fit=crop&q=80",
        "ACTIVE",
        "1157",
        "false",
        "false",
        "false",
        "2026-11-06",
      ],
    ];

    const csvLines = [
      headers.join(","),
      ...sampleRows.map((row) =>
        row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")
      ),
    ];

    return "\uFEFF" + csvLines.join("\r\n");
  },

  /**
   * Exports an array of Job records to RFC 4180 CSV with UTF-8 BOM
   */
  exportJobsToCsv(jobs: Job[]): string {
    const headers = [
      "code",
      "title",
      "employer",
      "category",
      "city",
      "district",
      "url",
      "logo",
      "status",
      "views",
      "showWhatsApp",
      "showEmail",
      "showPhone",
      "dateAdded",
    ];

    const lines = [headers.join(",")];

    for (const job of jobs) {
      const row = [
        job.code || job.id.toUpperCase(),
        job.title,
        job.employer.displayName,
        job.industry,
        job.city,
        job.district,
        job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website,
        job.employer.logo,
        job.status || "ACTIVE",
        String(job.viewsCount || 0),
        String(Boolean(job.showWhatsApp)),
        String(Boolean(job.showEmail)),
        String(Boolean(job.showPhone)),
        job.datePosted ? job.datePosted.split("T")[0] : new Date().toISOString().split("T")[0],
      ];

      lines.push(
        row.map((val) => `"${(val || "").replace(/"/g, '""')}"`).join(",")
      );
    }

    return "\uFEFF" + lines.join("\r\n");
  },

  /**
   * Parses raw CSV text into partial Job objects
   */
  parseJobsFromCsv(csvText: string): { jobs: Partial<Job>[]; errors: string[] } {
    const errors: string[] = [];
    const jobs: Partial<Job>[] = [];

    // Strip BOM if present
    const cleanText = csvText.replace(/^\uFEFF/, "");
    const rows = parseCsvRows(cleanText);

    if (rows.length < 2) {
      errors.push("CSV file must contain at least a header row and one data row.");
      return { jobs, errors };
    }

    // Normalize header keys
    const headerRow = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));
    const colIndex = (keys: string[]) => {
      for (const k of keys) {
        const idx = headerRow.indexOf(k.toLowerCase());
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const idxCode = colIndex(["code", "jobcode", "id", "adcode", "adid"]);
    const idxTitle = colIndex(["title", "jobtitle", "role"]);
    const idxEmployer = colIndex(["employer", "company", "customer", "org", "custname"]);
    const idxCategory = colIndex(["category", "industry", "sector"]);
    const idxCity = colIndex(["city", "location", "town", "cityname", "area"]);
    const idxDistrict = colIndex(["district", "region", "province", "distname"]);
    const idxUrl = colIndex(["url", "applyurl", "link", "applicationurl", "joblink", "fldweblink"]);
    const idxLogo = colIndex(["logo", "image", "img"]);
    const idxStatus = colIndex(["status", "state", "active", "custadstatus"]);
    const idxViews = colIndex(["views", "viewscount", "count", "viewcount"]);
    const idxPhone = colIndex(["phone", "tel"]);
    const idxMobile = colIndex(["mobile", "whatsapp", "wa"]);
    const idxEmail = colIndex(["email", "mail"]);
    const idxDescription = colIndex(["description", "desc", "snippet"]);
    const idxShowWA = colIndex(["showwhatsapp", "iswhatsapp"]);
    const idxShowEmail = colIndex(["showemail", "isemail"]);
    const idxShowPhone = colIndex(["showphone", "isphone"]);

    if (idxTitle === -1) {
      errors.push("Missing required 'Title' column in CSV header.");
      return { jobs, errors };
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

      const title = row[idxTitle]?.trim();
      if (!title) {
        errors.push(`Row ${i + 1}: Skipped due to empty Title.`);
        continue;
      }

      const employerName = (idxEmployer !== -1 ? row[idxEmployer]?.trim() : "") || "Verified Organization";
      const category = (idxCategory !== -1 ? row[idxCategory]?.trim() : "") || "Corporate Careers";
      const city = (idxCity !== -1 ? row[idxCity]?.trim() : "") || "Colombo Center";
      const district = (idxDistrict !== -1 ? row[idxDistrict]?.trim() : "") || "Colombo";
      const url = (idxUrl !== -1 ? row[idxUrl]?.trim() : "") || "https://www.jobeelanka.com";
      const logo = (idxLogo !== -1 ? row[idxLogo]?.trim() : "") || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80";
      const phone = idxPhone !== -1 ? row[idxPhone]?.trim() : "";
      const mobile = idxMobile !== -1 ? row[idxMobile]?.trim() : "";
      const email = idxEmail !== -1 ? row[idxEmail]?.trim() : "";
      const description = idxDescription !== -1 ? row[idxDescription]?.trim() : "";

      const rawStatus = idxStatus !== -1 ? row[idxStatus]?.trim().toUpperCase() : "ACTIVE";
      const status: "ACTIVE" | "INACTIVE" = rawStatus === "OFF" || rawStatus === "INACTIVE" || rawStatus === "1" ? "INACTIVE" : "ACTIVE";

      const views = idxViews !== -1 ? parseInt(row[idxViews]?.trim(), 10) || 1 : 1;
      const code = (idxCode !== -1 ? row[idxCode]?.trim() : "") || `JL${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const parseBool = (val?: string) => {
        if (!val) return false;
        const v = val.trim().toLowerCase();
        return v === "true" || v === "1" || v === "yes" || v === "on";
      };

      const showWhatsApp = idxShowWA !== -1 ? parseBool(row[idxShowWA]) : Boolean(mobile || phone);
      const showEmail = idxShowEmail !== -1 ? parseBool(row[idxShowEmail]) : Boolean(email);
      const showPhone = idxShowPhone !== -1 ? parseBool(row[idxShowPhone]) : Boolean(phone);

      const employerObj: Employer = {
        id: `emp-${Date.now()}-${i}`,
        slug: employerName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        legalName: employerName,
        displayName: employerName,
        logo,
        district,
        website: url.startsWith("http") ? new URL(url).origin : "https://www.jobeelanka.com",
        verifiedDomain: url.startsWith("http") ? new URL(url).hostname : "verified",
        verificationStatus: "VERIFIED_BUSINESS",
        isFeatured: false,
        officialWhatsApp: mobile || phone || undefined,
        about: `${employerName} is a verified entity in Sri Lanka.`,
      };

      jobs.push({
        code,
        title,
        employer: employerObj,
        industry: category,
        listingType: "vacancy",
        city,
        district,
        country: "LK",
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        sourceType: "FIRST_PARTY",
        sourceUrl: url,
        applyUrl: url,
        applicationUrl: url,
        applyEmail: email || undefined,
        applyWhatsApp: mobile || phone || undefined,
        showWhatsApp,
        showEmail,
        showPhone,
        shortSnippet: description || `Opportunity discovered at ${employerName} in ${city}. Apply directly via verified link.`,
        status,
        viewsCount: views,
        descriptionHtml: `<p>${title} opportunity at ${employerName}. Official destination: <a href="${url}">${url}</a></p>`,
        requiredSkills: [category, "Professional"],
        responsibilities: ["Review vacancy specifications on official destination.", "Submit credentials directly to employer."],
        qualifications: ["Relevant professional or academic credentials."],
        datePosted: new Date().toISOString(),
        validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false,
        isSalaryDisclosed: false,
        directApplyAllowed: true,
      });
    }

    return { jobs, errors };
  },
};

/**
 * Robust CSV Line & Column Parser handling quotes and commas
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\r") {
        if (nextChar === "\n") i++;
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

