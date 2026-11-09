"use client";

import React, { Suspense } from "react";
import { JobDirectory } from "@/components/jobs/JobDirectory";

export default function JobsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-semibold">Loading Verified Vacancies...</div>}>
        <JobDirectory showHeroBanner={true} pageSize={18} />
      </Suspense>
    </div>
  );
}
