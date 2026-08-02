import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import ProductShowcase from "@/components/ProductShowcase";
import {
  Sparkles,
  Zap,
  BookOpen,
  Gamepad2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  Eye,
  Calendar,
  HelpCircle,
  Cpu,
  Layers,
  Bot,
  User,
  Activity,
  Code,
  Flame,
  MessageSquare,
} from "lucide-react";

export const revalidate = 0; // Dynamic DB fetch

export const metadata = {
  title: "NextAiChat - #1 AI Roleplay Platform for Study & Entertainment",
  description:
    "Discover NextAiChat, the premier AI Roleplay platform designed for interactive study simulations, exam prep tutors, language practice, and multi-character storytelling with dynamic speaker turns.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let blogs = [];
  try {
    blogs = await prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Home page blog fetch error:", e);
  }

  // FAQ Schema.org JSON-LD for Google Rich Search Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is NextAiChat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat is an advanced AI roleplay platform built for educational study simulations, tutor conversations, language practice, and multi-character entertainment stories.",
        },
      },
      {
        "@type": "Question",
        name: "How does NextAiChat compare to Character.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat features a Dynamic Speaker Turn Engine powered by Gemini AI, zero response latency, dedicated study and exam prep personas, private encrypted sessions, and custom snippet libraries.",
        },
      },
      {
        "@type": "Question",
        name: "Is NextAiChat suitable for study and exam prep?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, NextAiChat allows students to create subject-specific AI tutors for oral exam prep, concept quizzes, historical roleplays, and foreign language conversation practice.",
        },
      },
    ],
  };

  const samplePersonas = [
    {
      name: "Quantum Physics Tutor",
      role: "Study & Prep",
      tag: "Education",
      desc: "Simulates oral physics exams, solves formulas, and explains relativity step-by-step.",
      color: "from-purple-600 to-indigo-600",
      badgeColor: "bg-purple-950 border-purple-700 text-purple-300",
      avatar: "⚛️",
    },
    {
      name: "IELTS Speaking Coach",
      role: "Language Practice",
      tag: "Productivity",
      desc: "Conducts live Band 9 speaking test simulations with real-time feedback.",
      color: "from-cyan-600 to-blue-600",
      badgeColor: "bg-cyan-950 border-cyan-700 text-cyan-300",
      avatar: "🗣️",
    },
    {
      name: "Cyberpunk RPG Director",
      role: "Multi-Persona Story",
      tag: "Entertainment",
      desc: "Drives intense branch-choice story worlds with multi-character dialogues.",
      color: "from-pink-600 to-rose-600",
      badgeColor: "bg-pink-950 border-pink-700 text-pink-300",
      avatar: "⚡",
    },
    {
      name: "Full-Stack Code Mentor",
      role: "Coding & AI",
      tag: "Developer",
      desc: "Debugs complex code, optimizes architecture, and conducts technical mock interviews.",
      color: "from-emerald-600 to-teal-600",
      badgeColor: "bg-emerald-950 border-emerald-700 text-emerald-300",
      avatar: "💻",
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Inject FAQ JSON-LD Structured Data */}
      <JsonLd data={faqSchema} />

      {/* Futuristic Background Ambient Glow Orbs */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-[180px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed top-1/3 left-[-150px] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-50 z-0" />

      {/* ================= HERO SECTION (100dvh VIEWPORT FIT) ================= */}
      <section className="relative z-10 min-h-[calc(100dvh-5rem)] flex flex-col justify-between items-center py-6 sm:py-10 lg:py-14 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto text-center space-y-6">
        
        {/* Top Logo Presentation & Cyber Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-3xl bg-neutral-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-float-slow inline-block">
            <Image
              src="/logo-landspace.png"
              alt="NextAiChat Official Brand Logo"
              width={260}
              height={65}
              priority
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-wide shadow-[0_0_30px_rgba(147,51,234,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span className="font-semibold">ANTIGRAVITY DYNAMIC TURN MATRIX v4.0</span>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Hero Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Next-Gen AI Roleplay Platform for{" "}
            <span className="antigravity-glow-text">
              Study & Entertainment
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Simulate interactive study scenarios with dedicated AI tutors, practice foreign languages, or immerse in multi-character story dimensions — <strong className="text-white font-bold">NextAiChat</strong> delivers zero-latency dynamic turn conversations.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm sm:text-base shadow-[0_0_40px_rgba(147,51,234,0.5)] flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(147,51,234,0.8)] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
              <span>Launch Roleplay Matrix</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/compare"
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all duration-300 hover:scale-105 backdrop-blur-xl shadow-lg"
            >
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Compare vs Character.ai</span>
            </Link>
          </div>
        </div>

        {/* Holographic Interactive Live Simulator Teaser Card */}
        <div className="w-full max-w-3xl mx-auto text-left">
          <div className="p-4 sm:p-6 rounded-3xl bg-neutral-950/80 border border-purple-500/30 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-3 relative overflow-hidden group">
            {/* Top Bar of Simulator */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-[11px] sm:text-xs font-mono">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>ACTIVE SIMULATION: MULTI-CHARACTER STUDY & ROLEPLAY</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DYNAMIC ENGINE: ACTIVE</span>
              </div>
            </div>

            {/* Chat Messages Preview */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              {/* Message 1 */}
              <div className="flex items-start gap-3 bg-neutral-900/60 p-2.5 sm:p-3 rounded-2xl border border-white/5">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-900/80 border border-purple-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                  🎓
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-purple-300 text-xs flex items-center gap-2">
                    <span>Physics Tutor AI</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-950 text-[10px] text-purple-400 border border-purple-800">Study Persona</span>
                  </div>
                  <p className="text-neutral-200 leading-snug">
                    "Welcome back! Ready for your Quantum Physics oral exam simulation? Let's test wave-particle duality next."
                  </p>
                </div>
              </div>

              {/* Message 2 */}
              <div className="flex items-start gap-3 bg-indigo-950/40 p-2.5 sm:p-3 rounded-2xl border border-indigo-500/20 ml-4 sm:ml-8">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cyan-900/80 border border-cyan-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                  🧠
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-cyan-300 text-xs flex items-center gap-2">
                    <span>Exam Coach AI</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] text-cyan-400 border border-cyan-800">Turn Engine Auto-Select</span>
                  </div>
                  <p className="text-neutral-300 leading-snug">
                    "Tip: Remember to state De Broglie equation $\lambda = h/p$ during your answer for max exam points!"
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-white/5">
              <span className="flex items-center gap-1 text-purple-400">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" /> Zero Latency Response Matrix
              </span>
              <span className="text-neutral-500">Gemini 2.0 Flash Engine</span>
            </div>
          </div>
        </div>

        {/* Hero Holographic Stats & Scroll Indicator */}
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl cyber-glass-card space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-purple-300 font-mono">Dynamic Turn Engine</div>
            </div>
            <div className="p-3.5 rounded-2xl cyber-glass-card space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-purple-400">0 ms</div>
              <div className="text-[11px] text-cyan-300 font-mono">Turn Response Latency</div>
            </div>
            <div className="p-3.5 rounded-2xl cyber-glass-card space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-cyan-400">Multi</div>
              <div className="text-[11px] text-indigo-300 font-mono">Character Rooms</div>
            </div>
            <div className="p-3.5 rounded-2xl cyber-glass-card space-y-0.5">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">Vault</div>
              <div className="text-[11px] text-emerald-300 font-mono">Encrypted Sessions</div>
            </div>
          </div>

          {/* Animated Scroll Down Indicator */}
          <div className="flex flex-col items-center gap-1 text-neutral-500 animate-bounce pt-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400/80">SCROLL TO EXPLORE MATRIX</span>
            <div className="w-5 h-7 rounded-full border border-purple-500/40 flex items-start justify-center p-1">
              <div className="w-1.5 h-2 rounded-full bg-purple-400 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE PRODUCT SHOWCASE ================= */}
      <ProductShowcase />

      {/* ================= FEATURE CORE SECTION ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Why Students & Creators Choose <span className="antigravity-gradient-text">NextAiChat</span>
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Architected specifically for high-efficiency study prep, language tutoring, and immersive story dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Study & Education */}
          <div className="cyber-glass-card p-7 rounded-3xl space-y-5 border-purple-500/30">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-900 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Study & Educational Tutors
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Build subject-tailored AI tutors for exam prep, concept quizzes, historical debates, or foreign language practice.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-neutral-300 font-medium border-t border-white/10 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive Exam Prep & Quizzes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Foreign Language Fluency Drills</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Multi-Character Story Worlds */}
          <div className="cyber-glass-card p-7 rounded-3xl space-y-5 border-pink-500/30">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-900 to-rose-900 border border-pink-500/40 flex items-center justify-center text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Multi-Character Entertainment
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Step into parallel story worlds where multiple active AI personas engage together in a single dynamic room.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-neutral-300 font-medium border-t border-white/10 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Persona Room Dynamics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Character Snippet Library</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Dynamic Turn Engine */}
          <div className="cyber-glass-card p-7 rounded-3xl space-y-5 border-cyan-500/30">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-900 to-blue-900 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Smart Turn & Latency Engine
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Gemini AI evaluates active context to determine the best speaker turn in real time without rigid manual clicks.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-neutral-300 font-medium border-t border-white/10 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Queue Wait Latency</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Contextual Speaker Selection</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= PERSONAS GALLERY SHOWCASE ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono mb-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>POPULAR AI PERSONAS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Explore Active <span className="antigravity-gradient-text">Roleplay Personas</span>
            </h2>
          </div>

          <a
            href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          >
            <span>Launch All Personas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {samplePersonas.map((persona, idx) => (
            <div
              key={idx}
              className="cyber-glass-card p-5 rounded-3xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-neutral-900 border border-white/10 inline-block">
                    {persona.avatar}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-bold ${persona.badgeColor}`}>
                    {persona.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{persona.name}</h3>
                  <p className="text-[11px] text-purple-300 font-medium">{persona.role}</p>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {persona.desc}
                </p>
              </div>

              <a
                href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-purple-950 border border-neutral-800 hover:border-purple-600/50 text-xs text-center font-semibold text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-1"
              >
                <span>Start Chat</span>
                <ArrowRight className="w-3 h-3 text-purple-400" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMPARE BANNER TEASER ================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/90 via-neutral-950/90 to-cyan-950/90 border border-purple-500/40 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_60px_rgba(147,51,234,0.3)]">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>PLATFORM COMPARISON MATRIX</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              NextAiChat vs Character.ai
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              See why students, researchers, and creative writers are switching to NextAiChat's dynamic turn engine.
            </p>
          </div>

          <Link
            href="/compare"
            className="px-7 py-3.5 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-200 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-xl hover:scale-105"
          >
            <span>View Comparison Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================= DB BLOG POSTS SHOWCASE ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-8 w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-mono mb-2">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>DATABASE INSIGHTS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Latest Articles & <span className="antigravity-gradient-text">Guides</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="p-8 rounded-3xl cyber-glass-card-static text-center space-y-3">
            <p className="text-xs text-neutral-400">
              No blog posts published yet. Visit the Admin Dashboard to add database-level blog articles!
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950 border border-purple-700 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-colors"
            >
              <span>Go to Admin Dashboard</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group cyber-glass-card p-6 rounded-3xl flex flex-col justify-between border-white/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-mono font-semibold">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{blog.views} views</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 mt-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="font-semibold text-purple-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
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
