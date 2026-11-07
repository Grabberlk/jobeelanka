"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/modules/jobs/types";
import { formatCurrency, formatDateRelative, buildWhatsAppUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  ArrowUpRight,
  Clock,
  Phone,
  Mail,
  Copy,
  CheckCircle2,
  X,
  ExternalLink
} from "lucide-react";

interface JobCardProps {
  job: Job;
  onApplyClick?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const isVerified =
    job.employer.verificationStatus === "VERIFIED_BUSINESS" ||
    job.employer.verificationStatus === "SLBFE_LICENSED";

  const rawPhone = job.applyWhatsApp || job.employer.officialWhatsApp;
  const waUrl = rawPhone
    ? buildWhatsAppUrl(rawPhone, job.title, job.employer.displayName)
    : undefined;

  const hrEmail = job.applyEmail || (job.employer.verifiedDomain ? `careers@${job.employer.verifiedDomain}` : undefined);
  const applyUrl = job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website;

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      if (type === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 ease-out shadow-bento hover:shadow-bento-hover hover:scale-[1.01] flex flex-col justify-between">
      <div>
        {/* Top Header: Employer & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center p-1 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.employer.logo}
                alt={job.employer.displayName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                  {job.employer.displayName}
                </span>
                {isVerified && (
                  <span title="Verified Sri Lankan Entity" className="text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4 fill-emerald-100 dark:fill-emerald-950/60" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{job.city}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{formatDateRelative(job.datePosted)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1 shrink-0">
            {job.listingType && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {job.listingType === "employer_page"
                  ? "Employer Page"
                  : job.listingType === "government"
                  ? "Government"
                  : job.listingType === "partner_feed"
                  ? "Feed"
                  : job.listingType === "recruiter"
                  ? "Agency"
                  : "Vacancy"}
              </span>
            )}
            <Badge
              variant={
                job.workMode === "REMOTE"
                  ? "emerald"
                  : job.workMode === "HYBRID"
                  ? "blue"
                  : "secondary"
              }
            >
              {job.workMode}
            </Badge>
            {job.featured && (
              <Badge variant="amber" className="text-[10px]">
                ★ Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Title & Snippet */}
        <div className="mb-3">
          <Link href={`/jobs/${job.slug}`} className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {job.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
            {job.shortSnippet}
          </p>
        </div>

        {/* Mandatory Independence & Trademark Disclaimer on Every Job Posting */}
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-amber-500/10 border-l-3 border-amber-500 text-[11px] text-amber-950/90 dark:text-amber-200/90 leading-relaxed font-normal">
          <span className="font-semibold">&quot;We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose.&quot;</span> Click below to the organisation&apos;s web site.
        </div>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium text-slate-400">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Salary & Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          {job.isSalaryDisclosed && job.salaryMin ? (
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(job.salaryMin, job.salaryCurrency)}
              </span>
              {job.salaryMax && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  - {formatCurrency(job.salaryMax, job.salaryCurrency)}
                </span>
              )}
              <span className="text-[10px] text-slate-400 uppercase">/{job.salaryPeriod.toLowerCase()}</span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
              Competitive Salary
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          {/* Direct channels (shows number and email dialog when clicked) */}
          {(job.showWhatsApp || job.showPhone || job.showEmail) && (
            <div className="flex items-center gap-1.5">
              {job.showWhatsApp && rawPhone && (
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  title={`WhatsApp Contact: ${rawPhone}`}
                  aria-label="Direct WhatsApp to Recruiter"
                  className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400" />
                </button>
              )}

              {job.showPhone && rawPhone && (
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  title={`Call Phone: ${rawPhone}`}
                  aria-label="Call Recruiter Direct"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
              )}

              {job.showEmail && hrEmail && (
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  title={`Email HR: ${hrEmail}`}
                  aria-label="Email Recruiter Direct"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {applyUrl ? (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onApplyClick && onApplyClick(job)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-slate-950 shadow-sm active:scale-95 transition-all"
            >
              <span>Apply Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={`/jobs/${job.slug}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-slate-950 shadow-sm transition-all"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Direct Contact Reveal Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Direct Employer Contact
                </h4>
                <p className="text-xs text-slate-500">
                  {job.employer.displayName} • {job.title}
                </p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Disclaimer in Modal */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Independence Notice</span>
              </div>
              <p>
                &quot;We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose.&quot;
              </p>
            </div>

            {/* Phone / WhatsApp Row */}
            {rawPhone && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp / Direct Helpline:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Verified</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {rawPhone}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(rawPhone, "phone")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedPhone ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPhone ? "Copied" : "Copy"}</span>
                    </button>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 fill-white" />
                        <span>Chat</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Email Row */}
            {hrEmail && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hiring Email Address:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Official Inbox</span>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white truncate">
                    {hrEmail}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyToClipboard(hrEmail, "email")}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      {copiedEmail ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? "Copied" : "Copy"}</span>
                    </button>
                    <a
                      href={`mailto:${hrEmail}?subject=Application for ${encodeURIComponent(job.title)} (JobeeLanka)`}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Apply Button in Modal */}
            {applyUrl && (
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
              >
                <span>Click to Apply on Official Employer Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
