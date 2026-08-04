"use client";

import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { Shield, Lock, Eye, FileText, ArrowLeft, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Privacy & Security</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Last updated: August 2026 • Effective immediately
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-md shadow-xl text-neutral-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use NextAiChat, we collect account information such as your name, email address, password hash, and optional user profile personas ("Me Personas"). We also store roleplay session logs and API usage counts to enforce daily credit limits and deliver personalized AI character responses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              2. How We Use Your Data
            </h2>
            <p>
              Your data is strictly utilized to provide and improve your AI roleplaying experience:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-2">
              <li>Authenticating your account and maintaining secure sessions</li>
              <li>Personalizing character dialogues according to your active "Me Persona"</li>
              <li>Tracking daily API credit consumption</li>
              <li>Enabling customized multi-character roleplay orchestration</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              3. Data Privacy & Third-Party Services
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. AI prompt inputs are processed via official Google Gemini API endpoints solely for context processing and message completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              4. Data Retention & Control
            </h2>
            <p>
              You retain full control over your content. You can edit or delete your saved "Me Personas" and chat sessions at any time directly through the app control panel.
            </p>
          </section>

          <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>Have questions about our Privacy Policy?</span>
            <Link
              href="/contact"
              className="text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
            >
              Contact Administrator →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
