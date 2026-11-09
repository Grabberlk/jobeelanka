import React from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, CheckCircle2, PhoneCall, ArrowLeft, ExternalLink } from "lucide-react";

export const metadata = {
  title: "SLBFE Overseas Recruitment Safety & Scam Guide | JobeeLanka",
  description: "Official safety guidelines for Sri Lankan professionals seeking employment abroad. How to verify SLBFE license numbers and avoid foreign recruitment scams.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home Directory</span>
        </Link>

        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Statutory Protection & Worker Safety</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Overseas Recruitment Safety & SLBFE Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Guidance from the Sri Lanka Bureau of Foreign Employment (SLBFE) to safeguard Sri Lankan migrant workers and professionals from predatory recruitment scams.
          </p>
        </div>

        {/* Critical Red Flags Section */}
        <div className="bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-base">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Zero-Tolerance Scam Red Flags</span>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-rose-600 font-bold">1. Upfront &quot;Processing&quot; Fees:</span>
              <span>Legitimate employers or licensed recruitment agencies will NEVER ask you to deposit money into personal bank accounts for &quot;interview fees&quot;, &quot;job reservation&quot;, or &quot;medical clearances&quot;.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-600 font-bold">2. Tourist or Visit Visas for Work:</span>
              <span>Never travel overseas on a tourist visa expecting to convert to a work permit locally without official SLBFE registration. Always insist on a validated employment visa beforehand.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-600 font-bold">3. Retention of Original Passports:</span>
              <span>Never surrender your original passport to intermediaries or unverified agents in Sri Lanka.</span>
            </li>
          </ul>
        </div>

        {/* 4-Step Verification Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            How to Verify an Overseas Opportunity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 1: Inspect SLBFE License</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Check if the agency holds an active license formatted as <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">SLBFE/AL/YYYY/XXXX</code>. All licensed agencies on JobeeLanka display this verified seal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 2: Cross-check Bureau Portal</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Visit <a href="https://www.slbfe.lk" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-semibold underline">www.slbfe.lk</a> to confirm that the agency&apos;s license is active and in good standing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 3: SLBFE Pre-departure Registration</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Before departing Sri Lanka, ensure you are registered with SLBFE to receive government insurance, emergency repatriation support, and consular backing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step 4: Report Suspicious Postings</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                If any listing on our platform requests upfront fees, report it immediately to JobeeLanka safety desk or call SLBFE hotline 1989.
              </p>
            </div>
          </div>
        </div>

        {/* Official Hotlines */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-6 border border-emerald-800/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold">SLBFE 24/7 Information Center</h4>
              <p className="text-xs text-slate-300">Dial 1989 (Within Sri Lanka) or +94 11 277 6280</p>
            </div>
          </div>
          <a
            href="https://www.slbfe.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            <span>Visit Official SLBFE Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
