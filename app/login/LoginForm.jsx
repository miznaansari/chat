"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Bot,
  Mail,
  FileText,
  BookOpen,
  Gamepad2,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh h-auto lg:h-[100dvh] w-full max-w-full bg-[#030712] text-neutral-100 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative font-sans selection:bg-purple-500 selection:text-white bg-antigravity-grid">
      {/* EXACT PREVIOUS ANTIGRAVITY FLOATING ORBS & ORBITAL RINGS */}
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-900/30 via-cyan-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />

      {/* Floating Physics Particles */}
      <div className="fixed top-1/4 left-10 w-24 h-24 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm animate-float-slow pointer-events-none hidden md:block z-0" />
      <div className="fixed bottom-1/4 right-12 w-32 h-32 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm animate-float-reverse pointer-events-none hidden md:block z-0" />

      {/* Orbit Rings Centered */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-neutral-800/40 animate-orbit pointer-events-none hidden lg:block z-0">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]" />
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-purple-900/30 animate-orbit-reverse pointer-events-none hidden lg:block z-0">
        <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
      </div>

      {/* ================= SIDE 1: HERO & BRAND SHOWCASE ================= */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-8 xl:p-12 relative z-10 border-r border-neutral-800/40 bg-neutral-950/30 backdrop-blur-md">
        {/* Top Brand Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-block">
            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            />
          </Link>
        </div>

        {/* Center Hero Visual Content */}
        <div className="my-auto space-y-6 max-w-lg">

          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Interactive AI Roleplay for{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Study & Entertainment
              </span>
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Experience dynamic multi-character conversations. Roleplay for educational learning, study simulations, language practice, or pure fun and entertainment.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-3 pt-1">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">
                  Study & Educational Roleplay
                </h2>
                {/* <p className="text-[11px] text-neutral-400 mt-0.5">
                  Practice subject concepts, exam prep, historical personas, and tutor scenarios.
                </p> */}
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-pink-950/80 border border-pink-800/60 text-pink-400 shrink-0">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">
                  Fun & Entertainment Stories
                </h2>
                {/* <p className="text-[11px] text-neutral-400 mt-0.5">
                  Dive into rich anime, fictional, movie, and custom multi-character dialogue worlds.
                </p> */}
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/60 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">
                  Turn-by-Turn Dynamic AI Engine
                </h2>
                {/* <p className="text-[11px] text-neutral-400 mt-0.5">
                  Intelligent speaker turn management powered by Gemini Flash models.
                </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-800/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted JWT Session • Private AI Context</span>
          </div>
          <span>NextAiChat v2.5</span>
        </div>
      </div>

      {/* ================= SIDE 2: AUTHENTICATION CONSOLE ================= */}
      <div className="w-full lg:w-1/2 min-h-dvh lg:h-full flex flex-col justify-between p-3 sm:p-6 xl:p-12 relative z-10 overflow-y-auto bg-neutral-950/50 backdrop-blur-md">
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden py-1 mb-2">
          <Link href="/">
            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-20 sm:h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center Form Glass Card */}
        <div className="my-auto max-w-md w-full mx-auto bg-neutral-950/75 border border-purple-500/25 rounded-3xl p-5 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden group space-y-4 sm:space-y-5">
          {/* Animated Top Shimmer Neon Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-shimmer" />

          {/* Hero Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              {isRegister
                ? "Start interactive AI roleplays for study, education & fun."
                : "Sign in to jump back into roleplay study & fun sessions."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
              className={`py-2 rounded-xl transition-all duration-300 cursor-pointer ${!isRegister
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
              className={`py-2 rounded-xl transition-all duration-300 cursor-pointer ${isRegister
                ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-md"
                : "text-neutral-400 hover:text-white"
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-ping" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter unique username"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-4 text-base sm:text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-purple-500 rounded-xl py-2.5 pl-10 pr-10 text-base sm:text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isRegister ? "Launch Account" : "Sign In Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Info Badge */}
          <div className="pt-3 border-t border-neutral-900 text-center">
            <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Encrypted JWT Session • Private AI Context
            </p>
          </div>
        </div>

        {/* Footer Legal Links */}
        <footer className="pt-4 text-center shrink-0">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
            <Link
              href="/privacy"
              className="hover:text-purple-400 transition-colors flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Privacy Policy</span>
            </Link>
            <span className="text-neutral-800">•</span>
            <Link
              href="/terms"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terms of Service</span>
            </Link>
            <span className="text-neutral-800">•</span>
            <Link
              href="/contact"
              className="hover:text-pink-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span>Contact Support</span>
            </Link>
          </div>
          <p className="text-[10px] text-neutral-600 mt-1.5 font-mono">
            © {new Date().getFullYear()} NextAiChat Inc. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
