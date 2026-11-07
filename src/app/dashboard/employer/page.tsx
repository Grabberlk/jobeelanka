"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCard } from "@/components/bento/BentoCard";
import { SRI_LANKA_DISTRICTS, INDUSTRIES, SEED_JOBS } from "@/modules/jobs/data";
import { JobRepository } from "@/modules/jobs/repository";
import {
  Building2,
  PlusCircle,
  Users,
  Video,
  Eye,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download
} from "lucide-react";

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"POST" | "APPLICANTS">("POST");

  // New Job Form State
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("Colombo");
  const [industry, setIndustry] = useState("Information Technology");
  const [workMode, setWorkMode] = useState<"HYBRID" | "REMOTE" | "ONSITE">("HYBRID");
  const [salaryMin, setSalaryMin] = useState("450000");
  const [salaryMax, setSalaryMax] = useState("650000");
  const [skillsText, setSkillsText] = useState("React, TypeScript, Go");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const applications = JobRepository.getAllApplications();

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);

    JobRepository.createJob({
      title,
      district,
      city: `${district} Center`,
      industry,
      workMode,
      salaryMin: Number(salaryMin) || undefined,
      salaryMax: Number(salaryMax) || undefined,
      salaryCurrency: "LKR",
      salaryPeriod: "MONTH",
      isSalaryDisclosed: true,
      requiredSkills: skills,
      shortSnippet: description || `Exciting ${title} opening in ${district}.`,
      descriptionHtml: `<p>${description || "Contact employer for details."}</p>`,
    });

    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
      setTitle("");
      setDescription("");
      alert("Job Vacancy is now LIVE on JobeeLanka and eligible for Google Job Search!");
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-bento">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl border border-slate-700">
            IFS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                IFS Sri Lanka Talent Command Center
              </h1>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Enterprise</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified Domain: ifs.com • Orion City R&D Hub • 3 Active Vacancies
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("POST")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "POST"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Post Vacancy
          </button>
          <button
            onClick={() => setActiveTab("APPLICANTS")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "APPLICANTS"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Applicant Inbox ({applications.length})
          </button>
        </div>
      </div>

      {/* Recruiter Bento Grid */}
      <BentoGrid>
        {/* Metric 1: Total Views (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            4,550
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            +32% from last week
          </div>
        </BentoCard>

        {/* Metric 2: WhatsApp Direct Inquiries (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">WhatsApp Inquiries</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            142
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Prefilled candidate messages
          </div>
        </BentoCard>

        {/* Metric 3: Verified Applications Received (Col 4) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Applications</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {applications.length}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            All PDPA consented
          </div>
        </BentoCard>

        {/* Main Interactive Slot: Post Vacancy or Applicant Inbox (Col 8, Row 2) */}
        <BentoCard colSpan="md:col-span-8" rowSpan="md:row-span-2">
          {activeTab === "POST" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    1-Click Structured Vacancy Publisher
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Instant Google Jobs Eligible</span>
              </div>

              {isPublished ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Vacancy Published to Catalog!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Schema.org JobPosting generated. Search facets updated.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior DevOps Engineer"
                      className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        District *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {SRI_LANKA_DISTRICTS.filter((d) => d !== "All Districts").map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Industry *
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {INDUSTRIES.filter((i) => i !== "All Industries").map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Work Mode
                      </label>
                      <select
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        <option value="HYBRID">Hybrid</option>
                        <option value="REMOTE">Remote</option>
                        <option value="ONSITE">On-site</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Salary Min (LKR)
                      </label>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Salary Max (LKR)
                      </label>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Required Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="React, TypeScript, Kubernetes, Docker"
                      className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Description Snippet
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Summary of role expectations and tech stack..."
                      className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Vacancy to Marketplace</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Incoming Encrypted Applications
                </h3>
                <span className="text-xs text-slate-400">Protected under PDPA No. 9</span>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {app.candidateName}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          {app.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {app.candidateEmail} • {app.candidatePhone}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                        "{app.coverNote || "Application submitted via 1-Tap Portal."}"
                      </p>
                    </div>

                    <button
                      onClick={() => alert(`Presigned URL generated (Valid 15m): ${app.cvFileName}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </BentoCard>

        {/* Google Job Search Live Preview (Col 4, Row 2) */}
        <BentoCard colSpan="md:col-span-4" rowSpan="md:row-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Google Jobs Preview</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Schema Ready</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  IFS
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {title || "Lead Cloud Solutions Architect"}
                  </h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    IFS Sri Lanka • {district}, Sri Lanka ({workMode})
                  </div>
                </div>
              </div>

              <div className="text-xs text-emerald-600 font-bold">
                LKR {Number(salaryMin).toLocaleString()} – {Number(salaryMax).toLocaleString()} / mo
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {description || "Join our world-class engineering hub at Orion City. Build and scale enterprise cloud solutions..."}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
                <span>Direct Employer Link</span>
                <span className="text-emerald-600 font-bold">Verified Referral</span>
              </div>
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}

