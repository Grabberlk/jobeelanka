import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | JobeeLanka Directory",
  description:
    "Comprehensive Privacy Policy of JobeeLanka. Fully compliant with Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA), GDPR, and Google AdSense publisher policies.",
};

export default function PrivacyPolicyPage() {
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
            <Lock className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
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
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-8 space-y-3 shadow-bento">
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
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Information We Collect</span>
          </h2>
          <p>
            Depending on how you interact with JobeeLanka, we may process minimal categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <strong>Log & Technical Data:</strong> IP address, device type, browser user-agent, operating system, and referral headers used solely for DDOS mitigation, security auditing, and server diagnostic reliability.
            </li>
            <li>
              <strong>Direct Inquiries & Referral Information:</strong> If you utilize our direct candidate routing features to submit application inquiries, we facilitate direct transmission to the hiring organization. We do not retain unprotected copies of your identification credentials or national identity cards (NIC).
            </li>
            <li>
              <strong>Scam & Listing Reports:</strong> Information submitted via our verified reporting channels to investigate fraudulent recruitment attempts or fake foreign employment agencies.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>2. Cookies & Third-Party Advertising (Google AdSense)</span>
          </h2>
          <p>
            JobeeLanka may display advertisements served by third-party advertising partners such as <strong>Google AdSense</strong> to support our free directory services for Sri Lankan citizens.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
            </li>
            <li>
              Google&apos;s use of advertising cookies (such as the DoubleClick DART cookie) enables it and its partners to serve ads to users based on their visit to JobeeLanka and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline font-semibold"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of third-party vendor use of cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline font-semibold"
              >
                www.aboutads.info
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>3. Compliance with Sri Lanka PDPA No. 9 of 2022</span>
          </h2>
          <p>
            Under the provisions of the Sri Lanka Personal Data Protection Act No. 9 of 2022, data subjects in Sri Lanka possess statutory rights regarding their personal information:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Right of Access & Rectification</span>
              <p className="text-slate-500 text-xs">You have the right to request access to and correction of any erroneous personal data held about you.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Right to Erasure (&quot;Right to be Forgotten&quot;)</span>
              <p className="text-slate-500 text-xs">You may request the immediate deletion of your candidate inquiry records or listing attributions at any time.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>4. Data Security & Storage Controls</span>
          </h2>
          <p>
            We implement strict technical and organizational controls including end-to-end TLS 1.3 encryption in transit, strict edge-level firewall rules, isolated non-public databases, and zero plaintext credential storage.
          </p>
        </section>

        <section className="space-y-3">
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
  );
}

