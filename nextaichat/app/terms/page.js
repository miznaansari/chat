import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - NextAiChat",
  description: "NextAiChat Terms of Service governing platform usage for study, educational simulations, and entertainment.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 flex flex-col relative overflow-x-hidden selection:bg-purple-500 selection:text-white py-12 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto space-y-8 w-full">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Header */}
      <div className="relative z-10 space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-400">Last updated: August 2026</p>
      </div>

      {/* Document Content Card */}
      <div className="relative z-10 p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6 text-neutral-300 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Platform Scope & Purpose</h2>
          <p>
            NextAiChat is designed as an interactive AI roleplay platform intended for educational study simulations, tutor conversations, language learning practice, creative writing, and entertainment purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Acceptable Conduct</h2>
          <p>
            Users agree not to use NextAiChat to generate illegal content, attempt system exploitation, or bypass safety moderation controls. Accounts violating usage guidelines are subject to termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. AI Disclaimer</h2>
          <p>
            Roleplay responses are generated dynamically by artificial intelligence. While roleplays can provide educational guidance, outputs should be verified independently for academic accuracy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Intellectual Property</h2>
          <p>
            The NextAiChat brand, landing platform, and proprietary dynamic turn engine are protected trademarks and software assets of NextAiChat Inc.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-neutral-800">
          <h2 className="text-base font-bold text-white">5. Governing Law</h2>
          <p>
            These terms are governed by standard software service laws and regulations.
          </p>
        </section>
      </div>
    </div>
  );
}
