"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Terminal, ShieldCheck, Download } from "lucide-react";

export default function SwaggerDocsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Swagger UI CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css";
    document.head.appendChild(link);

    // Load Swagger UI Bundle
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.SwaggerUIBundle) {
        // @ts-ignore
        window.SwaggerUIBundle({
          url: "/api/swagger.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [
            // @ts-ignore
            window.SwaggerUIBundle.presets.apis,
            // @ts-ignore
            window.SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          layout: "BaseLayout",
        });
        setLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                REST API & OpenAPI 3.0 Documentation
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Explore and test live REST API endpoints for JobeeLanka. Certified adapters for ITPro.lk, encrypted PDPA application submissions, and structured job search.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/swagger.json"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Raw JSON Spec</span>
            </a>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>v2.0.0 Live</span>
            </div>
          </div>
        </div>

        {/* Swagger UI Mount Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-bento border border-slate-200 min-h-[600px]">
          {!loaded && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold">Initializing Interactive Swagger UI...</p>
            </div>
          )}
          <div id="swagger-ui" />
        </div>
      </div>
    </div>
  );
}

