import React from "react";
import Link from "next/link";
import { SEED_EMPLOYERS, SEED_JOBS } from "@/modules/jobs/data";
import { ShieldCheck, Building2, ExternalLink, ArrowRight, MapPin, Globe } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata = {
  title: "Verified Companies in Sri Lanka | JobeeLanka",
  description: "Browse verified Sri Lankan tech companies, apparel manufacturers, banks, and SLBFE licensed agencies on JobeeLanka.",
};

export default function CompaniesPage() {
  const employers = Object.values(SEED_EMPLOYERS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Organization Roster</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Verified Employers & Recruitment Agencies in Sri Lanka
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Every company listed on JobeeLanka is verified through corporate domain authentication, business registration (BR), or the Sri Lanka Bureau of Foreign Employment (SLBFE).
        </p>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employers.map((emp) => {
          const activeJobsCount = SEED_JOBS.filter((j) => j.employer.id === emp.id).length;

          return (
            <div
              key={emp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-bento hover:shadow-bento-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden p-1 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={emp.logo}
                      alt={emp.displayName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{emp.slbfeLicenseNumber ? "SLBFE Licensed" : "Verified"}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {emp.displayName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.district}, Sri Lanka</span>
                    </span>
                    <span>•</span>
                    <a
                      href={emp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      <span>{emp.verifiedDomain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {emp.about}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {activeJobsCount} active role{activeJobsCount === 1 ? "" : "s"}
                </span>

                <Link
                  href={`/jobs?query=${encodeURIComponent(emp.displayName)}`}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                >
                  <span>View Vacancies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* AdSense AdSlot */}
      <AdSlot format="horizontal" pageType="directory" />
    </div>
  );
}
