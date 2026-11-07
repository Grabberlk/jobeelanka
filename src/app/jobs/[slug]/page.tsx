import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JobRepository } from "@/modules/jobs/repository";
import { generateJobPostingSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { formatCurrency, formatDateRelative, buildWhatsAppUrl } from "@/lib/utils";
import { DirectEmployerApplyBox } from "@/components/jobs/DirectEmployerApplyBox";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Building2,
  DollarSign,
  MessageCircle,
  Mail,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Globe2
} from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = JobRepository.getJobBySlug(slug);
  if (!job) return { title: "Job Not Found | JobeeLanka" };

  return {
    title: `${job.title} at ${job.employer.displayName} | JobeeLanka`,
    description: job.shortSnippet,
    openGraph: {
      title: `${job.title} - ${job.employer.displayName}`,
      description: job.shortSnippet,
      url: `https://www.jobeelanka.com/jobs/${job.slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = JobRepository.getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const jobSchema = generateJobPostingSchema(job);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.jobeelanka.com/" },
    { name: "Jobs", url: "https://www.jobeelanka.com/jobs" },
    { name: job.title, url: `https://www.jobeelanka.com/jobs/${job.slug}` },
  ]);

  const waUrl = job.applyWhatsApp
    ? buildWhatsAppUrl(job.applyWhatsApp, job.title, job.employer.displayName)
    : undefined;

  const applyUrl = job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website;

  const isVerified =
    job.employer.verificationStatus === "VERIFIED_BUSINESS" ||
    job.employer.verificationStatus === "SLBFE_LICENSED";

  return (
    <>
      {/* Schema.org Injections for Google Search & AI Overviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Back Navigation & Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vacancies</span>
          </Link>
          <div className="flex items-center gap-2">
            <span>Posted {formatDateRelative(job.datePosted)}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {job.viewsCount} views
            </span>
          </div>
        </div>

        {/* Main Job Hero Header Bento Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={job.employer.logo}
                  alt={job.employer.displayName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                    {job.employer.displayName}
                  </span>
                  {isVerified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {job.employer.slbfeLicenseNumber
                          ? `SLBFE: ${job.employer.slbfeLicenseNumber}`
                          : "Verified Business"}
                      </span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{job.city}, Sri Lanka</span>
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:text-slate-300">
                    {job.workMode}
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:text-slate-300">
                    {job.employmentType.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary Metric */}
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left md:text-right w-full md:w-auto">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Monthly Compensation
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {job.isSalaryDisclosed && job.salaryMin
                  ? `${formatCurrency(job.salaryMin, job.salaryCurrency)}${
                      job.salaryMax ? ` - ${formatCurrency(job.salaryMax, job.salaryCurrency)}` : ""
                    }`
                  : "Competitive"}
              </div>
              <span className="text-[11px] text-slate-400">
                {job.isSalaryDisclosed ? "Market verified rate" : "Disclosed upon interview"}
              </span>
            </div>
          </div>

          {/* Independence Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Independence & Official Notice</span>
            </div>
            <p className="leading-relaxed">
              &quot;We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose.&quot;
            </p>
            <p className="font-bold text-emerald-700 dark:text-emerald-400">
              Click below to the organisation&apos;s web site.
            </p>
          </div>

          {/* Direct Action Vectors Banner */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Application Destination: <span className="font-semibold text-slate-700 dark:text-slate-300">Verified Employer Portal / Official Vacancy</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {applyUrl && (
                <a
                  href={applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex-1 sm:flex-initial"
                >
                  <span>Apply on Official Website</span>
                  <Globe2 className="w-4 h-4" />
                </a>
              )}

              {job.showWhatsApp && waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-sm transition-all flex-1 sm:flex-initial"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp</span>
                </a>
              )}

              {job.showEmail && job.applyEmail && (
                <a
                  href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(
                    job.title
                  )}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex-1 sm:flex-initial"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Two-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Direct Contact & 1-Click Application Box */}
            <DirectEmployerApplyBox job={job} />

            {/* Overview & Citability Block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                About this Position
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.shortSnippet}
              </p>

              {/* Responsibilities */}
              <div className="space-y-3 pt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Qualifications */}
              <div className="space-y-3 pt-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Required Qualifications & Experience
                </h3>
                <ul className="space-y-2">
                  {job.qualifications.map((qual, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2 pt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Tech Stack & Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Overseas Safety Notice if applicable */}
            {job.industry.includes("Overseas") && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 space-y-2 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>SLBFE Overseas Recruitment Notice</span>
                </div>
                <p className="text-xs leading-relaxed">
                  This foreign vacancy is verified with SLBFE License #{job.employer.slbfeLicenseNumber}.
                  Never pay any money for job placement. Licensed agencies cannot demand payment from applicants.
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Listing Integrity & Employer Info */}
          <div className="space-y-6">
            {/* Listing Integrity & Verification Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-bento space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Listing Integrity
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {job.listingType ? job.listingType.replace("_", " ").toUpperCase() : "VERIFIED VACANCY"}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Employer / Source</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.employer.displayName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.district}, Sri Lanka</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Work Mode</span>
                  <span className="font-semibold text-emerald-600">{job.workMode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Source Type</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.sourceType || "Direct Verified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Last Checked</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{job.lastCheckedAt || "Today"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expiry Date</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {job.validThrough ? job.validThrough.split("T")[0] : "2026-12-31"}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Zero Fee Placement Protection</span>
                </div>
              </div>
            </div>

            {/* Employer Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-bento space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  About the Employer
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.employer.about}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Headquarters</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {job.employer.district}, Sri Lanka
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Official Domain</span>
                  <a
                    href={job.employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    {job.employer.verifiedDomain}
                  </a>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/report-listing"
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report incorrect or expired vacancy</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Policy Compliant Sidebar AdSlot */}
            <AdSlot format="rectangle" pageType="listing" />
          </div>
        </div>
      </div>
    </>
  );
}

