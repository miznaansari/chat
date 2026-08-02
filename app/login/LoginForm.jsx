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
  Compass,
  Cpu,
  Globe,
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
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-[#030712] text-neutral-100 flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-purple-500 selection:text-white relative overflow-y-auto lg:overflow-hidden bg-antigravity-grid">
      
      {/* ANTIGRAVITY FLOATING ORBS & ORBITAL RINGS */}
      <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-blue-900/30 via-cyan-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none" />
      
      {/* Floating Physics Particles */}
      <div className="fixed top-1/4 left-10 w-24 h-24 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm animate-float-slow pointer-events-none hidden md:block" />
      <div className="fixed bottom-1/4 right-12 w-32 h-32 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm animate-float-reverse pointer-events-none hidden md:block" />

      {/* Orbit Rings Centered */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-neutral-800/40 animate-orbit pointer-events-none hidden lg:block">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]" />
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-purple-900/30 animate-orbit-reverse pointer-events-none hidden lg:block">
        <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 relative z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-10 h-10 rounded-2xl bg-neutral-950 border border-purple-500/30 flex items-center justify-center text-white shadow-2xl">
              <Sparkles className="w-5 h-5 text-purple-400 fill-current animate-spin-slow" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-white block leading-none font-mono">
              ANTIGRAVITY<span className="text-purple-400">.AI</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase flex items-center gap-1 mt-0.5">
              <Cpu className="w-3 h-3 text-cyan-400" /> Multi-Agent Engine
            </span>
          </div>
        </div>

        {/* Feature Badges Header */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 backdrop-blur-md shadow-inner">
            <Bot className="w-3.5 h-3.5 text-purple-400" /> Gemini 3.5 Flash
          </span>
          <span className="px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 backdrop-blur-md shadow-inner">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Zero Latency
          </span>
        </div>
      </header>

      {/* MAIN ANTIGRAVITY GLASS CARD */}
      <main className="w-full max-w-md mx-auto my-auto relative z-20 py-4 shrink-0">
        <div className="bg-neutral-950/85 border border-purple-500/25 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl shadow-[0_0_60px_rgba(147,51,234,0.15)] relative overflow-hidden group">
          
          {/* Animated Top Shimmer Neon Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-shimmer" />

          {/* Hero Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Roleplay Matrix v2.4</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isRegister ? "Initialize Persona" : "Enter Antigravity"}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
              {isRegister
                ? "Create your user profile to orchestrate multi-character AI roleplay."
                : "Sign in to jump into parallel multi-character story dimensions."}
            </p>
          </div>

          {/* Antigravity Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-neutral-900/90 border border-neutral-800 mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
              className={`py-2.5 rounded-xl transition-all duration-300 ${
                !isRegister
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]"
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
              className={`py-2.5 rounded-xl transition-all duration-300 ${
                isRegister
                  ? "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 animate-ping" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">
                // Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter unique alias"
                  className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-widest font-mono">
                // Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/80" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-11 text-xs sm:text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-[0_0_35px_rgba(147,51,234,0.35)] transition-all disabled:opacity-50 active:scale-[0.99] tracking-wider uppercase font-mono"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isRegister ? "Launch Account" : "Access Console"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Security Info Badge */}
          <div className="mt-5 pt-4 border-t border-neutral-900 text-center">
            <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Encrypted JWT Session • Private AI Context
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER LEGAL & POLICY NAVIGATION */}
      <footer className="w-full max-w-3xl mx-auto text-center py-2 relative z-20 shrink-0">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 mb-1">
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
        <p className="text-[10px] text-neutral-600 font-mono">
          Powered by Google Gemini 3.5 Engine • Antigravity AI Platform 2026
        </p>
      </footer>
    </div>
  );
}
