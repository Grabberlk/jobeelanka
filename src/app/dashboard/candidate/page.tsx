"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCard } from "@/components/bento/BentoCard";
import {
  User,
  FileText,
  Bell,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Eye,
  Award
} from "lucide-react";

export default function CandidateDashboardPage() {
  const [telegramAlertsEnabled, setTelegramAlertsEnabled] = useState(true);
  const [whatsAppAlertsEnabled, setWhatsAppAlertsEnabled] = useState(true);

  const applications = [
    {
      id: "app-1",
      role: "Lead Cloud Solutions Architect",
      company: "IFS Sri Lanka",
      status: "SHORTLISTED",
      date: "Nov 5, 2026",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      id: "app-2",
      role: "Senior Full Stack Engineer (React / Go)",
      company: "WSO2",
      status: "VIEWED",
      date: "Nov 5, 2026",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      id: "app-3",
      role: "Senior Site Reliability Engineer (5G Core)",
      company: "Dialog Axiata",
      status: "SENT",
      date: "Nov 6, 2026",
      badgeColor: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-600/20">
            KP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Kavindu Perera
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>PDPA Verified Profile</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lead Cloud Architect • Colombo, Sri Lanka • Open to Hybrid/Remote
            </p>
          </div>
        </div>

        <Link
          href="/jobs"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
        >
          <span>Browse 1,420 Vacancies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Candidate Bento Cockpit Grid */}
      <BentoGrid>
        {/* Cell 1: CV Health & Anonymized Privacy Vault (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  CV Vault & Health
                </span>
              </div>
              <span className="text-xs font-black text-emerald-600">85% Complete</span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[85%]" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">Active CV:</span> Kavindu_Perera_Lead_Cloud_Architect.pdf
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Encrypted in Private S3</span>
              <button
                onClick={() => alert("Upload dialog opened. File replaced and re-encrypted.")}
                className="font-bold text-emerald-600 hover:underline"
              >
                Update CV
              </button>
            </div>
          </div>
        </BentoCard>

        {/* Cell 2: Real-time Alert Subscriptions (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Instant Job Alerts
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Telegram Channel Bot</span>
                <input
                  type="checkbox"
                  checked={telegramAlertsEnabled}
                  onChange={(e) => setTelegramAlertsEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">WhatsApp Digest (Daily)</span>
                <input
                  type="checkbox"
                  checked={whatsAppAlertsEnabled}
                  onChange={(e) => setWhatsAppAlertsEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Filtered for: Colombo • Cloud & Lead Architect
            </div>
          </div>
        </BentoCard>

        {/* Cell 3: Salary Benchmark Comparative Radar (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex flex-col justify-between h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Salary Match
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600">Top 10% Bracket</span>
            </div>

            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                LKR 650k - 850k
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Your profile matches 14 verified lead roles currently hiring in Colombo.
              </p>
            </div>

            <Link
              href="/salaries"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center justify-between"
            >
              <span>Explore Salary Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </BentoCard>

        {/* Cell 4: Application Tracker Kanban (Col 12, Row 2) */}
        <BentoCard colSpan="md:col-span-12" rowSpan="md:row-span-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Application Tracker Kanban
                </h3>
                <p className="text-xs text-slate-500">
                  Track status updates from verified Sri Lankan employers
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {applications.length} Active Submissions
              </span>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Col 1: Sent / In Review */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Sent / In Review</span>
                  </span>
                  <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">1</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Senior SRE (5G Core)
                  </div>
                  <div className="text-[11px] text-slate-500">Dialog Axiata • Colombo</div>
                  <div className="text-[10px] text-slate-400 pt-1">Dispatched Nov 6</div>
                </div>
              </div>

              {/* Col 2: Viewed by Recruiter */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-blue-600 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Viewed by Recruiter</span>
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full text-[10px]">1</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Senior Full Stack (React / Go)
                  </div>
                  <div className="text-[11px] text-slate-500">WSO2 • Remote</div>
                  <div className="text-[10px] text-blue-600 font-semibold pt-1">Profile Reviewed Yesterday</div>
                </div>
              </div>

              {/* Col 3: Shortlisted / Interview */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 uppercase">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Shortlisted / Interview</span>
                  </span>
                  <span className="bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">1</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 space-y-1.5 shadow-xs">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Lead Cloud Solutions Architect
                  </div>
                  <div className="text-[11px] text-slate-500">IFS Sri Lanka • Orion City</div>
                  <div className="text-[10px] text-emerald-600 font-bold pt-1">Interview Call Scheduled</div>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

