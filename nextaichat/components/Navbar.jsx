"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, ArrowRight, Languages, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Compare (vs Character.ai)", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* STICKY TOP NAVBAR HEADER */}
      <header className="sticky top-0 left-0 right-0 z-[100] h-20 sm:h-24 border-b border-purple-500/20 px-4 sm:px-6 lg:px-10 bg-neutral-950/95 backdrop-blur-2xl shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-full">
        <div className="max-w-[1440px] mx-auto w-full h-full flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8">
            {/* Mobile Hamburger Drawer Toggle (Animated 3 Line to X Morph) */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 z-50 overflow-hidden"
              aria-label="Toggle Navigation Menu"
            >
              <div className={`transition-transform duration-300 ease-in-out transform ${mobileMenuOpen ? "rotate-90 scale-105" : "rotate-0 scale-100"}`}>
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-purple-400" />
                ) : (
                  <Menu className="w-5 h-5 text-neutral-300" />
                )}
              </div>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
              <div className="relative flex items-center">
                <Image
                  src="/logo-landspace.png"
                  alt="NextAiChat Brand Logo"
                  width={360}
                  height={100}
                  priority
                  className="h-14 sm:h-20 md:h-20 w-auto object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400/30"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t(link.name)}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right CTA & Desktop Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Desktop English / Hinglish Toggle Switcher */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold bg-neutral-900/90 hover:bg-neutral-800 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Switch Language (English / Hinglish)"
            >
              <Languages className="w-3.5 h-3.5 text-purple-400" />
              <span>{language === "en" ? "EN | Hinglish" : "Hinglish | EN"}</span>
            </button>

            <Link
              href="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 transition-all border border-neutral-800 hover:border-cyan-500/40"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>vs Character.ai</span>
            </Link>

            <a
              href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(147,51,234,0.7)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
              <span className="sm:hidden">Launch</span>
              <span className="hidden sm:inline">{t("Launch App")}</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* HEADER SPACER TO PREVENT LAYOUT OVERLAP */}
      <div className="h-20 sm:h-24 w-full shrink-0" />

      {/* MOBILE DRAWER OVERLAY & DROPDOWN MENU WITH OPEN/CLOSE ANIMATION */}
      <div
        className={`md:hidden fixed top-20 sm:top-24 left-0 right-0 bg-[#090d16]/98 border-b border-purple-500/30 p-5 space-y-4 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[100] transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-2.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between active:scale-98 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/60 text-white shadow-md"
                    : "bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-purple-500/40"
                }`}
              >
                <span>{t(link.name)}</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </Link>
            );
          })}

          {/* Mobile Language Switcher Section */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2.5 mt-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-purple-200">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-purple-400" />
                <span>Language / Bhasha</span>
              </div>
              <span className="text-[10px] text-purple-300 font-mono px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-700">
                {language.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (language !== "en") toggleLanguage();
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                  language === "en"
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-300/50"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>English</span>
              </button>

              <button
                onClick={() => {
                  if (language !== "hinglish") toggleLanguage();
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                  language === "hinglish"
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-300/50"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                <span>Hinglish</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
