import React from "react";
import Link from "next/link";
import { ShieldAlert, FileText, ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service & Directory Usage | JobeeLanka",
  description:
    "Terms of Use and Directory Operating Agreement for JobeeLanka. Outlines the independent job discovery model, zero fee protection, trademark notices, and candidate safety.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
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
            <FileText className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Platform Agreement & Directory Terms
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Terms of Service & Directory Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last Updated: November 6, 2026 • Effective for all JobeeLanka users, employers, and candidates
        </p>
      </div>

      {/* Mandatory Independence Statement Box */}
      <div className="p-6 rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-3 shadow-bento">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="text-sm">Mandatory Independence & Trademark Attribution Notice</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
          &quot;We are independent organisation and not associated with or sponsored by the organisation above, logo is only for information purpose. Click below to the organisation&apos;s web site.&quot;
        </p>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
          All corporate brand names, logos, registered trademarks, and statutory emblems featured in our catalog belong exclusively to their respective owners. Their display on JobeeLanka is solely for indexation, informational identification, and candidate career discovery.
        </p>
      </div>

      {/* Key Terms */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Scope of the Service: An Independent Discovery Index
          </h2>
          <p>
            JobeeLanka is an open, curated <strong>Sri Lankan employment directory and opportunity search engine</strong>. JobeeLanka does not act as an employer, recruiting agent, or human resource placement agency.
          </p>
          <p>
            When a jobseeker accesses a vacancy on JobeeLanka, they are directed to the official employer destination portal, authorized recruiter line, or official application intake. All subsequent applications, employment interviews, selection evaluations, and contractual decisions remain exclusively between the candidate and the hiring entity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Strict Zero Fee Protection for Candidates
          </h2>
          <p>
            JobeeLanka maintains an uncompromised policy: <strong>Jobseeking is 100% free</strong>. We strictly prohibit any employer or agency listed on JobeeLanka from demanding:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Upfront &quot;interview registration&quot; or processing fees.</li>
            <li>Unaccredited medical examination fees without formal SLBFE certification.</li>
            <li>Training bond deposits or security withholding payments.</li>
          </ul>
          <p>
            Any employer or poster caught demanding unauthorized payments will be permanently blacklisted, reported to the Sri Lanka Bureau of Foreign Employment (SLBFE) and relevant law enforcement authorities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Accuracy & External Destination Disclaimers
          </h2>
          <p>
            While our administrative curation team verifies listed career links, JobeeLanka does not control or operate the websites, servers, or application management portals of third-party organizations. Users acknowledge that applying for jobs on third-party domains is governed by those third parties&apos; independent terms and privacy protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Takedown & Correction Policy
          </h2>
          <p>
            If you are an authorized representative of an organization and wish to update, modify, or remove your listing or career attribution from JobeeLanka, please contact our editorial desk at{" "}
            <a href="mailto:support@jobeelanka.com" className="text-emerald-600 font-bold underline">
              support@jobeelanka.com
            </a>
            . We process formal removal and verification requests within 24 business hours.
          </p>
        </section>
      </div>
    </div>
  );
}

