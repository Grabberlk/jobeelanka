"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Job } from "@/modules/jobs/types";
import { buildWhatsAppUrl } from "@/lib/utils";
import {
  X,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Building2
} from "lucide-react";

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (candidateName: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !job) return null;

  const applyUrl = job.applicationUrl || job.sourceUrl || job.employer.website;
  const waUrl = job.applyWhatsApp
    ? buildWhatsAppUrl(job.applyWhatsApp, job.title, job.employer.displayName)
    : job.employer.officialWhatsApp
    ? buildWhatsAppUrl(job.employer.officialWhatsApp, job.title, job.employer.displayName)
    : undefined;

  const hrPhone = job.employer.officialWhatsApp || "+94112345678";
  const hrEmail = job.applyEmail || `careers@${job.employer.verifiedDomain}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={job.employer.logo}
              alt={job.employer.displayName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {job.employer.displayName}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {job.title}
            </h3>
            <div className="text-xs text-slate-500">
              {job.district}, Sri Lanka • {job.workMode}
            </div>
          </div>
        </div>

        {/* Primary External Application CTA */}
        <div className="space-y-3">
          {applyUrl && (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all text-center"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Direct Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md shadow-[#25D366]/20 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp HR</span>
              </a>
            )}

            <a
              href={`mailto:${hrEmail}?subject=Application for ${encodeURIComponent(job.title)} (via JobeeLanka)`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors text-center"
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Email HR Team</span>
            </a>
          </div>

          <a
            href={`tel:${hrPhone}`}
            className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>Call Official Phone: {hrPhone}</span>
          </a>
        </div>

        {/* Trust Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero Candidate Placement Fees</span>
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
          <p className="text-[11px] leading-relaxed">
            JobeeLanka connects jobseekers directly to verified employers. No passwords, deposits, or placement fees are ever collected.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <Link
            href={`/jobs/${job.slug}`}
            onClick={onClose}
            className="font-bold text-emerald-600 hover:underline"
          >
            View Full Job Specification &rarr;
          </Link>
          <Link
            href={`/report-listing?jobId=${job.id}&title=${encodeURIComponent(job.title)}`}
            onClick={onClose}
            className="text-slate-400 hover:text-amber-500 flex items-center gap-1 text-[11px]"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Report listing</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
