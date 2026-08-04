"use client";

import Link from "next/link";
import Image from "next/image";
import packageInfo from "@/package.json";
import { Sparkles, ShieldCheck, FileText, LayoutDashboard, Cpu, Radio, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="w-full max-w-full overflow-hidden border-t border-purple-500/20 bg-neutral-950/90 backdrop-blur-2xl py-12 px-4 md:px-8 relative z-10 shrink-0 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 relative z-10">
        {/* Col 1: Brand Info with logo-landspace.png */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo-landspace.png"
              alt="NextAiChat Brand Logo"
              width={280}
              height={70}
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            />
          </Link>
          <p className="text-sm text-neutral-400 leading-relaxed">
            {t("The #1 AI Roleplay Matrix engine designed for study prep, educational tutors, creative worldbuilding, and multi-character storytelling.")}
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono pt-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{t("AI CORE STATUS: NOMINAL")}</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3.5">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-purple-400">
            <Cpu className="w-4 h-4" />
            <span>{t("Explore Matrix")}</span>
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-300">
            <li>
              <Link href="/" className="hover:text-purple-300 transition-colors">
                {t("Home Matrix")}
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-cyan-300 transition-colors">
                NextAiChat vs Character.ai
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-300 transition-colors">
                {t("Blog Insights & Guides")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Management */}
        <div className="space-y-3.5">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-cyan-400">
            <LayoutDashboard className="w-4 h-4" />
            <span>{t("Console & App")}</span>
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-300">
            <li>
              <a
                href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2 text-cyan-300 font-semibold"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>{t("Launch Roleplay Engine")}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal Links */}
        <div className="space-y-3.5">
          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 text-pink-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("Privacy & Protocol")}</span>
          </h3>
          <ul className="space-y-2.5 text-sm text-neutral-300">
            <li>
              <Link href="/privacy" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>{t("Privacy Protocol")}</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-300 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{t("Terms of Service")}</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-pink-300 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <span>{t("Contact Support Desk")}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-400 gap-4 relative z-10">
        <div>
          © {new Date().getFullYear()} NextAiChat Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          <span>NextAiChat v{packageInfo.version}</span>
        </div>
      </div>
    </footer>
  );
}
