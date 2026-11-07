"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, Info } from "lucide-react";
import { SALARY_BENCHMARKS } from "@/modules/jobs/data";
import { formatCurrency } from "@/lib/utils";

export const SalaryBenchmarkCard: React.FC = () => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [currency, setCurrency] = useState<"LKR" | "USD">("LKR");

  const benchmark = SALARY_BENCHMARKS[selectedRoleIndex];
  const rateToUSD = 310; // Approx LKR to USD conversion

  const formatVal = (val: number) => {
    if (currency === "USD") {
      return `$${Math.round(val / rateToUSD).toLocaleString("en-US")}`;
    }
    return `LKR ${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sri Lanka Salary Radar
          </span>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
          <button
            onClick={() => setCurrency("LKR")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              currency === "LKR"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500"
            }`}
          >
            LKR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              currency === "USD"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500"
            }`}
          >
            USD
          </button>
        </div>
      </div>

      <div>
        <select
          value={selectedRoleIndex}
          onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
          className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          {SALARY_BENCHMARKS.map((item, idx) => (
            <option key={item.role} value={idx}>
              {item.role}
            </option>
          ))}
        </select>
      </div>

      {/* Salary Spectrum Visualizer */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-baseline">
          <span className="text-xs text-slate-500 dark:text-slate-400">Senior Level:</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {formatVal(benchmark.senior)} <span className="text-xs font-normal text-slate-400">/mo</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Associate</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {formatVal(benchmark.junior)}
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Mid-Level</div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {formatVal(benchmark.mid)}
            </div>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Lead/Arch</div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {formatVal(benchmark.lead)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>Colombo market medians, updated Nov 2026</span>
      </div>
    </div>
  );
};

