"use client";

import { useState } from "react";
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
  EyeOff,
  Sliders,
  RefreshCw,
  Star,
  Users,
  SlidersHorizontal
} from "lucide-react";

export default function HomeClient({ blogs = [], characters = [], appUrl }) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");

  // Derive Dynamic Categories from Database Characters
  const dynamicCategories = ["All", ...Array.from(new Set(characters.map((c) => c.category).filter(Boolean)))];

  // Filter Characters by Dynamic Category
  const filteredCharacters = activeCategory === "All"
    ? characters
    : characters.filter((c) => c.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col relative selection:bg-purple-500 selection:text-white w-full max-w-full overflow-x-clip">
      
      {/* HERO SECTION */}
      <section className="relative z-10 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center py-6 lg:py-10 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto text-center space-y-6">
        
        {/* Top Badge */}
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

        {/* ADVANTAGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-[1440px] w-full pt-3 text-left">
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

          <div className="p-4 sm:p-5 rounded-2xl cyber-glass-card border border-cyan-500/30 space-y-2 hover:border-cyan-400/60 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                <EyeOff className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">{t("Smart Context Exclude")}</h3>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {t("1-click to toggle which message is included in active memory. Exclude wrong responses instantly.")}
            </p>
          </div>

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

      {/* DYNAMIC PERSONAS GALLERY WITH CATEGORY FILTERS */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t("Active")}{" "}
              <span className="antigravity-gradient-text">{t("Showcase AI Characters")}</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Explore dynamic multi-character roleplay tutors, Hinglish squads, and career mentors.
            </p>
          </div>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors shrink-0"
          >
            <span>{t("Launch All Characters")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs font-medium">
          <span className="text-neutral-400 text-xs font-mono mr-1 flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Categories:
          </span>
          {dynamicCategories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs font-bold ${
                  isActive
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400/40"
                    : "bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Character Showcase Grid with Touch-Pan-X Mobile Slider */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {filteredCharacters.map((char) => {
            const parsedPersonas = Array.isArray(char.characters) ? char.characters : [];
            return (
              <div key={char.id} className="w-[180px] sm:w-auto shrink-0 snap-start flex flex-col">
                <div
                  onClick={() => setSelectedCharPreview(char)}
                  className="cyber-glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between border border-neutral-800/80 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(147,51,234,0.2)] group h-full cursor-pointer"
                >
                  <div className="space-y-3.5">
                    {/* Top Avatar & Badge Bar */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800 relative shadow-md">
                        <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${char.badgeBg || "bg-purple-950 border border-purple-700 text-purple-300"}`}>
                            {char.badge || "AI Persona"}
                          </span>
                          
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{char.rating || "4.9"}</span>
                          </div>
                        </div>

                        <h3 className="text-base font-extrabold text-white truncate mt-1 group-hover:text-purple-300 transition-colors">
                          {char.name}
                        </h3>
                        <p className="text-xs text-purple-300 font-medium truncate">{char.tagline}</p>
                      </div>
                    </div>

                    {/* Story Scenario */}
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/80">
                      {char.story}
                    </p>

                    {/* Multi-Speaker Personas Badges */}
                    {parsedPersonas.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-purple-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>Multi-Speaker Room ({parsedPersonas.length}):</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {parsedPersonas.map((p, idx) => (
                            <span key={idx} className="text-[10px] px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-purple-200 font-mono font-semibold">
                              🗣️ {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCharPreview(char);
                    }}
                    className="w-full py-3 rounded-2xl bg-neutral-900 hover:bg-purple-600 border border-neutral-800 hover:border-purple-400 text-xs sm:text-sm text-center font-extrabold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
                  >
                    <span>Preview Story & Personas</span>
                    <ArrowRight className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CHARACTER PREVIEW MODAL */}
        {selectedCharPreview && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-3.5 sm:p-4 overflow-hidden">
            <div className="relative w-full max-w-xl bg-[#090d16] border border-purple-500/40 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(147,51,234,0.4)] my-auto flex flex-col h-[calc(100dvh-28px)] sm:h-auto sm:max-h-[85vh] animate-fadeIn text-white font-sans">
              
              {/* Modal Header Bar */}
              <div className="relative p-4 sm:p-5 bg-neutral-950/90 border-b border-neutral-800/80 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCharPreview(null)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer z-10"
                >
                  <span className="text-sm font-bold">✕</span>
                </button>

                <div className="flex items-start gap-3 pr-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-neutral-900 border border-purple-500/40 shrink-0 shadow-lg">
                    <img src={selectedCharPreview.avatar} alt={selectedCharPreview.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                        {selectedCharPreview.name}
                      </h3>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 shrink-0">
                        {selectedCharPreview.category || "AI Persona"}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-purple-300 font-medium truncate">{selectedCharPreview.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
                
                {/* Storyline Scenario */}
                <div className="space-y-2">
                  <h4 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span>Roleplay Storyline & Scenario</span>
                  </h4>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-xs sm:text-sm text-neutral-200 leading-relaxed shadow-inner">
                    {selectedCharPreview.story}
                  </div>
                </div>

                {/* Personas Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Multi-Speaker Personas ({Array.isArray(selectedCharPreview.characters) ? selectedCharPreview.characters.length : 1})</span>
                  </h4>

                  <div className="space-y-2">
                    {(Array.isArray(selectedCharPreview.characters) && selectedCharPreview.characters.length > 0
                      ? selectedCharPreview.characters
                      : [{ name: selectedCharPreview.name, persona: selectedCharPreview.tagline }]
                    ).map((p, idx) => (
                      <div key={idx} className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                            <span>🗣️</span>
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[9px] font-mono text-neutral-500">Speaker #{idx + 1}</span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {p.persona || p.personality || "Interactive character persona."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Fixed Footer Action Bar */}
              <div className="p-4 sm:px-6 sm:py-4 bg-neutral-950/95 border-t border-neutral-800/80 flex items-center justify-between gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCharPreview(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer border border-neutral-800 shrink-0"
                >
                  Cancel
                </button>

                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wide whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>START ROLEPLAY CHAT</span>
                </a>
              </div>
            </div>
          </div>
        )}
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

      {/* BLOG ARTICLES */}
      {blogs.length > 0 && (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="cyber-glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border-neutral-800 hover:border-purple-500/50 transition-all duration-300"
              >
                {b.coverImage && (
                  <div className="h-44 w-full overflow-hidden bg-neutral-950 relative">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-500/30">
                      {b.category}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span>{b.author}</span>
                    <span className="text-purple-400 font-bold flex items-center gap-1">
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
