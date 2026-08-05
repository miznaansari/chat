"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage("No verification token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Email verification failed.");
        }

        setSuccess(true);
        setMessage(data.message || "Your email address has been verified successfully!");
      } catch (err) {
        setSuccess(false);
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-dvh w-full bg-[#030712] text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-8 relative font-sans selection:bg-purple-500 selection:text-white bg-antigravity-grid overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-cyan-900/30 via-purple-900/20 to-transparent rounded-full animate-pulse-glow pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 space-y-6 cyber-glass-card p-6 sm:p-8 rounded-3xl border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.2)] text-center">
        {/* Brand Header */}
        <Link href="/" className="inline-block">
          <img
            src="/logo-landspace.png"
            alt="NextAiChat Logo"
            className="h-16 w-auto mx-auto object-contain drop-shadow-[0_0_15px_rgba(147,51,234,0.4)]"
          />
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-bold shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>EMAIL VERIFICATION</span>
        </div>

        {loading ? (
          <div className="space-y-4 py-8">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300">Verifying your email token...</p>
          </div>
        ) : success ? (
          <div className="space-y-5 py-2 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-purple-950 border-2 border-purple-500/50 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Email Verified!</h1>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Continue to NextAiChat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500/50 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Verification Failed</h1>
              <p className="text-xs text-red-300 leading-relaxed max-w-xs mx-auto">
                {message}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:bg-neutral-800 active:scale-95 cursor-pointer"
              >
                <span>Return to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh w-full bg-[#030712] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
