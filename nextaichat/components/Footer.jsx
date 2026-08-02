import Link from "next/link";
import { Sparkles, ShieldCheck, FileText, Compass, BookOpen, LayoutDashboard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl py-10 px-4 md:px-8 relative z-20 shrink-0 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Brand Info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current text-white" />
            </div>
            <span className="text-base font-extrabold text-white">
              NextAi<span className="text-purple-400">Chat</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The #1 AI Roleplay Platform designed for study, educational simulations, entertainment, and interactive storytelling.
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Explore
          </h3>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>
              <Link href="/" className="hover:text-purple-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/compare" className="hover:text-cyan-400 transition-colors">
                NextAiChat vs Character.ai
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-400 transition-colors">
                Blog Articles
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Management */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Platform & Admin
          </h3>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>
              <Link href="/admin" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-3 h-3 text-purple-400" />
                <span>Admin Blog Dashboard</span>
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Launch Roleplay Chat App
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal Links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Legal & Privacy
          </h3>
          <ul className="space-y-1.5 text-xs text-neutral-400">
            <li>
              <Link href="/privacy" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Terms of Service</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} NextAiChat Inc. All rights reserved. Built with Antigravity Cyber Aesthetics.
      </div>
    </footer>
  );
}
