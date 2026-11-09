"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { JobDirectory } from "@/components/jobs/JobDirectory";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* =========================================================================
          DIRECTORY NOTICE & WELCOME STRIP
      ========================================================================= */}
      <section className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="space-y-1">
          <p className="font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>JobeeLanka — Curated Sri Lanka Job & Vacancy Directory</span>
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Browse verified vacancies across Sri Lanka. When you click <strong>Apply Now</strong> or any vacancy title, you are taken directly to the official employer careers portal or vacancy destination.
          </p>
        </div>
        <Link
          href="/safety"
          className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 transition-colors"
        >
          Verification Guide
        </Link>
      </section>

      {/* =========================================================================
          MAIN DIRECTORY STREAM (SEARCH + FILTERS + DIRECT APPLY JOBS)
      ========================================================================= */}
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-semibold">Loading Verified Vacancies...</div>}>
        <JobDirectory showHeroBanner={true} pageSize={18} />
      </Suspense>
    </div>
  );
}
