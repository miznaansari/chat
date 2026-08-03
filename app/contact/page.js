"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import {
  Sparkles,
  Mail,
  Send,
  User,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
  FileText,
  Clock,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    { id: "General", label: "💬 General" },
    { id: "Bug", label: "🐛 Bug Report" },
    { id: "Feature", label: "🚀 Feature Idea" },
    { id: "Feedback", label: "⭐ AI Feedback" },
    { id: "DMCA", label: "⚖️ Legal / DMCA" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccessMsg(data.message || "Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans selection:bg-purple-500 selection:text-white relative overflow-y-auto lg:overflow-hidden">
      {/* Background Mesh Gradient Spheres */}
      <div className="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Pro Shared Public Navbar */}
      <PublicNavbar activePage="contact" />

      {/* Main Split Content Container (Flex-1 & Smooth Internal Scroll) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-4 flex items-start lg:items-center justify-center min-h-0 relative z-10 overflow-y-auto">

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* LEFT SIDE CONTENT (5 Columns on Large Screen) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium self-start backdrop-blur-sm">
              <Mail className="w-3.5 h-3.5" />
              <span>Support & Inquiries Desk</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Let's Build Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">AI Experiences</span>
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Have questions about NextAiChat's multi-character roleplay, custom AI tutors, or bug reports? Drop us a message and our team will get back to you!
              </p>
            </div>

            {/* Feature Highlight Cards */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Instant Team Alerts</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Submissions trigger instant notifications to our team Discord channel.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Prompt Response Time</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">We monitor bug reports, feature ideas, and DMCA inquiries daily.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Privacy Protected</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Your email and messages are stored securely and never shared.</p>
                </div>
              </div>
            </div>

            {/* Legal Links Footer Card */}
            <div className="pt-1">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/30 via-indigo-950/30 to-neutral-900/50 border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px]">Need legal or policy details?</span>
                <div className="flex items-center gap-2.5 text-[11px]">
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Privacy Policy
                  </Link>
                  <span className="text-neutral-700">•</span>
                  <Link href="/terms" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM (7 Columns on Large Screen) */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900/80 border border-neutral-800/90 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Top Iridescent Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

              {successMsg ? (
                <div className="py-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1.5">Message Delivered!</h2>
                  <p className="text-xs text-neutral-300 max-w-sm mb-5 leading-relaxed">
                    {successMsg}
                  </p>
                  <button
                    onClick={() => setSuccessMsg("")}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs border border-neutral-700 transition-all shadow-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Send us a Message</h3>
                    <p className="text-[11px] text-neutral-400">Fill out the form below and we will route it to the right team.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Category Pills Selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Select Topic Category
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => {
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border ${
                              isSelected
                                ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-900/30"
                                : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex"
                          className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
                      Your Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your question, feature request, or feedback in detail..."
                        className="w-full bg-neutral-950/90 border border-neutral-800 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg shadow-purple-950/40 transition-all disabled:opacity-50 active:scale-[0.99]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer (Shrink-0) */}
      <footer className="shrink-0 border-t border-neutral-800/80 py-2.5 px-6 text-center text-[11px] text-neutral-500 z-10">
        <p>© 2026 Gemini AI Roleplay Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
