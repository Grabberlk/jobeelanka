import { Job, Employer, ApplicationSubmission, SearchFacetFilters } from "./types";
import { SEED_JOBS, SEED_EMPLOYERS } from "./data";
import legacyJobsData from "../../../data/legacy_jobs.json";
import legacyEmployersData from "../../../data/legacy_employers.json";

// Seed jobs with legacy codes and directory defaults (hidden direct contacts by default)
const INITIAL_CODES = [
  "110B0PNNQ1R",
  "1683Q1F80C6",
  "1BG70LCYN8A",
  "1USQS3JZB5B",
  "1TAXHQGQBD8",
  "104JVT6JDQY",
  "1TJNCATS9UG",
  "1I87XU110BI",
  "1B15V8K0H88",
  "1C412Y99H71",
  "1DF8100LK22",
  "1E79344MA33",
];

const legacyJobs: Job[] = (legacyJobsData as unknown as Job[]) || [];
const legacyEmployers: Employer[] = (legacyEmployersData as unknown as Employer[]) || [];

// In-memory runtime stores with pre-seeded data + 1131 legacy directory listings
let jobsStore: Job[] = [
  ...SEED_JOBS.map((job, idx) => ({
    ...job,
    code: job.code || INITIAL_CODES[idx % INITIAL_CODES.length] || `JL${1000 + idx}`,
    status: job.status || "ACTIVE",
    showWhatsApp: job.showWhatsApp ?? false,
    showEmail: job.showEmail ?? false,
    showPhone: job.showPhone ?? false,
  })),
  ...legacyJobs,
];

let employersStore: Record<string, Employer> = { ...SEED_EMPLOYERS };
for (const emp of legacyEmployers) {
  employersStore[emp.id] = emp;
  employersStore[emp.slug] = emp;
}
let applicationsStore: ApplicationSubmission[] = [
  {
    id: "app-101",
    jobId: "job-1",
    candidateName: "Kavindu Perera",
    candidateEmail: "kavindu.p@example.com",
    candidatePhone: "+94771239874",
    cvFileName: "Kavindu_Perera_Lead_Cloud_Architect_CV.pdf",
    coverNote: "Experienced AWS/Azure architect with 9 years building distributed enterprise systems in Sri Lanka.",
    pdpaConsentGiven: true,
    createdAt: "2026-11-05T14:20:00Z",
    status: "SHORTLISTED",
  },
  {
    id: "app-102",
    jobId: "job-2",
    candidateName: "Dilani Fernando",
    candidateEmail: "dilani.f@example.com",
    candidatePhone: "+94719876543",
    cvFileName: "Dilani_Fernando_Senior_FullStack.pdf",
    coverNote: "Full stack engineer specializing in React 19, TypeScript, and Go microservices.",
    pdpaConsentGiven: true,
    createdAt: "2026-11-05T16:45:00Z",
    status: "VIEWED",
  },
  {
    id: "app-103",
    jobId: "job-1",
    candidateName: "Rohan Jayawardena",
    candidateEmail: "rohan.j@example.com",
    candidatePhone: "+94765554433",
    cvFileName: "Rohan_Jayawardena_Cloud_CV.pdf",
    coverNote: "Azure certified architect with Terraform and Kubernetes production deployments.",
    pdpaConsentGiven: true,
    createdAt: "2026-11-06T01:10:00Z",
    status: "SUBMITTED",
  },
];

