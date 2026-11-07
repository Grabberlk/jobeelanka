import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Users, Globe2, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

export const metadata = {
  title: "About JobeeLanka | Sri Lanka's Independent Employment Directory",
  description:
    "Learn about JobeeLanka, Sri Lanka's curated employment discovery platform. Connecting talent directly with verified enterprises, foreign missions, and direct recruitment lines.",
};

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
            <Building2 className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            About Our Mission & Directory
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Sri Lanka&apos;s Trusted Employment Discovery Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Connecting Sri Lankan professionals, fresh graduates, and skilled workers with verified career opportunities.
        </p>
      </div>

      {/* Bento Story Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-bento space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1,100+ Curated Listings</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            From blue-chip conglomerates and IT tech startups to UN agencies and state sector openings across Sri Lanka.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-bento space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Anti-Scam Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict vetting against fraudulent foreign employment recruiters, upfront deposit scams, and illegal agencies.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-bento space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Direct Employer Routing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Candidates apply straight to official company portals or authorized HR WhatsApp/Email channels without commission cuts.
          </p>
        </div>
      </div>

      {/* Editorial & Operational Philosophy */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why JobeeLanka was Created
          </h2>
          <p>
            Job hunting in Sri Lanka has historically suffered from fragmented sources, outdated newspaper scans, opaque headhunter intermediaries, and rampant foreign employment scams targeting vulnerable jobseekers.
          </p>
          <p>
            JobeeLanka was founded to solve this problem by providing a modern, fast, mobile-optimized, and clean <strong>searchable directory index</strong>. We catalog career opportunities directly from official corporate portals, state gazettes, verified non-governmental organizations (NGOs), and licensed foreign recruitment partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Our Independence Guarantee
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <p className="font-medium text-slate-900 dark:text-white">
              &quot;JobeeLanka is an independent discovery organization and is not associated with, sponsored by, or endorsed by any listed company, unless explicitly stated. Company logos and trademarks are used strictly for informational identification purposes.&quot;
            </p>
            <p className="text-xs text-slate-500">
              When you click &quot;Apply on Official Employer Website&quot;, you are redirected directly to the authentic employer domain.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Headquarters & Inquiries
          </h2>
          <p>
            For corporate directory indexing, API integrations, feed syndication, or listing audits, please reach our team:
          </p>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-xs space-y-1">
            <div>JobeeLanka Operations & Directory Desk</div>
            <div>Colombo, Sri Lanka</div>
            <div>Email: hello@jobeelanka.com / admin@jobeelanka.com</div>
          </div>
        </section>
      </div>
    </div>
  );
}

