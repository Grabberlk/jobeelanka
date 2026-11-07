"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: string; // e.g. "md:col-span-8"
  rowSpan?: string; // e.g. "md:row-span-2"
  glass?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className,
  colSpan = "md:col-span-4",
  rowSpan = "md:row-span-1",
  glass = false,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 transition-all duration-300 ease-out overflow-hidden",
        "border border-slate-200/90 dark:border-slate-800/90",
        "hover:scale-[1.012] hover:shadow-bento-hover hover:border-emerald-500/40 active:scale-[0.99]",
        glass
          ? "bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-bento"
          : "bg-white dark:bg-slate-900 shadow-bento",
        colSpan,
        rowSpan,
        className
      )}
    >
      {children}
    </div>
  );
};
