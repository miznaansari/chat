"use client";

import Link from "next/link";
import ProductShowcase from "@/components/ProductShowcase";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Zap,
  BookOpen,
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Calendar,
  Sliders,
  RefreshCw,
  Users,
} from "lucide-react";

export default function HomeClient({ blogs, samplePersonas, appUrl }) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col relative selection:bg-purple-500 selection:text-white w-full max-w-full overflow-x-clip">
      {/* HERO SECTION (FULL WIDE CONTAINER) */}
      <section className="relative z-10 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center py-6 lg:py-10 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto text-center space-y-6">
        
        {/* Top Why We are Best Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-extrabold tracking-wide shadow-[0_0_20px_rgba(147,51,234,0.3)]">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>{t("The #1 AI Roleplay Engine • Built Different")}</span>
        </div>

        {/* Headline */}
        <div className="space-y-4 w-full max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
            {t("AI Roleplay for")}{" "}
            <span className="antigravity-glow-text">{t("Study & Stories")}</span>
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t("Zero-latency AI tutors for exam prep, language practice & multi-character storytelling.")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_30px_rgba(147,51,234,0.4)] flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(147,51,234,0.7)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span className="sm:hidden">Launch</span>
              <span className="hidden sm:inline">{t("Launch App Free")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/compare"
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-300 hover:scale-105 backdrop-blur-xl shadow-md"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>vs Character.ai</span>
            </Link>
          </div>
        </div>

        {/* WHY BEST / KEY ADVANTAGES GRID (4 CORE DIFFERENTIATOR CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-[1440px] w-full pt-3 text-left">
          {/* Advantage 1 */}
          <div className="p-4 sm:p-5 rounded-2xl cyber-glass-card border border-purple-500/30 space-y-2 hover:border-purple-400/60 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-300">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">{t("Auto Speaker Engine")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {t("AI automatically manages turn-taking & complete speaker thoughts dynamically in multi-character rooms.")}
            </p>
          </div>

          {/* Advantage 2 */}
          <div className="p-4 sm:p-5 rounded-2xl cyber-glass-card border border-cyan-500/30 space-y-2 hover:border-cyan-400/60 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                <EyeOff className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">{t("Smart Context Exclude")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {t("1-click to toggle which message is included in active memory. Exclude wrong responses instantly to keep AI memory pristine.")}
            </p>
          </div>

          {/* Advantage 3 */}
          <div className="p-4 sm:p-5 rounded-2xl cyber-glass-card border border-pink-500/30 space-y-2 hover:border-pink-400/60 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-950/80 border border-pink-700/60 text-pink-300">
                <Sliders className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">{t("Custom Response Length")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {t("Set exact response length: Very Short, Short, Normal, or Detailed for fast quizzes vs story immersion.")}
            </p>
          </div>

          {/* Advantage 4 */}
          <div className="p-4 sm:p-5 rounded-2xl cyber-glass-card border border-amber-500/30 space-y-2 hover:border-amber-400/60 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-300">
                <RefreshCw className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">{t("Rephrase & Polish Magic")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {t("Rephrase, polish grammar, or enhance character prompts in 1-click to transform your roleplay experience.")}
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SHOWCASE */}
      <ProductShowcase />

      {/* FEATURE CARDS */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t("Built for")}{" "}
            <span className="antigravity-gradient-text">{t("Study & Stories")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-glass-card p-6 rounded-2xl space-y-4 border-purple-500/30">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">{t("Study & Exam Tutors")}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {t("AI tutors for exam prep, quizzes, formulas & foreign language practice.")}
              </p>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium border-t border-white/10 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Oral Exam Quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Language Drills</span>
              </li>
            </ul>
          </div>

          <div className="cyber-glass-card p-6 rounded-2xl space-y-4 border-pink-500/30">
            <div className="w-10 h-10 rounded-xl bg-pink-950 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">{t("Multi-Character Rooms")}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {t("Engage multiple active AI personas together in a single dynamic room.")}
              </p>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium border-t border-white/10 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Persona Dynamics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Snippet Bank</span>
              </li>
            </ul>
          </div>

          <div className="cyber-glass-card p-6 rounded-2xl space-y-4 border-cyan-500/30">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-white">{t("Smart Turn Engine")}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {t("Gemini AI determines the optimal speaker turn automatically in real time.")}
              </p>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium border-t border-white/10 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Queue Delay</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Contextual Auto-Select</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PERSONAS GALLERY */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t("Active")}{" "}
            <span className="antigravity-gradient-text">{t("Roleplay Personas")}</span>
          </h2>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>{t("All Personas")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {samplePersonas.map((persona, idx) => (
            <div
              key={idx}
              className="cyber-glass-card p-5 rounded-2xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-1.5 rounded-xl bg-neutral-900 border border-white/10 inline-block">
                    {persona.avatar}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${persona.badgeColor}`}>
                    {persona.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white truncate">{persona.name}</h3>
                  <p className="text-xs text-purple-300 font-medium">{persona.role}</p>
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-2">
                  {persona.desc}
                </p>
              </div>

              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-purple-950 border border-neutral-800 hover:border-purple-600/50 text-xs sm:text-sm text-center font-semibold text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer mt-2"
              >
                <span>{t("Start Chat")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARE BANNER */}
      <section className="relative z-10 py-10 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto">
        <div className="p-7 sm:p-9 rounded-2xl bg-gradient-to-r from-purple-950/90 via-neutral-950/90 to-cyan-950/90 border border-purple-500/40 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_0_40px_rgba(147,51,234,0.25)]">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {t("NextAiChat vs Character.ai")}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-normal">
              {t("Dynamic turn engine vs manual 1-by-1 prompts.")}
            </p>
          </div>

          <Link
            href="/compare"
            className="px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg hover:scale-105"
          >
            <span>{t("View Comparison")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* DB BLOG ARTICLES */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t("Latest")}{" "}
            <span className="antigravity-gradient-text">{t("Guides")}</span>
          </h2>
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>{t("All Articles")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="p-6 rounded-2xl cyber-glass-card-static text-center space-y-2">
            <p className="text-xs sm:text-sm text-neutral-400">
              No articles published yet. Visit the Admin Dashboard to add articles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group cyber-glass-card p-5 rounded-2xl flex flex-col justify-between border-white/10 space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono font-semibold">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>{blog.views} views</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                    {t("Read")} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
