import Link from "next/link";
import {
  Sparkles,
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  BookOpen,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "NextAiChat vs Character.ai - Feature Comparison Matrix",
  description:
    "Detailed side-by-side feature comparison matrix between NextAiChat and Character.ai for study, educational simulations, dynamic multi-character speaker turns, and response speed.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "NextAiChat vs Character.ai - Feature Comparison Matrix",
    description:
      "See why students, creators, and roleplay enthusiasts are switching from Character.ai to NextAiChat.",
    url: "/compare",
  },
};

export default function ComparePage() {
  const comparisonMatrix = [
    {
      feature: "Dynamic Speaker Turn Engine",
      description: "AI decides who speaks next based on conversation context without forced manual prompts.",
      nextaichat: { status: "success", text: "Smart Turn Engine (Gemini AI)" },
      characterAi: { status: "danger", text: "Rigid 1-by-1 Manual Prompts" },
    },
    {
      feature: "Study & Educational Personas",
      description: "Dedicated tutor personas, exam prep scenarios, and quiz mode roleplay.",
      nextaichat: { status: "success", text: "Native Study & Exam Scenarios" },
      characterAi: { status: "warning", text: "Entertainment-focused default" },
    },
    {
      feature: "Response Speed & Latency",
      description: "Fast turn latency during peak usage hours without waiting queues.",
      nextaichat: { status: "success", text: "Zero Latency (Gemini Flash Lite)" },
      characterAi: { status: "warning", text: "Queue wait times on peak load" },
    },
    {
      feature: "Multi-Character Room Support",
      description: "Multiple active personas interacting together in a single conversation.",
      nextaichat: { status: "success", text: "Seamless Multi-Persona Rooms" },
      characterAi: { status: "warning", text: "Limited Group Chat mechanics" },
    },
    {
      feature: "Hinglish & Multi-Language Support",
      description: "Native support for Hinglish and English localized tooltips.",
      nextaichat: { status: "success", text: "Full Hinglish & English Mode" },
      characterAi: { status: "warning", text: "English standard default" },
    },
    {
      feature: "Privacy & Log Encryption",
      description: "Encrypted JWT user sessions without public indexing of user chats.",
      nextaichat: { status: "success", text: "Encrypted Private AI Context" },
      characterAi: { status: "warning", text: "Public indexing & moderation filters" },
    },
    {
      feature: "Reusable Snippets Bank",
      description: "Save frequently used roleplay phrases for instant one-click execution.",
      nextaichat: { status: "success", text: "Built-in Snippet Library" },
      characterAi: { status: "danger", text: "Not Supported (Manual retyping)" },
    },
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white py-12 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-12">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Hero Header */}
      <div className="text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Side-by-Side Platform Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          NextAiChat <span className="text-purple-400">vs</span> Character.ai
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Compare features, AI response engine latency, educational study tools, multi-character dynamic turns, and privacy.
        </p>
      </div>

      {/* Comparison Matrix Table Card */}
      <div className="relative z-10 bg-neutral-900/60 border border-purple-500/30 rounded-3xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider font-mono">
                <th className="py-4 px-4 text-neutral-400 w-2/5">Feature / Capability</th>
                <th className="py-4 px-4 text-purple-400 font-bold bg-purple-950/40 rounded-t-xl w-3/10">
                  NextAiChat 🚀
                </th>
                <th className="py-4 px-4 text-neutral-400 w-3/10">
                  Character.ai 🤖
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-xs">
              {comparisonMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-4 px-4 space-y-1">
                    <div className="font-bold text-white text-sm">{item.feature}</div>
                    <div className="text-neutral-400 text-[11px] leading-snug">{item.description}</div>
                  </td>
                  
                  {/* NextAiChat Cell */}
                  <td className="py-4 px-4 bg-purple-950/20 font-semibold text-purple-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.nextaichat.text}</span>
                    </div>
                  </td>

                  {/* Character.ai Cell */}
                  <td className="py-4 px-4 text-neutral-400">
                    <div className="flex items-center gap-2">
                      {item.characterAi.status === "danger" ? (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{item.characterAi.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Dive Breakdown */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
            <BookOpen className="w-5 h-5" />
            <span>Built for Study & Productivity</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            While Character.ai focuses heavily on general entertainment, NextAiChat provides specialized features for study roleplays — like mock exams, foreign language dialogues, and AI tutor personas with custom length controls.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Zap className="w-5 h-5" />
            <span>Dynamic Speaker Turns</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Instead of manually clicking character names to respond one by one, NextAiChat evaluates conversation context using Gemini AI to automatically determine the most relevant speaker turn.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="relative z-10 p-8 rounded-3xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/40 text-center space-y-4">
        <h3 className="text-2xl font-extrabold text-white">
          Ready to experience the NextAiChat difference?
        </h3>
        <p className="text-xs text-neutral-300 max-w-md mx-auto">
          Start roleplaying for study or fun with zero latency and smart turn management.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition-colors shadow-lg"
        >
          <span>Launch NextAiChat App</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
