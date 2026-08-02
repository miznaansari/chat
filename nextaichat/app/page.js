import Link from "next/link";
import prisma from "@/lib/prisma";
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
  Star,
  Users,
  Eye,
  Clock,
} from "lucide-react";

export const revalidate = 0; // Dynamic DB fetch

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

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto text-center space-y-8">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(147,51,234,0.3)] animate-pulse">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>NextAiChat Platform • AI Roleplay Matrix</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
          The Ultimate AI Roleplay Platform for{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Study & Entertainment
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Whether you want to simulate interactive study scenarios with AI tutors, practice foreign languages, or immerse yourself in multi-character entertainment roleplays — <strong className="text-white">NextAiChat</strong> provides zero-latency dynamic conversations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(147,51,234,0.4)] flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          >
            <span>Launch Roleplay Chat</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <Link
            href="/compare"
            className="px-7 py-3.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
          >
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>NextAiChat vs Character.ai</span>
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-xs text-neutral-400">Dynamic Turn Engine</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <div className="text-2xl font-black text-purple-400">Zero</div>
            <div className="text-xs text-neutral-400">Response Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <div className="text-2xl font-black text-cyan-400">Multi</div>
            <div className="text-xs text-neutral-400">Character Roleplays</div>
          </div>
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
            <div className="text-2xl font-black text-emerald-400">Encrypted</div>
            <div className="text-xs text-neutral-400">Private AI Context</div>
          </div>
        </div>
      </section>

      {/* ================= WHY WE ARE BEST SECTION ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why NextAiChat is the <span className="text-purple-400">Best Choice</span>
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
            Architected specifically for study productivity, educational simulations, and creative entertainment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Study & Education */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-purple-500/30 backdrop-blur-md space-y-4 hover:border-purple-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Study & Educational Scenarios
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Create AI tutors for subject prep, language practice, mock interviews, or historical debate simulations. Study faster with intelligent roleplay partners.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Interactive Exam Prep & Quizzing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Foreign Language Conversation Practice</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Entertainment & Fun */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-pink-500/30 backdrop-blur-md space-y-4 hover:border-pink-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-950/80 border border-pink-800/60 flex items-center justify-center text-pink-400">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Entertainment & Story Worlds
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Immerse in parallel story dimensions with multiple active characters talking together in a single dynamic room.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Multi-Character Story Progression</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Custom Character Personas & Snippets</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Dynamic Turn & Latency */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-cyan-500/30 backdrop-blur-md space-y-4 hover:border-cyan-500/60 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Dynamic Turn & Speed Engine
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gemini AI evaluates speaker turns in real time so the most relevant character responds dynamically without waiting for manual prompts.
            </p>
            <ul className="space-y-1.5 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Latency Response Times</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dynamic Speaker Turn Management</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= COMPARE BANNER TEASER ================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/80 via-neutral-900/90 to-blue-950/80 border border-purple-500/40 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(147,51,234,0.2)]">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              NextAiChat vs Character.ai
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              See why students, creators, and roleplay enthusiasts are switching from Character.ai to NextAiChat.
            </p>
          </div>

          <Link
            href="/compare"
            className="px-6 py-3.5 rounded-2xl bg-white text-neutral-950 hover:bg-neutral-200 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg"
          >
            <span>View Comparison Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================= DB BLOG POSTS SHOWCASE ================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto space-y-8 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Latest Insights & <span className="text-purple-400">Articles</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Database-driven guides on AI roleplay for study and entertainment
            </p>
          </div>
          <Link
            href="/blog"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Blogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
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
                className="group p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>{blog.views} views</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500 mt-4">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
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
