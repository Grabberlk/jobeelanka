"use client";

import React from "react";
import { MessageCircle, ShieldCheck, ArrowUpRight } from "lucide-react";

export const WhatsAppQuickApplyCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Instant Recruiter Direct
          </span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Only</span>
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          Connect Directly via Verified WhatsApp
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          Skip recruiter inboxes for high-urgency roles. Message verified hiring managers with pre-formatted role intents.
        </p>
      </div>

      <a
        href="https://wa.me/94773445566?text=Hello%20JobeeLanka!%20I%20am%20interested%20in%20verified%20opportunities%20in%20Sri%20Lanka."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/15"
      >
        <span className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Launch WhatsApp Chat</span>
        </span>
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
};

