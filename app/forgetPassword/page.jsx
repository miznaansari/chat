"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, KeyRound, AlertCircle } from "lucide-react";

function ForgetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mode: "request" (enter email) or "reset" (enter new password)
  const isResetMode = Boolean(tokenFromUrl);

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send password reset email.");
      }

      setSuccess(true);
      setSuccessMessage(data.message || "Reset link sent to your email address!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenFromUrl, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setSuccess(true);
      setSuccessMessage(data.message || "Password successfully changed!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-[#030712] text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-8 relative font-sans selection:bg-purple-500 selection:text-white bg-antigravity-grid overflow-hidden">
      {/* Glow Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-pink-900/30 via-purple-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6 cyber-glass-card p-6 sm:p-8 rounded-3xl border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.2)]">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <img
              src="/logo-landspace.png"
              alt="NextAiChat Logo"
              className="h-16 w-auto mx-auto object-contain drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]"
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold shadow-sm">
            <KeyRound className="w-3.5 h-3.5 text-purple-400" />
            <span>ACCOUNT RECOVERY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isResetMode ? "Set New Password" : "Forgot Password?"}
          </h1>

          <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
            {isResetMode
              ? "Enter your new password below to reset your NextAiChat account access."
              : "No worries! Enter your registered email and we will send you a link to reset your password."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-medium text-center flex items-center justify-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success ? (
          <div className="space-y-5 text-center py-2 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-500/50 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">
                {isResetMode ? "Password Changed Successfully!" : "Email Sent!"}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
                {successMessage}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Back to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Forms */
          <>
            {!isResetMode ? (
              /* STEP 1: REQUEST RESET LINK */
              <form onSubmit={handleRequestLink} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                  />
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
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: RESET PASSWORD WITH TOKEN */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>New Password</span>
                  </label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="text-center pt-2 border-t border-neutral-800/60">
              <Link
                href="/login"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1"
              >
                <span>Remember your password? Log in</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-[#030712] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <ForgetPasswordContent />
    </Suspense>
  );
}
