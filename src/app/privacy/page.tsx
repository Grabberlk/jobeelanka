import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | JobeeLanka Directory",
  description:
    "Comprehensive Privacy Policy of JobeeLanka. Fully compliant with Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA), GDPR, and Google AdSense publisher policies.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home Directory</span>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Lock className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Legal & Regulatory Transparency
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy & Data Protection Declaration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Effective Date: November 6, 2026 • Governing Law: Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022
          </p>
        </div>

        {/* Bento Notice Box */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Our Core Privacy Pledge to Candidates & Jobseekers</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            JobeeLanka operates strictly as an <strong>independent referral directory and vacancy discovery index</strong>. We <strong>never sell, monetize, or broker</strong> candidate personal data, telephone numbers, or CV resumes to commercial brokers or third-party telemarketers. When you apply or contact an employer via our index, your inquiries are delivered directly to the designated employer or verified recruiter.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>1. Information We Collect</span>
            </h2>
            <p>
              Depending on how you interact with JobeeLanka, we may process minimal categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Candidate Referral Data:</strong> When submitting an application via verified referral routes, your name, email, phone number, and attached resume are processed solely to deliver them to the specified hiring entity.</li>
              <li><strong>Technical Telemetry:</strong> Anonymized web server access logs, device categories, browser types, and approximate geographic region (Sri Lanka district or country) collected to maintain performance, mitigate DDoS attacks, and index regional job demand.</li>
              <li><strong>Direct Recruiter Inquiries:</strong> When using verified WhatsApp or direct call links, communication occurs outside our servers directly on WhatsApp or the telecom network.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>2. Purpose & Legal Basis of Processing</span>
            </h2>
            <p>Under Sri Lanka PDPA Section 5, we process data only where valid statutory grounds exist:</p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Explicit Candidate Consent:</strong> Required prior to transmitting any CV or contact information to a verified hiring company.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Legitimate Public Interest:</strong> Operating a curated public index of career opportunities published officially by corporate bodies, universities, state gazettes, and foreign recruitment licensees.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>3. Candidate Rights Under Sri Lanka PDPA</span>
            </h2>
            <p>Every individual whose data is processed by JobeeLanka retains full statutory rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Right to Access & Rectification</span>
                <p className="text-slate-500 text-xs">You have the right to request access to and correction of any erroneous personal data held about you.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Right to Erasure (&quot;Right to be Forgotten&quot;)</span>
                <p className="text-slate-500 text-xs">You may request the immediate deletion of your candidate inquiry records or listing attributions at any time.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>4. Data Security & Storage Controls</span>
            </h2>
            <p>
              We implement strict technical and organizational controls including end-to-end TLS 1.3 encryption in transit, strict edge-level firewall rules, isolated non-public databases, and zero plaintext credential storage.
            </p>
          </section>

          <section className="space-y-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>5. Contact Our Data Protection Officer (DPO)</span>
            </h2>
            <p>
              If you have questions regarding this Privacy Policy, wish to exercise your PDPA statutory rights, or wish to report a privacy concern, please contact our team:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1">
              <div>JobeeLanka Data Governance & Privacy Office</div>
              <div>Colombo 03, Western Province, Sri Lanka</div>
              <div>Official Email: privacy@jobeelanka.com / hello@jobeelanka.com</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
