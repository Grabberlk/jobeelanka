"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/modules/jobs/types";
import { buildWhatsAppUrl } from "@/lib/utils";
import {
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ChevronDown,
  Info
} from "lucide-react";

interface DirectEmployerApplyBoxProps {
  job: Job;
}

export const DirectEmployerApplyBox: React.FC<DirectEmployerApplyBoxProps> = ({ job }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeContactTab, setActiveContactTab] = useState<"WHATSAPP" | "EMAIL" | "PHONE" | null>(
    job.showWhatsApp ? "WHATSAPP" : job.showEmail ? "EMAIL" : job.showPhone ? "PHONE" : null
  );

  const applyUrl = job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website;
  
  const rawWaNumber = job.applyWhatsApp || job.employer.officialWhatsApp;
  const waUrl = rawWaNumber
    ? buildWhatsAppUrl(rawWaNumber, job.title, job.employer.displayName)
    : undefined;

  const hrPhone = job.applyWhatsApp || job.employer.officialWhatsApp || "+94112345678";
  const hrEmail = job.applyEmail || `careers@${job.employer.verifiedDomain || "company.com"}`;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Direct Application & Referral Channel
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Apply directly with <strong>{job.employer.displayName}</strong>. Zero middleman fees or hidden markups.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
        >
          {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? "Link Copied!" : "Share Vacancy"}</span>
        </button>
      </div>

      {/* Mandatory Independence & Trademark Disclaimer (Verbatim Requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Independence & Attribution Disclaimer</span>
        </div>
        <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
          &quot;We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose.&quot;
        </p>
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
          Click below to the organisation&apos;s web site.
        </p>
      </div>

      {/* Primary External Application CTA */}
      <div className="space-y-4">
        {applyUrl && (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all text-center"
          >
            <span>Click Here to Apply on Official Employer Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {/* Direct Channels Header & Navigation Buttons */}
        {(job.showWhatsApp || job.showEmail || job.showPhone) && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Direct Contact Channels (Click to reveal details)</span>
              </span>
              <span className="text-[11px] font-normal text-slate-400">Verified by Admin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {job.showWhatsApp && (
                <button
                  type="button"
                  onClick={() => setActiveContactTab(activeContactTab === "WHATSAPP" ? null : "WHATSAPP")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-xs transition-all text-center border ${
                    activeContactTab === "WHATSAPP"
                      ? "bg-[#25D366] text-white border-[#25D366] shadow-md shadow-[#25D366]/20"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Line</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeContactTab === "WHATSAPP" ? "rotate-180" : ""}`} />
                </button>
              )}

              {job.showEmail && (
                <button
                  type="button"
                  onClick={() => setActiveContactTab(activeContactTab === "EMAIL" ? null : "EMAIL")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-xs transition-all text-center border ${
                    activeContactTab === "EMAIL"
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-md"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Email HR Team</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeContactTab === "EMAIL" ? "rotate-180" : ""}`} />
                </button>
              )}

              {job.showPhone && (
                <button
                  type="button"
                  onClick={() => setActiveContactTab(activeContactTab === "PHONE" ? null : "PHONE")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-xs transition-all text-center border ${
                    activeContactTab === "PHONE"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                      : "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone Inquiries</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeContactTab === "PHONE" ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            {/* Tab 1: WhatsApp Detail Drawer */}
            {activeContactTab === "WHATSAPP" && rawWaNumber && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Official WhatsApp Number:
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Direct Recruiter Line
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white px-2">
                    {rawWaNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(rawWaNumber, "phone")}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      {copiedPhone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPhone ? "Copied!" : "Copy"}</span>
                    </button>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Chat Now</span>
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Click &quot;Chat Now&quot; to open a direct chat window with pre-filled vacancy details for {job.employer.displayName}.
                </p>
              </div>
            )}

            {/* Tab 2: Email Detail Drawer */}
            {activeContactTab === "EMAIL" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Hiring Desk Email Address:
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    Direct Employer Inbox
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white px-2 break-all">
                    {hrEmail}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(hrEmail, "email")}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? "Copied!" : "Copy"}</span>
                    </button>
                    <a
                      href={`mailto:${hrEmail}?subject=Application for ${encodeURIComponent(
                        job.title
                      )} (via JobeeLanka)&body=Dear Hiring Team at ${encodeURIComponent(
                        job.employer.displayName
                      )},%0D%0A%0D%0AI am writing to express my interest in the ${encodeURIComponent(
                        job.title
                      )} position discovered via JobeeLanka directory.%0D%0A%0D%0APlease find my credentials attached.%0D%0A%0D%0ARegards`}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  All CV attachments sent to this address go directly to {job.employer.displayName}.
                </p>
              </div>
            )}

            {/* Tab 3: Phone Detail Drawer */}
            {activeContactTab === "PHONE" && (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/70 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                      Telephone / Mobile Helpline:
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Voice Line
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-blue-200 dark:border-blue-800/80">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white px-2">
                    {hrPhone}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(hrPhone, "phone")}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                    >
                      {copiedPhone ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPhone ? "Copied!" : "Copy"}</span>
                    </button>
                    <a
                      href={`tel:${hrPhone}`}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard telecom carrier charges apply when placing local or international voice calls.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust & Transparency Policy Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>JobeeLanka Discovery & Referral Notice</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          JobeeLanka helps users discover employment opportunities. Applications, emails, WhatsApp messages, interviews, and hiring decisions are handled exclusively by the employer, recruiter, or original job source. We never request passwords, payments, or upfront placement fees.
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px]">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Free for Jobseekers</span>
          </span>
          <Link
            href={`/report-listing?jobId=${job.id}&title=${encodeURIComponent(job.title)}`}
            className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report listing / scam</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
