"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Building2, ShieldCheck, Menu, X, Sun, Moon } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Synchronize theme with document & localStorage (default to light if unset)
  useEffect(() => {
    const saved = localStorage.getItem("jobeelanka-theme");
    const isDark = saved ? saved === "dark" : false;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jobeelanka-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jobeelanka-theme", "light");
    }
  };

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Jobee<span className="text-emerald-600 dark:text-emerald-400">Lanka</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[9px] font-bold text-slate-400 tracking-wider uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Directory
              </span>
            </div>
          </Link>

          {/* Public Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Find Jobs
            </Link>
            <Link href="/companies" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </Link>
            <Link href="/safety" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SLBFE Safety</span>
            </Link>
            <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              About
            </Link>
          </nav>

          {/* Directory Action & Desktop Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Global Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle site color theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <Link
              href="/jobs"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Browse 1,420+ Jobs</span>
            </Link>
          </div>

          {/* Mobile Actions: Theme Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle site color theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Find Jobs</span>
            </Link>

            <Link
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Companies Directory</span>
            </Link>

            <Link
              href="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SLBFE Safety & License Guide</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <span>About JobeeLanka</span>
            </Link>

            {/* Mobile Drawer Theme Toggle Item */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-400" />}
                  <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </div>
                <span className="text-xs text-slate-400 uppercase font-mono">
                  {isDarkMode ? "Theme: Dark" : "Theme: Light"}
                </span>
              </button>
            </div>

            <div className="pt-3">
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all min-h-[44px]"
              >
                <Briefcase className="w-4 h-4" />
                <span>Browse 1,420+ Openings</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay on mobile when menu open */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
};