export const JobRepository = {
  // ==========================================
  // JOBS CRUD
  // ==========================================
  getAllJobs(includeInactive: boolean = true): Job[] {
    if (includeInactive) return jobsStore;
    return jobsStore.filter((j) => j.status !== "INACTIVE");
  },

  getFeaturedJobs(): Job[] {
    return jobsStore.filter((j) => j.featured && j.status !== "INACTIVE");
  },

  getJobBySlug(slug: string): Job | undefined {
    return jobsStore.find((j) => j.slug === slug);
  },

  getJobById(id: string): Job | undefined {
    return jobsStore.find((j) => j.id === id);
  },

  createJob(jobData: Partial<Job> & { employerId?: string }): Job {
    const employer = jobData.employer || Object.values(employersStore)[0];
    const newJob: Job = {
      id: jobData.id || `job-${Date.now()}`,
      code: jobData.code || `JL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      status: jobData.status || "ACTIVE",
      showWhatsApp: jobData.showWhatsApp ?? false,
      showEmail: jobData.showEmail ?? false,
      showPhone: jobData.showPhone ?? false,
      slug:
        jobData.slug ||
        (jobData.title || "new-job")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") + `-${Date.now().toString().slice(-4)}`,
      title: jobData.title || "Untitled Role",
      employer,
      listingType: jobData.listingType || "vacancy",
      industry: jobData.industry || "Information Technology",
      shortSnippet:
        jobData.shortSnippet || "Immediate opening with competitive compensation and benefits.",
      descriptionHtml:
        jobData.descriptionHtml || `<p>${jobData.shortSnippet || "Contact employer for details."}</p>`,
      responsibilities: jobData.responsibilities || [
        "Execute primary engineering and team leadership duties.",
      ],
      qualifications: jobData.qualifications || [
        "Relevant degree or demonstrated commercial expertise.",
      ],
      requiredSkills: jobData.requiredSkills || ["Problem Solving", "Communication"],
      employmentType: jobData.employmentType || "FULL_TIME",
      workMode: jobData.workMode || "HYBRID",
      district: jobData.district || "Colombo",
      city: jobData.city || `${jobData.district || "Colombo"} Center`,
      country: "LK",
      salaryMin: jobData.salaryMin,
      salaryMax: jobData.salaryMax,
      salaryCurrency: jobData.salaryCurrency || "LKR",
      salaryPeriod: jobData.salaryPeriod || "MONTH",
      isSalaryDisclosed: Boolean(jobData.salaryMin),
      sourceType: jobData.sourceType || "FIRST_PARTY",
      sourceName: jobData.sourceName,
      sourceUrl: jobData.sourceUrl,
      applicationUrl: jobData.applicationUrl || jobData.applyUrl || jobData.sourceUrl || employer.website,
      applyWhatsApp: jobData.applyWhatsApp || employer.officialWhatsApp,
      applyEmail: jobData.applyEmail || "hiring@example.com",
      applyUrl: jobData.applyUrl || jobData.applicationUrl || jobData.sourceUrl || employer.website,
      directApplyAllowed: true,
      datePosted: jobData.datePosted || new Date().toISOString(),
      validThrough: jobData.validThrough || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      featured: Boolean(jobData.featured),
      viewsCount: jobData.viewsCount || 1,
      applicationsCount: jobData.applicationsCount || 0,
    };

    jobsStore = [newJob, ...jobsStore];
    return newJob;
  },

  toggleJobStatus(id: string, explicitStatus?: "ACTIVE" | "INACTIVE"): Job | undefined {
    const job = jobsStore.find((j) => j.id === id);
    if (!job) return undefined;
    const newStatus = explicitStatus !== undefined 
      ? explicitStatus 
      : (job.status === "INACTIVE" ? "ACTIVE" : "INACTIVE");
    job.status = newStatus;
    return job;
  },

  toggleContactChannel(id: string, channel: "whatsapp" | "email" | "phone", enabled: boolean): Job | undefined {
    const job = jobsStore.find((j) => j.id === id);
    if (!job) return undefined;
    if (channel === "whatsapp") job.showWhatsApp = enabled;
    if (channel === "email") job.showEmail = enabled;
    if (channel === "phone") job.showPhone = enabled;
    return job;
  },

  bulkSetStatus(ids: string[], status: "ACTIVE" | "INACTIVE"): number {
    let count = 0;
    jobsStore.forEach((j) => {
      if (ids.length === 0 || ids.includes(j.id)) {
        j.status = status;
        count++;
      }
    });
    return count;
  },

  batchImportJobs(newJobs: Partial<Job>[]): number {
    let imported = 0;
    for (const jobData of newJobs) {
      this.createJob(jobData);
      imported++;
    }
    return imported;
  },

  updateJob(id: string, data: Partial<Job>): Job | undefined {
    const index = jobsStore.findIndex((j) => j.id === id);
    if (index === -1) return undefined;

    jobsStore[index] = {
      ...jobsStore[index],
      ...data,
      isSalaryDisclosed: data.salaryMin ? true : jobsStore[index].isSalaryDisclosed,
    };
    return jobsStore[index];
  },

  deleteJob(id: string): boolean {
    const lenBefore = jobsStore.length;
    jobsStore = jobsStore.filter((j) => j.id !== id);
    return jobsStore.length < lenBefore;
  },

  injectFeedJobs(newJobs: Job[]) {
    jobsStore = [...newJobs, ...jobsStore];
  },

  hydrateJobs(persistedJobs: Job[]) {
    const byId = new Map(jobsStore.map((job) => [job.id, job]));
    for (const job of persistedJobs) byId.set(job.id, job);
    jobsStore = Array.from(byId.values());
  },

  searchJobs(filters: SearchFacetFilters): {
    jobs: Job[];
    total: number;
    facets: Record<string, Record<string, number>>;
  } {
    let results = [...jobsStore];

    if (!filters.includeInactive) {
      results = results.filter((job) => job.status !== "INACTIVE");
    }

    if (filters.query && filters.query.trim() !== "") {
      const q = filters.query.toLowerCase().trim();
      results = results.filter((job) => {
        return (
          job.title?.toLowerCase().includes(q) ||
          job.employer?.displayName?.toLowerCase().includes(q) ||
          job.industry?.toLowerCase().includes(q) ||
          job.district?.toLowerCase().includes(q) ||
          job.city?.toLowerCase().includes(q) ||
          job.requiredSkills?.some((s) => s?.toLowerCase().includes(q)) ||
          job.shortSnippet?.toLowerCase().includes(q)
        );
      });
    }

    if (filters.district && filters.district !== "All Districts") {
      results = results.filter(
        (job) => job.district?.toLowerCase() === filters.district!.toLowerCase()
      );
    }

    if (filters.industry && filters.industry !== "All Industries") {
      results = results.filter(
        (job) => job.industry?.toLowerCase() === filters.industry!.toLowerCase()
      );
    }

    if (filters.workMode) {
      results = results.filter((job) => job.workMode === filters.workMode);
    }

    if (filters.employmentType) {
      results = results.filter((job) => job.employmentType === filters.employmentType);
    }

    if (filters.salaryMin && filters.salaryMin > 0) {
      results = results.filter((job) => (job.salaryMin || 0) >= filters.salaryMin!);
    }

    if (filters.isVerifiedOnly) {
      results = results.filter(
        (job) =>
          job.employer?.verificationStatus === "VERIFIED_BUSINESS" ||
          job.employer?.verificationStatus === "SLBFE_LICENSED"
      );
    }

    // Dynamic Facet Aggregation
    const districtFacets: Record<string, number> = {};
    const industryFacets: Record<string, number> = {};
    const workModeFacets: Record<string, number> = {};

    jobsStore.forEach((job) => {
      const d = job.district || "Colombo";
      const ind = job.industry || "Other";
      const wm = job.workMode || "ONSITE";
      districtFacets[d] = (districtFacets[d] || 0) + 1;
      industryFacets[ind] = (industryFacets[ind] || 0) + 1;
      workModeFacets[wm] = (workModeFacets[wm] || 0) + 1;
    });

    return {
      jobs: results,
      total: results.length,
      facets: {
        districts: districtFacets,
        industries: industryFacets,
        workModes: workModeFacets,
      },
    };
  },

  // ==========================================
  // EMPLOYERS CRUD
  // ==========================================
  getAllEmployers(): Employer[] {
    return Object.values(employersStore);
  },

  getEmployerBySlug(slug: string): Employer | undefined {
    return Object.values(employersStore).find((e) => e.slug === slug);
  },

  getEmployerById(id: string): Employer | undefined {
    return Object.values(employersStore).find((e) => e.id === id);
  },

  createEmployer(data: Partial<Employer>): Employer {
    const id = `emp-${Date.now()}`;
    const slug = (data.displayName || "new-company")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const newEmp: Employer = {
      id,
      slug,
      legalName: data.legalName || data.displayName || "New Enterprise (Pvt) Ltd",
      displayName: data.displayName || "New Enterprise",
      logo:
        data.logo ||
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=128&auto=format&fit=crop&q=80",
      district: data.district || "Colombo",
      website: data.website || "https://example.com",
      verifiedDomain: data.verifiedDomain || "example.com",
      officialWhatsApp: data.officialWhatsApp || "+94770000000",
      slbfeLicenseNumber: data.slbfeLicenseNumber,
      verificationStatus: data.verificationStatus || "VERIFIED_BUSINESS",
      isFeatured: Boolean(data.isFeatured),
      about: data.about || "Verified hiring organization operating in Sri Lanka.",
    };

    employersStore[id] = newEmp;
    return newEmp;
  },

  updateEmployer(id: string, data: Partial<Employer>): Employer | undefined {
    if (!employersStore[id]) {
      const match = Object.values(employersStore).find((e) => e.id === id);
      if (match) id = match.id;
      else return undefined;
    }

    employersStore[id] = {
      ...employersStore[id],
      ...data,
    };
    return employersStore[id];
  },

  deleteEmployer(id: string): boolean {
    if (employersStore[id]) {
      delete employersStore[id];
      return true;
    }
    return false;
  },

  // ==========================================
  // APPLICATIONS & DIRECT CONTACT CRM
  // ==========================================
  submitApplication(data: {
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    candidatePhone: string;
    cvFileName: string;
    coverNote?: string;
    pdpaConsentGiven: boolean;
  }): ApplicationSubmission {
    const submission: ApplicationSubmission = {
      id: `app-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: "SUBMITTED",
    };
    applicationsStore.unshift(submission);

    const job = jobsStore.find((j) => j.id === data.jobId);
    if (job) {
      job.applicationsCount = (job.applicationsCount || 0) + 1;
    }

    return submission;
  },

  updateApplicationStatus(id: string, status: ApplicationSubmission["status"]): ApplicationSubmission | undefined {
    const app = applicationsStore.find((a) => a.id === id);
    if (app) {
      app.status = status;
    }
    return app;
  },

  getApplicationsByJobId(jobId: string): ApplicationSubmission[] {
    return applicationsStore.filter((a) => a.jobId === jobId);
  },

  getAllApplications(): ApplicationSubmission[] {
    return applicationsStore;
  },
};
