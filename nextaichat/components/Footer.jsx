import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, FileText, Compass, BookOpen, LayoutDashboard, Cpu, Radio } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-500/20 bg-neutral-950/90 backdrop-blur-2xl py-12 px-4 md:px-8 relative z-20 shrink-0 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 relative z-10">
        {/* Col 1: Brand Info with logo-landspace.png */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo-landspace.png"
              alt="NextAiChat Brand Logo"
              width={180}
              height={45}
              className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            />
          </Link>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The #1 AI Roleplay Matrix engine designed for study prep, educational tutors, creative worldbuilding, and multi-character storytelling.
          </p>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AI CORE STATUS: NOMINAL</span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 text-purple-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Explore Matrix</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <Link href="/" className="hover:text-purple-300 transition-colors">
                Home Matrix
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-cyan-300 transition-colors">
                NextAiChat vs Character.ai
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-300 transition-colors">
                Blog Insights & Guides
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Management */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 text-cyan-400">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Console & App</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <Link href="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Content Portal</span>
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5 text-cyan-300 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Launch Roleplay Engine</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 text-pink-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Protocol</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <Link href="/privacy" className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Privacy Protocol</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Terms of Service</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 relative z-10">
        <div>
          © {new Date().getFullYear()} NextAiChat Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          <span>Antigravity Dark Mode Engine v4.0</span>
        </div>
      </div>
    </footer>
  );
}

