"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Bot,
  Languages,
  CheckCircle2,
  BookOpen,
  Gamepad2,
  Heart,
  Brain,
  MessageSquare,
  Compass,
} from "lucide-react";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginForm() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Onboarding Step State: "auth" | "language" | "generating"
  const [step, setStep] = useState("auth");
  const [selectedLang, setSelectedLang] = useState("hinglish");
  const [progress, setProgress] = useState(0);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);

  const handleGoogleSignIn = async () => {
    if (!ageConfirmed) {
      setError("Please confirm your age by checking the age limit box to proceed.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Google authentication failed");
      }

      if (data.user?.hasChosenLanguage) {
        router.push("/");
        router.refresh();
      } else {
        setStep("language");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ageConfirmed) {
      setError("Please confirm your age by checking the age limit box to proceed.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.user?.hasChosenLanguage) {
        router.push("/");
        router.refresh();
      } else {
        setStep("language");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save Language Preference & Direct Redirect to Home Page
  const handleSaveLanguage = async (chosenLang) => {
    setSelectedLang(chosenLang);
    setLoading(true);

    try {
      await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: chosenLang }),
      });
    } catch (err) {
      console.error("Error saving user language", err);
    } finally {
      setLoading(false);
      router.push("/");
      router.refresh();
    }
  };

  const hinglishAgents = [
    { name: "Prof. Ananya", role: "Subject & Exam Prep Tutor", icon: "⚛️", tag: "Exam Prep" },
    { name: "Dr. Vikram", role: "Science & Math Master", icon: "🧮", tag: "Problem Solver" },
    { name: "Coach Priya", role: "English Speaking & Fluency", icon: "🗣️", tag: "Spoken English" },
    { name: "Coach Rohan", role: "Fluency & Interview Coach", icon: "💼", tag: "Interview Prep" },
    { name: "Mentor Diya", role: "Calm Wellness & Anti-Depression", icon: "🧘", tag: "Wellness" },
    { name: "Mentor Kabir", role: "Mindset & Stress Relief", icon: "⚡", tag: "Motivation" },
  ];

  const englishAgents = [
    { name: "Prof. Sarah", role: "Subject & Exam Prep Tutor", icon: "⚛️", tag: "Exam Prep" },
    { name: "Dr. Marcus", role: "Science & Math Master", icon: "🧮", tag: "Problem Solver" },
    { name: "Coach Emma", role: "English Speaking & Fluency", icon: "🗣️", tag: "Spoken English" },
    { name: "Coach Alex", role: "Fluency & Interview Coach", icon: "💼", tag: "Interview Prep" },
    { name: "Mentor Maya", role: "Calm Wellness & Anti-Depression", icon: "🧘", tag: "Wellness" },
    { name: "Mentor Julian", role: "Mindset & Stress Relief", icon: "⚡", tag: "Motivation" },
  ];

  const activeAgentList = selectedLang === "hinglish" ? hinglishAgents : englishAgents;

  return (
    <div className="min-h-dvh h-auto lg:h-[100dvh] w-full max-w-full bg-[#030712] text-neutral-100 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative font-sans selection:bg-purple-500 selection:text-white bg-antigravity-grid">
      {/* ANTIGRAVITY FLOATING ORBS & ORBITAL RINGS */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-blue-900/30 via-cyan-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />

      {/* Orbit Rings Centered (Desktop Only) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-neutral-800/40 animate-orbit pointer-events-none hidden lg:block z-0">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]" />
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-purple-900/30 animate-orbit-reverse pointer-events-none hidden lg:block z-0">
        <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
      </div>

      {/* ================= SIDE 1: HERO & BRAND SHOWCASE (Desktop) ================= */}
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

            <p className="text-sm text-neutral-300 font-normal leading-relaxed">
              Zero-latency AI tutors for exam prep, language practice & multi-character storytelling.
            </p>
          </div>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-purple-500/20 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Zap className="w-4 h-4" />
                <span>Zero Latency</span>
              </div>
              <p className="text-[11px] text-neutral-400">Gemini 3.5 Flash Flash response engine.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-cyan-500/20 backdrop-blur-sm space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>6 Seeded Tutors</span>
              </div>
              <p className="text-[11px] text-neutral-400">Subject, Spoken English & Wellness mentors.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 font-mono pt-4 border-t border-neutral-800/40">
          <span>NextAiChat Matrix Engine</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Online
          </span>
        </div>
      </div>

      {/* ================= SIDE 2: AUTH / ONBOARDING STEPPER (Mobile & Desktop) ================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10 my-auto min-h-dvh lg:min-h-0">

        {/* Mobile Top Brand Header */}
        <div className="lg:hidden w-full max-w-md flex items-center justify-between mb-6 pt-2">
          <Link href="/" className="inline-block">
            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(147,51,234,0.4)]"
            />
          </Link>

        </div>

        {/* STEP 1: AUTHENTICATION FORM (LOGIN / REGISTER) */}
        {step === "auth" && (
          <div className="w-full max-w-md space-y-5 sm:space-y-6 cyber-glass-card p-5 sm:p-8 rounded-2xl sm:rounded-3xl border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.2)] my-auto">

            {/* Header Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {isRegister ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                {isRegister
                  ? "Start interactive AI roleplays for study, education & fun."
                  : "Sign in to jump back into roleplay study & fun sessions."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950/90 rounded-xl sm:rounded-2xl border border-neutral-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
                className={`py-2 sm:py-2.5 text-xs font-extrabold rounded-lg sm:rounded-xl transition-all cursor-pointer ${!isRegister
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
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
                className={`py-2 sm:py-2.5 text-xs font-extrabold rounded-lg sm:rounded-xl transition-all cursor-pointer ${isRegister
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-neutral-800" />
              <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">or credentials</span>
              <div className="flex-1 h-[1px] bg-neutral-800" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium text-center animate-in fade-in duration-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Username</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>

              {isRegister && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required={isRegister}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Password</span>
                  </label>
                  {!isRegister && (
                    <Link
                      href="/forgetPassword"
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Age Limit Checkbox */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 my-2 animate-in fade-in duration-200">
                <input
                  type="checkbox"
                  id="ageConfirm"
                  checked={ageConfirmed}
                  onChange={(e) => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-800 bg-neutral-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-neutral-950 cursor-pointer accent-purple-600"
                />
                <label htmlFor="ageConfirm" className="text-xs text-neutral-400 select-none leading-normal cursor-pointer">
                  I confirm that I am <span className="text-purple-400 font-semibold">16 years of age or older</span> and agree to the platform safety rules.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>{isRegister ? "Get Started" : "Sign In to Matrix"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Terms & Privacy Policy Notice */}
            <p className="text-[11px] text-center text-neutral-400 pt-2 leading-relaxed border-t border-neutral-800/60">
              By continuing, you agree to NextAiChat's{" "}
              <Link
                href="/terms"
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        )}

        {/* STEP 2: FIRST-TIME LANGUAGE CHOICE MODAL */}
        {step === "language" && (
          <div className="w-full max-w-md space-y-6 cyber-glass-card p-6 sm:p-8 rounded-3xl border-purple-500/40 shadow-[0_0_60px_rgba(147,51,234,0.3)] animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>FIRST-TIME AI SETUP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Choose Preferred Language
              </h2>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto leading-relaxed">
                Select how your 6 default AI Tutors, Coaches & Wellness Mentors should talk to you.
              </p>
            </div>

            {/* Language Option Cards */}
            <div className="space-y-3.5">
              {/* Option 1: Hinglish (Indian Names) */}
              <div
                onClick={() => handleSaveLanguage("hinglish")}
                className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-purple-500/40 hover:border-purple-400 text-left space-y-2 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇮🇳</span>
                    <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                      Hinglish (Hindi + English)
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-bold">
                    Popular in India 🚀
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Indian AI Personas (<strong className="text-purple-300">Prof. Ananya, Dr. Vikram, Coach Priya, Mentor Diya</strong>) with natural Hinglish dialogues.
                </p>
              </div>

              {/* Option 2: English (Global Names) */}
              <div
                onClick={() => handleSaveLanguage("en")}
                className="p-4 rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-cyan-500/40 hover:border-cyan-400 text-left space-y-2 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🇬🇧</span>
                    <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      English (Global Standard)
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 text-[10px] font-bold">
                    Global Standard 🌐
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Global English AI Personas (<strong className="text-cyan-300">Prof. Sarah, Dr. Marcus, Coach Emma, Mentor Maya</strong>) with clear English dialogues.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: GEN-Z ANIMATED AGENT INITIALIZATION SCREEN */}
        {step === "generating" && (
          <div className="w-full max-w-md space-y-6 cyber-glass-card p-6 sm:p-8 rounded-3xl border-purple-500/50 shadow-[0_0_80px_rgba(147,51,234,0.4)] animate-in fade-in duration-300 text-center">

            {/* Pulsing Central Agent Orb */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-full animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_30px_#a855f7] relative z-10">
                <Bot className="w-8 h-8 animate-pulse text-purple-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Preparing Your 6 AI Personas...
              </h2>
              <p className="text-xs text-purple-300 font-mono">
                {selectedLang === "hinglish" ? "Configuring Indian AI Tutors & Mentors" : "Configuring Global English AI Tutors & Mentors"}
              </p>
            </div>

            {/* Gen-Z Cyber Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Initialization Matrix</span>
                <span className="font-bold text-cyan-400">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-purple-500/30">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-full transition-all duration-200 ease-out shadow-[0_0_15px_#22d3ee]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Sequentially Illuminating Agent Cards List */}
            <div className="space-y-2 text-left pt-2 max-h-60 overflow-y-auto pr-1">
              {activeAgentList.map((agent, idx) => {
                const isReady = idx <= activeAgentIndex;
                const isCurrent = idx === activeAgentIndex;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${isReady
                      ? "bg-purple-950/70 border-purple-500/50 text-white shadow-sm"
                      : "bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-60"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">{agent.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{agent.name}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{agent.role}</div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isReady ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-500">
                          {isCurrent ? "Configuring..." : "Waiting..."}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile & Desktop Footer Links */}
        <div className="flex items-center justify-center gap-3 text-xs text-neutral-500 pt-4 pb-2">
          <Link href="/privacy" className="hover:text-purple-300 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-purple-300 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-purple-300 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
