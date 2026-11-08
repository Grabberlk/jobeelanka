export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "MODERATOR_STAFF" | "TRUST_SAFETY_STAFF";
  department: string;
  avatar: string;
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
  permissions: string[];
}

export const SEED_ADMIN_AND_STAFF: StaffUser[] = [
  {
    id: "admin-rajeevan",
    name: "Rajeevan",
    email: "contactrajeevan@hotmail.com",
    role: "SUPER_ADMIN",
    department: "Executive & Platform Governance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    lastLogin: "2026-11-07T12:00:00Z",
    permissions: [
      "ALL_PRIVILEGES",
      "MANAGE_STAFF",
      "APPROVE_EMPLOYERS",
      "OVERRIDE_MODERATION",
      "VIEW_AUDIT_LOGS",
      "SYSTEM_SETTINGS",
      "API_KEY_ISSUANCE",
      "CSV_IMPORT_EXPORT",
    ],
  },
  {
    id: "admin-anas",
    name: "Anas",
    email: "anasbikes1992@gmail.com",
    role: "SUPER_ADMIN",
    department: "Technical & Directory Administration",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80",
    status: "ACTIVE",
    lastLogin: "2026-11-07T12:00:00Z",
    permissions: [
      "ALL_PRIVILEGES",
      "MANAGE_STAFF",
      "APPROVE_EMPLOYERS",
      "OVERRIDE_MODERATION",
      "VIEW_AUDIT_LOGS",
      "SYSTEM_SETTINGS",
      "API_KEY_ISSUANCE",
      "CSV_IMPORT_EXPORT",
    ],
  },
];

export interface ModerationItem {
  id: string;
  type: "JOB" | "EMPLOYER" | "SLBFE_LICENSE" | "SCAM_REPORT";
  title: string;
  entityName: string;
  submittedBy: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED";
  riskScore: "LOW" | "MEDIUM" | "HIGH";
  notes?: string;
  jobId?: string;
}

export const SEED_MODERATION_QUEUE: ModerationItem[] = [
  {
    id: "mod-01",
    type: "SLBFE_LICENSE",
    title: "Verify License: Apex Global Overseas Recruiters",
    entityName: "Apex Global Overseas Recruitment Services",
    submittedBy: "SLBFE Registry Feed",
    submittedAt: "2026-11-05T18:00:00Z",
    status: "APPROVED",
    riskScore: "LOW",
    notes: "SLBFE/AL/2026/8941 verified active through bureau register.",
  },
  {
    id: "mod-02",
    type: "JOB",
    title: "Review Role: Lead Cloud Solutions Architect",
    entityName: "IFS Sri Lanka",
    submittedBy: "recruiter@ifs.com",
    submittedAt: "2026-11-05T09:00:00Z",
    status: "APPROVED",
    riskScore: "LOW",
    notes: "Verified enterprise domain. Complies with salary clarity guidelines.",
  },
  {
    id: "mod-03",
    type: "SCAM_REPORT",
    title: "Report: Suspicious WhatsApp Foreign Work Offer in Colombo",
    entityName: "Unregistered Agency (Global Care LK)",
    submittedBy: "Candidate Hotline (Report #419)",
    submittedAt: "2026-11-06T00:45:00Z",
    status: "FLAGGED",
    riskScore: "HIGH",
    notes: "Applicant reported request for LKR 50,000 upfront medical deposit. Flagged for immediate blacklisting.",
  },
  {
    id: "mod-04",
    type: "EMPLOYER",
    title: "New Registration: Colombo AI Labs (Pvt) Ltd",
    entityName: "Colombo AI Labs",
    submittedBy: "founders@colomboai.lk",
    submittedAt: "2026-11-05T22:10:00Z",
    status: "PENDING",
    riskScore: "LOW",
    notes: "BR Number PV-00291048 submitted. Domain verified.",
  },
];

