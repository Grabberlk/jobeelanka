"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Building2, ArrowRight, ExternalLink } from "lucide-react";

export const VerifiedDirectoryCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Direct & Verified
          </span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Zero Candidate Fees</span>
        </span>
      </div>

      {/* Main Copy */}
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          Direct Employer Referral Guarantee
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          No CV storage or middleman markups. Discover verified Sri Lankan vacancies and connect directly with official HR teams.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">WSO2, IFS, Sysco</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">SLBFE Licensed</span>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href="/companies"
        className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700"
      >
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Explore Verified Companies</span>
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </Link>
    </div>
  );
};

