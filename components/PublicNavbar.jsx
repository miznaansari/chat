"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X, Shield, FileText, Mail } from "lucide-react";

export default function PublicNavbar({ activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="shrink-0 z-50 backdrop-blur-xl bg-neutral-950/85 border-b border-purple-500/20 px-4 md:px-8 py-2 sticky top-0 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between relative h-16">

        {/* Left: Back to Login Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white transition-colors group px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-purple-500/40 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-purple-400" />
            <span className="hidden sm:inline">Back to Login</span>
            <span className="sm:hidden">Login</span>
          </Link>
        </div>

        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          <Link href="/" className="inline-block">
            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-20 sm:h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(147,51,234,0.4)]"
            />
          </Link>
        </div>

        {/* Right: Desktop Nav Links & Mobile Hamburger Drawer Toggle */}
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <Link
              href="/privacy"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activePage === "privacy"
                ? "bg-purple-950/90 border border-purple-500/50 text-purple-200 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Privacy Policy</span>
            </Link>

            <Link
              href="/terms"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activePage === "terms"
                ? "bg-purple-950/90 border border-purple-500/50 text-purple-200 shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Terms of Service</span>
            </Link>

            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activePage === "contact"
                ? "bg-purple-950/90 border border-purple-500/50 text-purple-200 shadow-sm"
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>
          </nav>

          {/* Mobile Hamburger 3-Line Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5 text-neutral-200" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 px-2 border-t border-neutral-800/80 mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${activePage === "privacy"
              ? "bg-purple-950/90 border border-purple-500/50 text-purple-200"
              : "bg-neutral-900/90 text-neutral-300 hover:bg-neutral-800"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Privacy Policy</span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">View Policy</span>
          </Link>

          <Link
            href="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${activePage === "terms"
              ? "bg-purple-950/90 border border-purple-500/50 text-purple-200"
              : "bg-neutral-900/90 text-neutral-300 hover:bg-neutral-800"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Terms of Service</span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">View Terms</span>
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-semibold transition-all ${activePage === "contact"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-neutral-900/90 text-neutral-300 hover:bg-neutral-800"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Contact Support</span>
            </div>
            <span className="text-[10px] text-purple-300 uppercase">Get Help</span>
          </Link>

          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 justify-center transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span>Return to Login</span>
          </Link>
        </div>
      )}
    </header>
  );
}
