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
  const [rangeFilter, setRangeFilter] = useState("today");

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
      const res = await fetch("/api/user/change-password", {
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-8 select-text">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discovery</span>
        </Link>
      </div>

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
                <h2 className="text-base font-bold text-white">Change Password</h2>
                <p className="text-xs text-neutral-400">Update your account login password securely</p>
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
                <label className="text-xs font-semibold text-neutral-300">Old Password</label>
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
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Card 2: Language Preference */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">System Language</h2>
                <p className="text-xs text-neutral-400">Set default response language mode</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-950/50"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-neutral-100">English</div>
                  <div className="text-xs text-neutral-400">Standard English responses</div>
                </div>
                {language === "en" && <Check className="w-5 h-5 text-purple-400" />}
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("hinglish")}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  language === "hinglish"
                    ? "bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-950/50"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-neutral-100">Hinglish</div>
                  <div className="text-xs text-neutral-400">Hindi + English conversational style</div>
                </div>
                {language === "hinglish" && <Check className="w-5 h-5 text-purple-400" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Usage Analytics Card */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-400 shadow-sm">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">AI API Usage Analytics</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/50">
                  Live Log
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time API prompt calls, completions, & message volume metrics
              </p>
            </div>
          </div>

          {/* Filter Range Tabs */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs self-start sm:self-auto">
            {[
              { key: "today", label: "Today" },
              { key: "7days", label: "7 Days" },
              { key: "30days", label: "30 Days" },
              { key: "all", label: "All History" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRangeFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  rangeFilter === tab.key
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 space-y-1 relative overflow-hidden group">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Today Hits</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {loadingUsage ? "..." : usageData.todayCount}
            </div>
            <div className="text-[10px] text-purple-400 font-mono">Date: {usageData.today || "N/A"}</div>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Last 7 Days</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {loadingUsage ? "..." : usageData.history7DaysCount}
            </div>
            <div className="text-[10px] text-blue-400 font-mono">Rolling 7-Day sum</div>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">Last 30 Days</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {loadingUsage ? "..." : usageData.history30DaysCount}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Monthly total</div>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-4 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-semibold">All-Time Total</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {loadingUsage ? "..." : usageData.totalCount}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">Lifetime AI prompts</div>
          </div>
        </div>

        {/* Daily Breakdown Log Table / List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              Daily Execution Breakdown ({filteredHistory.length} Days)
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              Filtered: {rangeFilter.toUpperCase()}
            </span>
          </div>

          {loadingUsage ? (
            <div className="flex items-center justify-center py-10 text-neutral-500 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span>Loading usage logs...</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-2xl p-8 text-center text-xs text-neutral-500 space-y-1">
              <Filter className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
              <p className="font-semibold text-neutral-400">No AI usage recorded for this date range.</p>
              <p>Start roleplaying with AI characters to log prompt calls!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((item) => {
                const isToday = item.date === usageData.today;
                const percent = Math.round((item.count / maxCountInRange) * 100);
                const dateObj = new Date(item.date);
                const dateFormatted = dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={item.id}
                    className={`p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      isToday
                        ? "bg-purple-950/30 border-purple-500/40 shadow-sm"
                        : "bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isToday
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "bg-neutral-800 text-neutral-300"
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
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

                    {/* Progress Bar */}
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
    </div>
  );
}
