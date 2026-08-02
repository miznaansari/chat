"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Tooltip from "@/components/Tooltip";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  KeyRound,
} from "lucide-react";

export default function SettingPage() {
  const { language, changeLanguage, user } = useLanguage();

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback state
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus({
        type: "error",
        message: "All password fields are required.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "New password and Confirm password do not match.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "error",
          message: data.error || "Failed to update password.",
        });
      } else {
        setStatus({
          type: "success",
          message: "Password updated successfully! 🎉",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-neutral-950 text-neutral-100 flex flex-col font-sans relative overflow-y-auto overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Dynamic Background Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div className="fixed inset-0 bg-antigravity-grid pointer-events-none opacity-40" />

      {/* Top Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-purple-500/20 px-4 md:px-8 flex items-center justify-between bg-neutral-950/80 backdrop-blur-xl shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Chat</span>
          </Link>
          <img
            src="/logo-landspace.png"
            alt="NextAiChat Logo"
            className="h-7 w-auto object-contain hidden xs:block"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-xs font-medium text-neutral-300 hidden sm:inline">
            {user?.name || "Authenticated User"}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-10 space-y-8">
        {/* Page Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Control Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Manage your account security credentials and dynamic language preferences.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Change Password */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Change Password
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Update your account login password securely
                  </p>
                </div>
              </div>

              {/* Status Alert Banner */}
              {status.message && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                    status.type === "success"
                      ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                      : "bg-red-950/70 border-red-500/40 text-red-300"
                  }`}
                >
                  {status.type === "success" ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                {/* Old Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 6 chars)"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? (
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
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Card 2: Language & Tooltip Preference */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    App Language & Tooltips
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Choose UI and tooltip language mode (Saved in DB)
                  </p>
                </div>
              </div>

              {/* Language Selector Cards */}
              <div className="space-y-3">
                {/* Hinglish Option */}
                <div
                  onClick={() => changeLanguage("hinglish")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    language === "hinglish"
                      ? "bg-purple-950/60 border-purple-500 shadow-md shadow-purple-900/20"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇮🇳</span>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        Hinglish
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Tooltips & UI Hinglish mein dikhenge
                      </div>
                    </div>
                  </div>
                  {language === "hinglish" && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* English Option */}
                <div
                  onClick={() => changeLanguage("en")}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    language === "en"
                      ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-900/20"
                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">
                        English
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Standard English tooltips & interface
                      </div>
                    </div>
                  </div>
                  {language === "en" && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tooltip Live Test Preview */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-purple-500/20 space-y-2">
              <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Live Tooltip Hover Test</span>
              </div>
              <p className="text-xs text-neutral-400">
                Hover over the button below to test how tooltips appear in your active language (
                <span className="font-bold text-white uppercase">{language}</span>):
              </p>
              <div className="pt-1 flex items-center justify-center">
                <Tooltip
                  content="Send Message (Enter)"
                  position="top"
                  badgeIcon="🚀"
                >
                  <button className="px-4 py-2 rounded-xl bg-purple-900/40 border border-purple-700 text-purple-200 text-xs font-semibold hover:bg-purple-950 transition-colors cursor-pointer flex items-center gap-2">
                    <span>🚀 Hover Me to Test Tooltip</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
