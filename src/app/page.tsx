"use client";

import React from "react";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCard } from "@/components/bento/BentoCard";
import { BentoHeroSearch } from "@/components/bento/BentoHeroSearch";
import { LivePulseTicker } from "@/components/bento/LivePulseTicker";
import { SalaryBenchmarkCard } from "@/components/bento/SalaryBenchmarkCard";
import { VerifiedDirectoryCard } from "@/components/bento/VerifiedDirectoryCard";
import { JobCard } from "@/components/jobs/JobCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { SEED_JOBS } from "@/modules/jobs/data";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const featuredJobs = SEED_JOBS.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14">
      {/* =========================================================================
          DIRECTORY NOTICE & WELCOME STRIP
      ========================================================================= */}
      <section className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="space-y-1">
          <p className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>JobeeLanka — Curated Sri Lanka Job & Vacancy Directory</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Browse verified vacancies across Sri Lanka. When you click <strong>Apply Now</strong>, you are taken directly to the official employer careers portal or vacancy destination.
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
          SECTION 1: FEATURED OPPORTUNITIES (MOVED TO TOP)
      ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Direct Hiring Pipeline
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Verified Direct Link
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Featured Opportunities in Sri Lanka
            </h1>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group"
          >
            <span>View all 1,420 vacancies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          ADSENSE AD SLOT 1 (DIRECTORY DISPLAY)
      ========================================================================= */}
      <AdSlot format="horizontal" pageType="home" />

      {/* =========================================================================
          SECTION 2: SEARCH MATRIX & DIRECTORY EXPLORATION (BELOW FEATURED)
      ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Directory Search & Facets
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Search Vacancies & Employers
            </h2>
          </div>
        </div>

        <BentoGrid>
          {/* Bento Cell A: Main Search & Facet Matrix */}
          <BentoCard colSpan="md:col-span-8" rowSpan="md:row-span-2" glass>
            <BentoHeroSearch />
          </BentoCard>

          {/* Bento Cell B: Live Marketplace Pulse */}
          <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
            <LivePulseTicker />
          </BentoCard>

          {/* Bento Cell C: Verified Directory & Zero Fees */}
          <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
            <VerifiedDirectoryCard />
          </BentoCard>

          {/* Bento Cell D: Salary Radar & Benchmarks */}
          <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
            <SalaryBenchmarkCard />
          </BentoCard>

          {/* Bento Cell E: Global Diaspora & Overseas Radar */}
          <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
            <div className="flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Overseas & Remote
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  SLBFE Verified
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  Accredited Global Positions
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Verified foreign agencies licensed by SLBFE. Direct links with zero applicant fees.
                </p>
              </div>
              <Link
                href="/jobs?industry=Overseas+Careers+(SLBFE+Verified)"
                className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
              >
                <span>Browse Overseas Vacancies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </BentoCard>
        </BentoGrid>
      </section>
    </div>
  );
}
