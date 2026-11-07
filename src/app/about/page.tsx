import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Users,
  Globe2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MapPin,
  Mail,
  ShieldAlert,
  Briefcase
} from "lucide-react";

export const metadata = {
  title: "About JobeeLanka | Sri Lanka's Independent Employment Directory",
  description:
    "Learn about JobeeLanka, Sri Lanka's curated employment discovery platform. Connecting talent directly with verified enterprises, foreign missions, and direct recruitment lines.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home Directory</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka&apos;s Independent Discovery OS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Bridging Sri Lankan Talent with Verified Careers
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mt-4 leading-relaxed font-normal">
            JobeeLanka is an independent employment directory dedicated to transparency, scam eradication, and seamless candidate-to-employer connections across Sri Lanka and licensed overseas opportunities.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* Three Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 group-hover:scale-105 transition-transform">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">1,150+ Curated Openings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Indexed directly from leading Sri Lankan conglomerates, tech startups, UN missions, and state statutory bodies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Zero Aggregation Paywalls</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-xs hover:shadow-md hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">SLBFE & Anti-Scam Vetting</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rigorous oversight against foreign recruitment fraud, unauthorized agents, and predatory upfront deposit fees.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span>Candidate Safety First</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-xs hover:shadow-md hover:border-purple-500/40 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/60 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Direct Employer Routing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Candidates apply straight on the official company careers page or direct HR WhatsApp line without headhunter fee cuts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <span>Direct Authentic Referral</span>
            </div>
          </div>
        </div>

        {/* Narrative Comparison Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>The Industry Problem</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Why Traditional Job Hunting in Sri Lanka Fails
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Unverified newspaper scans and expired social media posts with dead application links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Intermediary agency fees taking deductions from entry-level workers&apos; salaries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Rampant scam networks demanding upfront medical or visa processing deposits.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>The JobeeLanka Standard</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Our Clean Directory Architecture
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>100% verified destination URLs taking you directly to the official hiring organization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Zero charge to candidates: no placement commissions, subscription gates, or paywalled CVs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Integrated SLBFE validation guidance to guarantee safe overseas migration.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Independence Guarantee Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Neutrality & Independence Guarantee</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              &quot;JobeeLanka is an independent discovery organization and is not associated with, sponsored by, or endorsed by any listed company, unless explicitly stated. Company logos and trademarks are used strictly for informational identification purposes.&quot;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When candidates click &quot;Apply on Official Employer Website&quot;, they are redirected directly to the authentic employer domain or authorized corporate HR portal.
            </p>
          </div>
        </div>

        {/* Headquarters & Operations Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Platform Operations & Directory Inquiries
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              For corporate indexing requests, employer profile verification, or feed syndication:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-2xs shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Operations Desk</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Colombo, Western Province, Sri Lanka
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Direct Communications</div>
                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 truncate">
                  hello@jobeelanka.com
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Verified Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/safety"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Read SLBFE Safety Guide</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
