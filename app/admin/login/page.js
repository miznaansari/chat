"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid admin credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient Antigravity Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-2xl border border-purple-500/30 p-7 md:p-9 rounded-3xl shadow-[0_0_60px_rgba(147,51,234,0.3)] space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/90 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>ADMIN SECURITY PORTAL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            NextAiChat Admin
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Manage public AI showcase characters, persona presets & system metrics.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-950/90 border border-red-800 text-red-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nextaichat.com"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
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
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
