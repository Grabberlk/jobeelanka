"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Sparkles, ArrowRight } from "lucide-react";
import { SRI_LANKA_DISTRICTS } from "@/modules/jobs/data";

export const BentoHeroSearch: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (district && district !== "All Districts") params.set("district", district);
    if (selectedTag) params.set("workMode", selectedTag);
    router.push(`/jobs?${params.toString()}`);
  };

  const quickPills = [
    { label: "Remote Only", mode: "REMOTE" },
    { label: "Hybrid Colombo", district: "Colombo" },
    { label: "Kandy Tech Hub", district: "Kandy" },
    { label: "Overseas (SLBFE)", district: "Dubai" },
  ];

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* Title & Micro-badge */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JobeeLanka — Sri Lanka’s Trusted Jobs & Career Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Find your next opportunity in{" "}
          <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-700 underline-offset-4">
            Sri Lanka
          </span>
          .
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl">
          Discover employer career pages, current vacancies, recruitment agencies, internships, and remote work. Direct referral to hiring managers and official portals.
        </p>
      </div>

      {/* Omnisearch Bar */}
      <form
        onSubmit={handleSearch}
        className="bg-slate-50 dark:bg-slate-950/80 p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Role, tech stack, or employer (e.g., React, IFS)..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d} value={d} className="dark:bg-slate-900">
                {d}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <span>Search Roles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Popular:</span>
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (pill.mode) {
                router.push(`/jobs?workMode=${pill.mode}`);
              } else if (pill.district) {
                router.push(`/jobs?district=${pill.district}`);
              }
            }}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
};

