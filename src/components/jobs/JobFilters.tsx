"use client";

import React from "react";
import { SearchFacetFilters, WorkMode } from "@/modules/jobs/types";
import { SRI_LANKA_DISTRICTS, INDUSTRIES } from "@/modules/jobs/data";
import { Filter, RotateCcw, ShieldCheck, MapPin, Briefcase, X } from "lucide-react";

interface JobFiltersProps {
  filters: SearchFacetFilters;
  onChange: (filters: SearchFacetFilters) => void;
  onReset: () => void;
  totalResults: number;
  onClose?: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  onClose,
}) => {
  const workModes: { label: string; value: WorkMode }[] = [
    { label: "Remote", value: "REMOTE" },
    { label: "Hybrid", value: "HYBRID" },
    { label: "On-site", value: "ONSITE" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 shadow-bento space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Filters ({totalResults} roles)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Work Mode Toggle Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Work Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {workModes.map((wm) => {
            const active = filters.workMode === wm.value;
            return (
              <button
                key={wm.value}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    workMode: active ? undefined : wm.value,
                  })
                }
                className={`min-h-[38px] py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {wm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* District Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>District / Location</span>
        </label>
        <select
          value={filters.district || "All Districts"}
          onChange={(e) =>
            onChange({
              ...filters,
              district: e.target.value === "All Districts" ? undefined : e.target.value,
            })
          }
          className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
        >
          {SRI_LANKA_DISTRICTS.map((d) => (
            <option key={d} value={d} className="dark:bg-slate-900">
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Industry Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
          <span>Industry</span>
        </label>
        <select
          value={filters.industry || "All Industries"}
          onChange={(e) =>
            onChange({
              ...filters,
              industry: e.target.value === "All Industries" ? undefined : e.target.value,
            })
          }
          className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind} className="dark:bg-slate-900">
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Verified Employers Only Toggle */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
          <input
            type="checkbox"
            checked={Boolean(filters.isVerifiedOnly)}
            onChange={(e) =>
              onChange({
                ...filters,
                isVerifiedOnly: e.target.checked,
              })
            }
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Employers Only</span>
          </div>
        </label>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm text-center"
        >
          Apply Filters ({totalResults} roles)
        </button>
      )}
    </div>
  );
};
