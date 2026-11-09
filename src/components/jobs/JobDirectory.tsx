"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobRepository } from "@/modules/jobs/repository";
import { Job, SearchFacetFilters, WorkMode, EmploymentType } from "@/modules/jobs/types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { AdSlot } from "@/components/ads/AdSlot";
import {
  Search,
  Briefcase,
  Sparkles,
  SlidersHorizontal,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin,
  Laptop
} from "lucide-react";

interface JobDirectoryProps {
  showHeroBanner?: boolean;
  pageSize?: number;
}

export const JobDirectory: React.FC<JobDirectoryProps> = ({
  showHeroBanner = true,
  pageSize = 18,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFacetFilters>({
    query: searchParams?.get("query") || undefined,
    district: searchParams?.get("district") || undefined,
    industry: searchParams?.get("industry") || undefined,
    workMode: (searchParams?.get("workMode") as WorkMode) || undefined,
    employmentType: (searchParams?.get("employmentType") as EmploymentType) || undefined,
    isVerifiedOnly: searchParams?.get("isVerifiedOnly") === "true",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    if (!searchParams) return;
    setFilters({
      query: searchParams.get("query") || undefined,
      district: searchParams.get("district") || undefined,
      industry: searchParams.get("industry") || undefined,
      workMode: (searchParams.get("workMode") as WorkMode) || undefined,
      employmentType: (searchParams.get("employmentType") as EmploymentType) || undefined,
      isVerifiedOnly: searchParams.get("isVerifiedOnly") === "true",
    });
    setCurrentPage(1);
  }, [searchParams]);

  // Execute Search
  const { allMatchingJobs, totalCount } = useMemo(() => {
    const res = JobRepository.searchJobs(filters);
    return { allMatchingJobs: res.jobs, totalCount: res.total };
  }, [filters]);

  // Paginate results
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allMatchingJobs.slice(start, start + pageSize);
  }, [allMatchingJobs, currentPage, pageSize]);

  const updateFilters = (newFilters: SearchFacetFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const quickPillClick = (key: keyof SearchFacetFilters, val: any) => {
    if (filters[key] === val) {
      updateFilters({ ...filters, [key]: undefined });
    } else {
      updateFilters({ ...filters, [key]: val });
    }
  };

  const activeFilterCount = [
    Boolean(filters.district && filters.district !== "All Districts"),
    Boolean(filters.industry && filters.industry !== "All Industries"),
    Boolean(filters.workMode),
    Boolean(filters.employmentType),
    Boolean(filters.isVerifiedOnly),
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Optional Top Hero Search Banner */}
      {showHeroBanner && (
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm transition-colors space-y-5">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Apply Directory</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Click any vacancy to apply directly on official employer portal</span>
          </div>

          <div className="relative space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Explore Verified Careers in Sri Lanka
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Find over 1,400+ curated opportunities from verified employers, UN missions, tech firms, and licensed foreign agencies. No middleman cuts or fake listings.
            </p>
          </div>

          {/* Primary Quick Search Bar */}
          <div className="relative max-w-2xl pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.query || ""}
              onChange={(e) => updateFilters({ ...filters, query: e.target.value })}
              placeholder="Search by role, company, or skill (e.g. React, Accountant, Colombo)..."
              className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
            />
          </div>

          {/* Quick Filter Tag Buttons */}
          <div className="relative flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold mr-1">Quick:</span>
            
            <button
              type="button"
              onClick={() => quickPillClick("workMode", "REMOTE")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                filters.workMode === "REMOTE"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <Laptop className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Remote</span>
            </button>

            <button
              type="button"
              onClick={() => quickPillClick("district", "Colombo")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                filters.district === "Colombo"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Colombo</span>
            </button>

            <button
              type="button"
              onClick={() => quickPillClick("district", "Kandy")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                filters.district === "Kandy"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Kandy</span>
            </button>

            <button
              type="button"
              onClick={() => quickPillClick("industry", "Information Technology")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                filters.industry === "Information Technology"
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Tech & Software</span>
            </button>

            <button
              type="button"
              onClick={() => quickPillClick("isVerifiedOnly", true)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                filters.isVerifiedOnly
                  ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Only</span>
            </button>

            {(filters.query || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* Mobile Drawer Trigger & Filter Summary */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-emerald-600 font-bold text-xs shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <strong className="text-slate-900 dark:text-white">{totalCount}</strong> openings
        </span>
      </div>

      {mobileFiltersOpen && (
        <div className="lg:hidden animate-in slide-in-from-top-2 duration-200">
          <JobFilters
            filters={filters}
            onChange={(f) => updateFilters(f)}
            onReset={handleReset}
            totalResults={totalCount}
            onClose={() => setMobileFiltersOpen(false)}
          />
        </div>
      )}

      {/* Main Grid: Sticky Sidebar + Job Listings Stream */}
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

        {/* Results Stream Column */}
        <div className="lg:col-span-3 space-y-5">
          <div className="hidden lg:flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white font-extrabold">{totalCount}</span> verified openings (Page {currentPage} of {totalPages})
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>

          {paginatedJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No vacancies found matching your filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your search terms, selecting &quot;All Districts&quot;, or resetting your work mode filters.
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
              {/* Responsive Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Native In-Content AdSlot */}
              <AdSlot format="horizontal" pageType="search" />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Page <span className="text-slate-900 dark:text-white font-extrabold">{currentPage}</span> of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

