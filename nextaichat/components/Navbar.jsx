"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Languages, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[500] w-full border-b border-purple-500/20 bg-[#030712]/95 backdrop-blur-2xl shrink-0 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-0 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer z-50 active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            <div className={`transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}>
              {mobileMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5 text-neutral-300" />}
            </div>
          </button>

          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo-landspace.png"
              alt="NextAiChat Brand Logo"
              width={220}
              height={60}
              priority
              className="h-20 sm:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            />
          </Link>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-medium transition-colors ${
                  isActive
                    ? "text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-purple-500 after:rounded-full"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {t(link.name)}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Language Switcher & Primary CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900/80 text-neutral-300 hover:text-white border border-neutral-800 hover:border-purple-500/40 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === "en" ? "EN | Hinglish" : "Hinglish | EN"}</span>
          </button>

          <a
            href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 cursor-pointer shrink-0"
          >
            <span className="sm:hidden">Launch</span>
            <span className="hidden sm:inline">Launch App</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Mobile Animated Drawer Dropdown with Ease-In-Out Smooth Transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-purple-500/20 bg-[#030712]/98 backdrop-blur-2xl px-5 space-y-3 ${
          mobileMenuOpen
            ? "max-h-[400px] py-4 opacity-100 translate-y-0"
            : "max-h-0 py-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between active:scale-98 ${
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80"
                }`}
              >
                <span>{t(link.name)}</span>
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </Link>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-neutral-900 border border-purple-500/30 text-purple-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-purple-400" />
                <span>Language: {language === "en" ? "English" : "Hinglish"}</span>
              </div>
              <span className="text-[10px] text-purple-400 font-mono uppercase font-extrabold">Switch</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
