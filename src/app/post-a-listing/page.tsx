"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Info
} from "lucide-react";
import { SRI_LANKA_DISTRICTS, INDUSTRIES } from "@/modules/jobs/data";
import { JobRepository } from "@/modules/jobs/repository";
import { ListingType } from "@/modules/jobs/types";

export default function PostListingPage() {
  const [listingType, setListingType] = useState<ListingType>("vacancy");
  const [employerName, setEmployerName] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [industry, setIndustry] = useState("Information Technology");
  const [workMode, setWorkMode] = useState<"HYBRID" | "REMOTE" | "ONSITE">("HYBRID");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [recruiterWhatsApp, setRecruiterWhatsApp] = useState("+94");
  const [hrEmail, setHrEmail] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [zeroFeePledge, setZeroFeePledge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!employerName.trim() || !title.trim() || !applicationUrl.trim()) {
      setErrorMsg("Please provide your Organization Name, Role/Listing Title, and Official Application URL.");
      return;
    }

    if (!zeroFeePledge) {
      setErrorMsg("You must accept the Zero Candidate Fee Pledge to list opportunities on JobeeLanka.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newJob = JobRepository.createJob({
        title,
        district,
        city: `${district} Hub`,
        industry,
        workMode,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        salaryCurrency: "LKR",
        salaryPeriod: "MONTH",
        isSalaryDisclosed: Boolean(salaryMin),
        requiredSkills: [industry, workMode],
        shortSnippet: description.trim() || `${title} opportunity at ${employerName}. Apply via official destination.`,
        descriptionHtml: `<p>${description.trim() || `Apply directly at ${applicationUrl}`}</p>`,
        listingType,
        sourceType: "FIRST_PARTY",
        sourceUrl: officialWebsite || applicationUrl,
        applyUrl: applicationUrl,
        applicationUrl: applicationUrl,
        applyWhatsApp: recruiterWhatsApp.length > 5 ? recruiterWhatsApp : undefined,
        applyEmail: hrEmail || undefined,
        permissionStatus: "APPROVED",
      });

      setSubmittedId(newJob.id);
    } catch (err: any) {
      setErrorMsg("Failed to submit listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Submit an Opportunity or Career Page
              </h1>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Connect directly with verified Sri Lankan talent. Candidates apply directly via your official website, direct WhatsApp, or corporate HR inbox.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Editorial Review in &lt; 24h</span>
          </div>
        </div>
      </div>

      {submittedId ? (
        <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-4 shadow-bento">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Listing Submitted Successfully!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your listing <strong>&ldquo;{title}&rdquo;</strong> for <strong>{employerName}</strong> has been received with Reference ID: <span className="font-mono font-bold text-emerald-600">{submittedId}</span>. Our moderation team verifies domain authenticity before publication.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              Browse Live Directory
            </Link>
            <button
              onClick={() => {
                setSubmittedId(null);
                setTitle("");
                setDescription("");
                setApplicationUrl("");
                setZeroFeePledge(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
            >
              Submit Another Listing
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Listing Category */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              1. Listing Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: "vacancy", label: "Specific Vacancy" },
                { type: "employer_page", label: "Employer Career Page" },
                { type: "recruiter", label: "Recruiter Listing" },
                { type: "government", label: "Government Vacancy" },
                { type: "resource", label: "Internship / Resource" },
                { type: "employer_profile", label: "Employer Profile" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setListingType(item.type as ListingType)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left ${
                    listingType === item.type
                      ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-600/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Organization Info */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              2. Organization Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Employer / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sysco LABS Sri Lanka"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Official Website / Domain
                </label>
                <input
                  type="url"
                  placeholder="https://syscolabs.lk"
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Opportunity Details */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              3. Opportunity Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Role / Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer - Cloud Native"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">Onsite</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Direct Application / Career Page URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://company.com/careers/role-123"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Direct Candidate Communication (Optional) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              4. Direct Contact Channels (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Official WhatsApp for Queries
                </label>
                <input
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={recruiterWhatsApp}
                  onChange={(e) => setRecruiterWhatsApp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  HR Email Address
                </label>
                <input
                  type="email"
                  placeholder="careers@company.com"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Description */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Short Description / Key Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Outline the key responsibilities, tech stack, and qualifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Section 6: Zero Fee Pledge */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="zero-fee-pledge"
                required
                checked={zeroFeePledge}
                onChange={(e) => setZeroFeePledge(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="zero-fee-pledge" className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <strong>Zero Candidate Fee Pledge:</strong> We certify that this organization does not charge jobseekers any recruitment, interview, registration, or placement fees. Under Sri Lanka regulations, all candidate referral links are 100% free of charge.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Submitting for Moderation..." : "Submit Listing for Editorial Approval"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
