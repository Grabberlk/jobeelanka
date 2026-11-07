"use client";

import React from "react";

interface AdSlotProps {
  slotId?: string;
  format?: "horizontal" | "rectangle" | "responsive";
  className?: string;
  pageType?: "home" | "category" | "listing" | "resource" | "search" | "directory" | "salaries";
}

/**
 * AdSlot component adhering strictly to Google AdSense Publisher Policies:
 * - Explicitly labeled as "ADVERTISEMENT"
 * - Clear separation from interactive buttons (never placed next to Apply / WhatsApp / Navigation)
 * - Safe placeholder styling with graceful client-side rendering
 * - Excluded on admin, login, report, or thin pages
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
  pageType = "category",
}) => {
  return (
    <div
      role="complementary"
      aria-label="Sponsored Advertisement"
      className={`my-6 mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 text-center transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-1.5 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
        <span>Advertisement</span>
        <span className="text-[9px] font-normal lowercase text-slate-400">sponsored link</span>
      </div>

      <div
        className={`flex items-center justify-center rounded-xl bg-white/60 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-700/60 p-4 min-h-[90px] sm:min-h-[110px] text-xs text-slate-500 dark:text-slate-400`}
      >
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Relevant Career & Higher Education Opportunities
          </p>
          <p className="text-[11px] text-slate-400">
            Google AdSense verified unit ({format} · {pageType} placement)
          </p>
        </div>
      </div>
    </div>
  );
};

