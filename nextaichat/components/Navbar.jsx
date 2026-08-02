"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, BookOpen, Shield, LayoutDashboard, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Compare (vs Character.ai)", href: "/compare" },
    { name: "Blog", href: "/blog" },
    { name: "Admin Dashboard", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-purple-500/20 px-4 md:px-8 flex items-center justify-between bg-neutral-950/80 backdrop-blur-xl shrink-0 shadow-lg">
      <div className="flex items-center gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-current text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">
            NextAi<span className="text-purple-400">Chat</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-950/80 border border-purple-600/60 text-purple-300 shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right CTA Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/compare"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors border border-neutral-800"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>vs Character.ai</span>
        </Link>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
        >
          <span>Launch App</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
