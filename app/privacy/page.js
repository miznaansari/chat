import Link from "next/link";
import { Sparkles, Shield, Lock, Eye, FileText, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Gemini AI Roleplay",
  description: "Learn how we collect, protect, and handle your data and AI character roleplay conversations.",
};

export default function PrivacyPage() {
  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glow Effect */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Fixed Sticky Navigation Header (Shrink-0) */}
      <header className="shrink-0 z-50 backdrop-blur-md bg-neutral-950/85 border-b border-neutral-800/80 px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="font-semibold tracking-tight text-white">Gemini Chat</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container (Flex-1 & Scrollable) */}
      <main className="flex-1 w-full overflow-y-auto px-6 py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title Header Badge */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium mb-3 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy & Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
              Last Updated: August 2026 • We respect your privacy and are committed to protecting your personal data and AI chat interactions.
            </p>
          </div>

          {/* Legal Body Sections */}
          <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
            {/* Section 1 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-purple-400">
                <Eye className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">1. Information We Collect</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                When you register and use Gemini Chat, we collect minimal data necessary to deliver multi-character roleplay experiences:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li><strong className="text-neutral-200">Account Credentials:</strong> Username and encrypted password hash (stored via salted bcrypt).</li>
                <li><strong className="text-neutral-200">Character Profiles & Stories:</strong> Custom character personas, backstories, avatars, and reusable snippets you create.</li>
                <li><strong className="text-neutral-200">Roleplay Chat Logs:</strong> Conversation turns and transcripts generated during roleplay sessions.</li>
                <li><strong className="text-neutral-200">Technical Logs:</strong> IP address, browser user-agent, and session cookies for authentication.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">2. AI Processing & Google Gemini API Disclosure</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                Our platform uses Google Gemini Generative AI models (`@google/genai`) to generate dynamic character roleplay turns:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li>Your prompts, scene story settings, and participating character personas are transmitted to Google API endpoints strictly to compute roleplay replies.</li>
                <li>We do not sell your conversation logs or prompt history to third parties or advertising networks.</li>
                <li>We encourage users not to submit sensitive personally identifiable information (PII) such as real passwords, credit card numbers, or government identifiers into AI roleplay prompts.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-indigo-400">
                <Lock className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">3. Security & Cookie Policy</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                We implement industry-standard security measures to safeguard your session:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li><strong className="text-neutral-200">Authentication Cookies:</strong> We store a secure JWT token inside an <code className="text-purple-300">HttpOnly</code>, <code className="text-purple-300">SameSite=Lax</code> cookie to keep you logged in safely.</li>
                <li><strong className="text-neutral-200">Encryption in Transit:</strong> All web traffic is encrypted using HTTPS / TLS protocols.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-pink-400">
                <FileText className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">4. Your Data Rights (GDPR & CCPA)</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                Regardless of your location, you hold full rights over your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li><strong className="text-neutral-200">Right to Delete:</strong> You can delete any chat session, message, or character profile at any time.</li>
                <li><strong className="text-neutral-200">Right to Account Erasure:</strong> Contact us to request full deletion of your account and all associated database records.</li>
              </ul>
            </section>

            {/* Contact Banner */}
            <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Have Privacy Questions?</h3>
                <p className="text-xs text-neutral-400">Our support team and data controller are ready to assist you.</p>
              </div>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Navigation Footer (Shrink-0) */}
      <footer className="shrink-0 z-50 backdrop-blur-md bg-neutral-950/85 border-t border-neutral-800/80 py-3.5 px-6 text-center text-xs text-neutral-500">
        <p>© 2026 Gemini AI Roleplay Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
