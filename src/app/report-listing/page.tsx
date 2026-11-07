"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, ArrowLeft, Send, ShieldAlert } from "lucide-react";

function ReportListingForm() {
  const searchParams = useSearchParams();
  const titleParam = searchParams.get("title");
  const jobIdParam = searchParams.get("jobId");

  const [listingUrl, setListingUrl] = useState("");
  const [reason, setReason] = useState("EXPIRED");
  const [details, setDetails] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (titleParam) {
      setListingUrl(decodeURIComponent(titleParam));
    } else if (jobIdParam) {
      setListingUrl(`Vacancy ID: ${jobIdParam}`);
    }
  }, [titleParam, jobIdParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-500 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Report an Incorrect or Expired Listing
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          JobeeLanka is committed to source freshness and scam prevention. If a vacancy has expired, broken links, unauthorized fees, or inaccurate details, please notify our compliance team immediately.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center space-y-4 shadow-bento">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Report Received & Queued for Moderation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Our moderation desk will inspect the listing URL within 2 to 4 business hours. Stale or non-compliant listings will be paused or removed immediately.
          </p>
          <div className="pt-2">
            <Link
              href="/jobs"
              className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Return to Job Directory
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento space-y-5"
        >
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              JobeeLanka Vacancy URL or Title *
            </label>
            <input
              type="text"
              required
              value={listingUrl}
              onChange={(e) => setListingUrl(e.target.value)}
              placeholder="e.g. Lead Cloud Architect at IFS Sri Lanka or URL"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Primary Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
            >
              <option value="EXPIRED">Listing is expired / Applications closed</option>
              <option value="DEAD_LINK">Application link is broken (404/Redirect loop)</option>
              <option value="SCAM_FEES">Suspicious activity / Recruiter asking for payment or passport</option>
              <option value="INCORRECT_DETAILS">Incorrect company name, location, or salary</option>
              <option value="UNAUTHORIZED">Employer did not authorize this listing</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Specific Details / Evidence
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any additional notes, screenshots, or broken URLs to assist our moderators..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Your Email Address (Optional, for resolution confirmation)
            </label>
            <input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report to Moderation Desk</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ReportListingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading form...</div>}>
      <ReportListingForm />
    </Suspense>
  );
}
