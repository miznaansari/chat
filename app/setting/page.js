"use client";

import { useState, useEffect, useMemo } from "react";
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
  Activity,
  BarChart3,
  Calendar,
  Zap,
  TrendingUp,
  Clock,
  Filter,
  Loader2,
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

  // AI API Usage Analytics State
  const [usageData, setUsageData] = useState({
    today: "",
    todayCount: 0,
    totalCount: 0,
    history7DaysCount: 0,
    history30DaysCount: 0,
    history: [],
  });
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [rangeFilter, setRangeFilter] = useState("today"); // "today" | "7days" | "30days" | "all"

  useEffect(() => {
    fetchAiUsage();
  }, []);

  const fetchAiUsage = async () => {
    try {
      setLoadingUsage(true);
      const res = await fetch("/api/user/usage");
      if (res.ok) {
        const data = await res.json();
        setUsageData(data);
      }
    } catch (err) {
      console.error("Failed to load AI usage stats", err);
    } finally {
      setLoadingUsage(false);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!usageData.history || usageData.history.length === 0) return [];
    const now = new Date();

    if (rangeFilter === "today") {
      return usageData.history.filter((r) => r.date === usageData.today);
    }
    if (rangeFilter === "7days") {
      const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      return usageData.history.filter((r) => r.date >= d7);
    }
    if (rangeFilter === "30days") {
      const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      return usageData.history.filter((r) => r.date >= d30);
    }
    return usageData.history;
  }, [usageData, rangeFilter]);

  const maxCountInRange = useMemo(() => {
    if (filteredHistory.length === 0) return 1;
    return Math.max(...filteredHistory.map((r) => r.count), 1);
  }, [filteredHistory]);

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

        {/* Card 3: Gemini AI API Usage & Analytics */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-blue-600/30 border border-purple-500/40 text-purple-300 shadow-inner">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    Gemini AI API Call Analytics
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live Tracked
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Daily API call hits counter & range-based usage history per user
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-neutral-950 border border-neutral-800 p-1 rounded-2xl text-xs shrink-0">
              <button
                type="button"
                onClick={() => setRangeFilter("today")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  rangeFilter === "today"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setRangeFilter("7days")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  rangeFilter === "7days"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setRangeFilter("30days")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  rangeFilter === "30days"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setRangeFilter("all")}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  rangeFilter === "all"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* Hero Metrics Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider block">
                Today's Calls
              </span>
              <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                <span>{usageData.todayCount}</span>
                <span className="text-xs font-semibold text-purple-300">hits</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Initial default view</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-1">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block">
                Last 7 Days
              </span>
              <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                <span>{usageData.history7DaysCount}</span>
                <span className="text-xs font-semibold text-blue-300">calls</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Past 7 days total</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                Last 30 Days
              </span>
              <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                <span>{usageData.history30DaysCount}</span>
                <span className="text-xs font-semibold text-amber-300">calls</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Monthly accumulated</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                All-Time Calls
              </span>
              <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                <span>{usageData.totalCount}</span>
                <span className="text-xs font-semibold text-emerald-300">total</span>
              </div>
              <span className="text-[10px] text-neutral-400 block">Lifetime API usages</span>
            </div>
          </div>

          {/* Daily Usage History Breakdown & Progress Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>
                  Daily API Usage ({rangeFilter.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                {filteredHistory.length} record(s) found
              </span>
            </div>

            {loadingUsage ? (
              <div className="p-8 text-center bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-2">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
                <span className="text-xs text-neutral-400 block font-semibold">Loading Gemini AI usage history...</span>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-8 text-center bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-1">
                <Clock className="w-6 h-6 text-neutral-500 mx-auto mb-1" />
                <span className="text-xs font-bold text-neutral-300 block">No API calls recorded for this range yet</span>
                <span className="text-[11px] text-neutral-500 block">Start roleplaying or asking AI tutors to see daily call stats here!</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredHistory.map((item) => {
                  const percent = Math.min(100, Math.round((item.count / maxCountInRange) * 100));
                  const isToday = item.date === usageData.today;
                  const dateFormatted = new Date(item.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={item.id || item.date}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        isToday
                          ? "bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-900/10"
                          : "bg-neutral-950 border-neutral-800/90 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <div className={`p-2 rounded-xl border font-mono text-xs font-bold shrink-0 ${
                          isToday ? "bg-purple-900/80 border-purple-600 text-purple-200" : "bg-neutral-900 border-neutral-800 text-neutral-400"
                        }`}>
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm">{dateFormatted}</span>
                            {isToday && (
                              <span className="text-[9px] font-extrabold uppercase bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            Raw Date: {item.date}
                          </span>
                        </div>
                      </div>

                      {/* Call Progress Bar + Badge */}
                      <div className="flex items-center gap-3 flex-1 sm:max-w-xs w-full">
                        <div className="flex-1 bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800 p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isToday
                                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }`}
                            style={{ width: `${Math.max(5, percent)}%` }}
                          />
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs font-extrabold text-white shrink-0 shadow-inner min-w-[70px] text-center">
                          {item.count} hits
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
