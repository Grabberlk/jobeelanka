export type WorkMode = "ONSITE" | "HYBRID" | "REMOTE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type VerificationStatus = "VERIFIED_BUSINESS" | "SLBFE_LICENSED" | "PARTNER_SOURCE" | "PENDING";
export type JobSourceType = "FIRST_PARTY" | "ITPRO_FEED" | "PARTNER_RSS" | "VERIFIED_LINK";
export type ListingType =
  | "employer_page"
  | "vacancy"
  | "recruiter"
  | "government"
  | "partner_feed"
  | "resource"
  | "employer_profile";

export interface Employer {
  id: string;
  slug: string;
  legalName: string;
  displayName: string;
  logo: string;
  district: string;
  website: string;
  verifiedDomain: string;
  officialWhatsApp?: string;
  slbfeLicenseNumber?: string;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
  about: string;
}

export interface Job {
  id: string;
  code?: string; // Legacy Code (e.g. 110B0PNNQ1R)
  slug: string;
  title: string;
  employer: Employer;
  listingType?: ListingType;
  status?: "ACTIVE" | "INACTIVE"; // Toggle ON/OFF
  showWhatsApp?: boolean; // CRUD Option to hide/show
  showEmail?: boolean; // CRUD Option to hide/show
  showPhone?: boolean; // CRUD Option to hide/show
  descriptionHtml: string;
  shortSnippet: string;
  responsibilities: string[];
  qualifications: string[];
  requiredSkills: string[];
  industry: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  district: string;
  city: string;
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: "LKR" | "USD";
  salaryPeriod: "MONTH" | "YEAR";
  isSalaryDisclosed: boolean;
  sourceType: JobSourceType;
  sourceName?: string;
  sourceUrl?: string;
  applyUrl?: string;
  applicationUrl?: string;
  applyEmail?: string;
  applyWhatsApp?: string;
  directApplyAllowed: boolean;
  datePosted: string;
  lastCheckedAt?: string;
  permissionStatus?: "APPROVED" | "PENDING" | "PUBLIC";
  validThrough: string;
  featured: boolean;
  viewsCount: number;
  applicationsCount: number;
}

export interface ApplicationSubmission {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  cvFileName: string;
  coverNote?: string;
  pdpaConsentGiven: boolean;
  createdAt: string;
  status: "SUBMITTED" | "VIEWED" | "SHORTLISTED" | "REJECTED";
}

export interface SearchFacetFilters {
  query?: string;
  district?: string;
  industry?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  salaryMin?: number;
  isVerifiedOnly?: boolean;
  includeInactive?: boolean;
}

