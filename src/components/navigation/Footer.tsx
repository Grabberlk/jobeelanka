import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, MapPin, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                JL
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Jobee<span className="text-emerald-400">Lanka</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sri Lanka’s trusted jobs and career directory. Discover employer career pages, current vacancies, recruitment agencies, internships, and verified overseas resources.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Compliant with Sri Lanka PDPA No. 9 of 2022</span>
            </div>
          </div>

          {/* Col 2: Top Sri Lankan Hubs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Job Hubs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/jobs?district=Colombo" className="hover:text-emerald-400 transition-colors">
                  Jobs in Colombo (Orion City, Fort)
                </Link>
              </li>
              <li>
                <Link href="/jobs?district=Kandy" className="hover:text-emerald-400 transition-colors">
                  Jobs in Kandy (IT & Tourism)
                </Link>
              </li>
              <li>
                <Link href="/jobs?district=Gampaha" className="hover:text-emerald-400 transition-colors">
                  Jobs in Gampaha (Apparel & Healthcare)
                </Link>
              </li>
              <li>
                <Link href="/jobs?district=Galle" className="hover:text-emerald-400 transition-colors">
                  Jobs in Galle (Hospitality & Tech)
                </Link>
              </li>
              <li>
                <Link href="/jobs?workMode=REMOTE" className="hover:text-emerald-400 transition-colors">
                  Remote Jobs (Global Diaspora)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Industry Taxonomy */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Key Industries</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/jobs?industry=Information+Technology" className="hover:text-emerald-400 transition-colors">
                  Information Technology & AI
                </Link>
              </li>
              <li>
                <Link href="/jobs?industry=Banking+%26+Financial+Services" className="hover:text-emerald-400 transition-colors">
                  Banking & Financial Services
                </Link>
              </li>
              <li>
                <Link href="/jobs?industry=Apparel+%26+Manufacturing" className="hover:text-emerald-400 transition-colors">
                  Apparel & Advanced Textiles
                </Link>
              </li>
              <li>
                <Link href="/jobs?industry=Hospitality+%26+Tourism" className="hover:text-emerald-400 transition-colors">
                  Hospitality & Sustainable Tourism
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-emerald-400 transition-colors">
                  SLBFE Overseas Recruitment Check
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Compliance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Compliance & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About JobeeLanka
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy & PDPA
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-emerald-400 transition-colors">
                  Recruitment Scam Prevention
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-emerald-400 transition-colors">
                  Verified Employer Directory
                </Link>
              </li>
              <li>
                <Link href="/report-listing" className="hover:text-emerald-400 transition-colors text-amber-400">
                  Report Expired or Incorrect Listing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Application Notice Banner */}
        <div className="py-4 my-6 px-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <strong className="text-white">Application Notice:</strong> JobeeLanka is an independent discovery and referral directory. Unless a listing states otherwise, your application, CV, WhatsApp message, or email is delivered directly to the hiring employer, licensed agency, or original source. We never charge candidates placement fees and do not guarantee hiring outcomes.
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 JobeeLanka (https://www.jobeelanka.com). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Designed for Sri Lankan Talent</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-1" />
            <span>Island-wide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

