import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - NextAiChat",
  description: "NextAiChat Privacy Policy detailing data security, private user sessions, and private AI roleplay context handling.",
};

export default function PrivacyPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Data Privacy & Security</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400">Last updated: August 2026</p>
      </div>

      {/* Document Content Card */}
      <div className="relative z-10 p-6 sm:p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-6 text-neutral-300 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
          <p>
            NextAiChat collects minimal user information necessary to provide AI roleplay for study and entertainment. Account data includes chosen usernames, secure password hashes, and user settings (such as active interface language preferences).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">2. Use of AI Conversation Data</h2>
          <p>
            Your interactive roleplay conversations are processed strictly to maintain turn-by-turn context using Advanced AI models. We do not sell or index your private conversations for public search engines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">3. Security & Cookies</h2>
          <p>
            Authentication is managed via HTTP-Only JWT cookies and secure session keys. We implement industry-standard security protocols to guard your account against unauthorized access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white">4. Your Data Rights</h2>
          <p>
            You have the right to request deletion of your account and associated chat sessions at any time through our support team or settings interface.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-neutral-800">
          <h2 className="text-base font-bold text-white">5. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact us at support@nextaichat.online.
          </p>
        </section>
      </div>
    </div>
  );
}
