import Link from "next/link";
import { Sparkles, Scale, AlertTriangle, ShieldCheck, HelpCircle, ArrowLeft, Mail } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Gemini AI Roleplay",
  description: "Terms and conditions governing the use of our multi-character AI roleplay platform.",
};

export default function TermsPage() {
  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Fixed Sticky Header (Shrink-0) */}
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <span className="font-semibold tracking-tight text-white">Gemini Chat</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content (Flex-1 & Scrollable) */}
      <main className="flex-1 w-full overflow-y-auto px-6 py-8 sm:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium mb-3 backdrop-blur-sm">
              <Scale className="w-3.5 h-3.5" />
              <span>User Agreement & Terms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto">
              Last Updated: August 2026 • Please read these terms carefully before accessing or creating AI roleplay characters.
            </p>
          </div>

          <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
            {/* Section 1 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">1. Nature of AI Roleplay Services</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                Gemini Chat is an interactive multi-character roleplay platform powered by Generative AI:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li>All dialogue, character responses, and narratives are generated automatically by AI language models.</li>
                <li>Responses do not represent the views, beliefs, or advice of the platform operators.</li>
                <li><strong className="text-neutral-200">No Professional Advice:</strong> Character dialogue must not be relied upon for medical, psychological, legal, or financial advice.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">2. User-Generated Characters & Intellectual Property</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                Users are solely responsible for custom characters, stories, and prompt inputs created on the platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li><strong className="text-neutral-200">Respect Third-Party IP:</strong> You agree not to create characters, upload avatars, or share content that infringes upon third-party trademarks, copyrights, or rights of publicity.</li>
                <li><strong className="text-neutral-200">DMCA Takedowns:</strong> If you believe content hosted on our service infringes your copyright, submit a DMCA notice via our <Link href="/contact" className="text-blue-400 underline">Contact Form</Link>.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">3. Prohibited Conduct & Content Rules</h2>
              </div>
              <p className="mb-3 text-xs sm:text-sm">
                You agree not to use the platform to generate, promote, or facilitate:
              </p>
              <ul className="list-disc list-inside space-y-2 text-neutral-400 text-xs sm:text-sm pl-2">
                <li>Hate speech, harassment, severe violence, or self-harm encouragement.</li>
                <li>Non-consensual personal exposure, doxxing, or impersonation of real living people.</li>
                <li>Automated bot scraping or malicious API exploitation.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-emerald-400">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-base sm:text-lg font-bold text-white">4. Limitation of Liability</h2>
              </div>
              <p className="text-neutral-400 text-xs sm:text-sm">
                The service is provided "AS IS" without warranties of any kind. Under no circumstances shall the platform operators be liable for indirect, incidental, or consequential damages resulting from AI responses or service interruptions.
              </p>
            </section>

            {/* Contact Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Questions about our Terms?</h3>
                <p className="text-xs text-neutral-400">Reach out to our legal and support team via the contact desk.</p>
              </div>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Desk</span>
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
