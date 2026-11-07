"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { JobRepository } from "@/modules/jobs/repository";
import { Job, SearchFacetFilters, WorkMode, EmploymentType } from "@/modules/jobs/types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { AdSlot } from "@/components/ads/AdSlot";
import { Search, Briefcase, Sparkles, SlidersHorizontal, Check, X } from "lucide-react";

function JobsSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFacetFilters>({
    query: searchParams.get("query") || undefined,
    district: searchParams.get("district") || undefined,
    industry: searchParams.get("industry") || undefined,
    workMode: (searchParams.get("workMode") as WorkMode) || undefined,
    employmentType: (searchParams.get("employmentType") as EmploymentType) || undefined,
    isVerifiedOnly: searchParams.get("isVerifiedOnly") === "true",
  });

  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state whenever URL query params change
  useEffect(() => {
    const q = searchParams.get("query") || undefined;
    const d = searchParams.get("district") || undefined;
    const ind = searchParams.get("industry") || undefined;
    const wm = (searchParams.get("workMode") as WorkMode) || undefined;
    const et = (searchParams.get("employmentType") as EmploymentType) || undefined;
    const vo = searchParams.get("isVerifiedOnly") === "true";

    setFilters({
      query: q,
      district: d,
      industry: ind,
      workMode: wm,
      employmentType: et,
      isVerifiedOnly: vo,
    });
  }, [searchParams]);

  // Execute search whenever filters change
  useEffect(() => {
    const res = JobRepository.searchJobs(filters);
    setSearchResults(res.jobs);
    setTotalCount(res.total);
  }, [filters]);

  const updateFilters = (newFilters: SearchFacetFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.query) params.set("query", newFilters.query);
    if (newFilters.district) params.set("district", newFilters.district);
    if (newFilters.industry) params.set("industry", newFilters.industry);
    if (newFilters.workMode) params.set("workMode", newFilters.workMode);
    if (newFilters.employmentType) params.set("employmentType", newFilters.employmentType);
    if (newFilters.isVerifiedOnly) params.set("isVerifiedOnly", "true");
    router.replace(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    const emptyFilters: SearchFacetFilters = {};
    setFilters(emptyFilters);
    setMobileFiltersOpen(false);
    router.replace("/jobs");
  };

  const activeFilterCount = [
    Boolean(filters.district && filters.district !== "All Districts"),
    Boolean(filters.industry && filters.industry !== "All Industries"),
    Boolean(filters.workMode),
    Boolean(filters.employmentType),
    Boolean(filters.isVerifiedOnly),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-linear-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Multi-Faceted Job Search Matrix</span>
        </div>
        <h1 className="relative text-2xl sm:text-4xl font-extrabold tracking-tight">
          Find Verified Vacancies Across Sri Lanka
        </h1>
        <p className="relative text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Search over 1,400+ career listings by district, industry, work mode, and verified status. Direct referral via official employer career pages, verified WhatsApp, or direct HR contact.
        </p>

        {/* Global Search Bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.query || ""}
            onChange={(e) => updateFilters({ ...filters, query: e.target.value })}
            placeholder="Search by role, skill (e.g. React, Cloud, Python), or company..."
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Mobile Filters Bar & Quick Filters */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 font-bold text-xs shrink-0 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={() => updateFilters({ ...filters, isVerifiedOnly: !filters.isVerifiedOnly })}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
              filters.isVerifiedOnly
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {filters.isVerifiedOnly && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Verified Only</span>
          </button>

          <button
            onClick={() => updateFilters({ ...filters, workMode: filters.workMode === "REMOTE" ? undefined : "REMOTE" })}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
              filters.workMode === "REMOTE"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {filters.workMode === "REMOTE" && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Remote</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0 hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {mobileFiltersOpen && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <JobFilters
              filters={filters}
              onChange={(f) => {
                updateFilters(f);
              }}
              onReset={handleReset}
              totalResults={totalCount}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Main Two-Column Search Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sticky Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <JobFilters
            filters={filters}
            onChange={updateFilters}
            onReset={handleReset}
            totalResults={totalCount}
          />
        </div>

        {/* Results Stream */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white font-extrabold">{totalCount}</span> verified openings
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No vacancies found matching your filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your search terms, selecting "All Districts", or resetting your work mode filters.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>

              {/* Policy-Compliant In-Content AdSlot */}
              <AdSlot format="horizontal" pageType="search" />
            </>
          )}
        </div>
      </div>

      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
      />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Job Matrix...</div>}>
      <JobsSearchContent />
    </Suspense>
  );
}
