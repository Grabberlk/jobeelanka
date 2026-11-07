"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldCheck, Users, Flame } from "lucide-react";

export const LivePulseTicker: React.FC = () => {
  const [pulseCount, setPulseCount] = useState(1420);

  const tickerItems = [
    "Sysco LABS posted Senior QA Lead (Colombo)",
    "IFS Sri Lanka opened Lead Cloud Architect role",
    "MAS Holdings hiring 3D Digital Fashion Designers",
    "Apex Overseas verified SLBFE Dubai MEP Engineers",
    "Commercial Bank posted Digital Risk Manager",
  ];

  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Marketplace Pulse
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-1">
        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {pulseCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active Vacancies
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>184</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Verified Employers
          </div>
        </div>
      </div>

      {/* Rolling Activity Notice */}
      <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 overflow-hidden">
        <Flame className="w-4 h-4 text-amber-500 shrink-0" />
        <div className="truncate font-medium transition-all duration-300">
          {tickerItems[activeTickerIndex]}
        </div>
      </div>
    </div>
  );
};

