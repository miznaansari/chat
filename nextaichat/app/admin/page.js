"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
  Activity,
  ArrowRight,
  RefreshCw,
  Clock,
  Eye,
  Award,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  PieChart,
  Loader2,
  ChevronRight,
  Flame,
  Globe,
  Check,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalBlogs: 0,
    totalUsers: 0,
    totalCreditsUsed: 0,
    totalAllTimeCredits: 0,
    totalBlogViews: 0,
    totalChatsCount: 0,
    googleUsers: 0,
    credentialUsers: 0,
    limitReachedUsers: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
  });

  const [topBlogs, setTopBlogs] = useState([]);
  const [topCharacters, setTopCharacters] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [healthInfo, setHealthInfo] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Polling mechanism every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchDashboardData = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const [charRes, blogRes, userRes, healthRes] = await Promise.all([
        fetch("/api/admin/discover-characters"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/users"),
        fetch("/api/admin/health"),
      ]);

      let charList = [];
      let blogList = [];
      let userList = [];
      let healthData = null;

      if (charRes.ok) {
        const charData = await charRes.json();
        charList = charData.characters || [];
      }
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        blogList = blogData.blogs || [];
      }
      if (userRes.ok) {
        const userData = await userRes.json();
        userList = userData.users || [];
      }
      if (healthRes.ok) {
        healthData = await healthRes.json();
        setHealthInfo(healthData);
      }

      // Compute User Analytics
      const totalTodayCredits = userList.reduce((acc, u) => acc + (u.todayCount || 0), 0);
      const totalAllTimeCredits = userList.reduce((acc, u) => acc + (u.totalCount || 0), 0);
      const googleUsers = userList.filter((u) => u.authProvider === "google").length;
      const credentialUsers = userList.filter((u) => u.authProvider !== "google").length;
      const limitReachedUsers = userList.filter(
        (u) => (u.todayCount || 0) >= (u.dailyLimit || 100)
      ).length;

      // Compute Blog Analytics & Top Viewed
      const totalBlogViews = blogList.reduce((acc, b) => acc + (b.views || 0), 0);
      const publishedBlogs = blogList.filter((b) => b.published !== false).length;
      const draftBlogs = blogList.filter((b) => b.published === false).length;
      const sortedBlogs = [...blogList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

      // Compute Discover Character Analytics & Most Used (Show all >0 usage, scrollable)
      const getCharUsage = (c) => (c._count?.chatSessions !== undefined ? c._count.chatSessions : (c.chatsCount || 0));

      const totalChatsCount = charList.reduce((acc, c) => acc + getCharUsage(c), 0);
      const charactersWithUsage = charList.filter((c) => getCharUsage(c) > 0);
      const charsToDisplay = charactersWithUsage.length > 0 ? charactersWithUsage : charList;
      const sortedChars = [...charsToDisplay].sort((a, b) => getCharUsage(b) - getCharUsage(a));

      // Category breakdown for Characters
      const categoryMap = {};
      charList.forEach((c) => {
        const cat = c.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + getCharUsage(c);
      });
      const catList = Object.entries(categoryMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      setStats({
        totalCharacters: charList.length,
        totalBlogs: blogList.length,
        totalUsers: userList.length,
        totalCreditsUsed: totalTodayCredits,
        totalAllTimeCredits,
        totalBlogViews,
        totalChatsCount,
        googleUsers,
        credentialUsers,
        limitReachedUsers,
        publishedBlogs,
        draftBlogs,
      });

      setTopBlogs(sortedBlogs);
      setTopCharacters(sortedChars);
      setCategoryStats(catList);
    } catch (err) {
      console.error("Error loading dashboard metrics", err);
    } finally {
      if (!isBackground) {
        setRefreshing(false);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-white">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <span className="text-sm font-mono text-slate-400 tracking-wider">Loading System Analytics Dashboard...</span>
      </div>
    );
  }

  const maxBlogViews = topBlogs[0]?.views || 1;
  const maxCharChats = topCharacters[0] ? (topCharacters[0]._count?.chatSessions !== undefined ? topCharacters[0]._count.chatSessions : (topCharacters[0].chatsCount || 0)) : 1;

  return (
    <div className="p-3.5 sm:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-8">
      {/* Header Bar Actions */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-slate-800 pb-3.5 sm:pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <h1 className="text-base sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 truncate">
              <span>Admin <span className="hidden sm:inline">Control & </span>Analytics Dashboard</span>
            </h1>
          </div>
          <p className="hidden md:block text-xs text-slate-400 font-mono truncate">
            NextAiChat Live Metrics • Polling System Active (5s Interval)
          </p>
        </div>

        {/* Polling & Manual Refresh Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => fetchDashboardData()}
            disabled={refreshing}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Metrics Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              autoRefresh
                ? "bg-cyan-950/80 border-cyan-600/80 text-cyan-300 shadow-sm"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            <span>Auto <span className="hidden sm:inline">refresh</span> (5s)</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
        {/* Card 1: Registered Customers */}
        <Link
          href="/admin/customer"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-1.5 sm:px-2 py-0.5 rounded-full">
                CUSTOMERS
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-mono">{stats.totalUsers}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Total User Accounts</p>
          </div>
          <div className="pt-2 sm:pt-3 border-t border-slate-800/80 mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span>{stats.googleUsers} Google SSO</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Blog Article Views */}
        <Link
          href="/admin/blog"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full">
                BLOG VIEWS
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-mono">{stats.totalBlogViews.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{stats.totalBlogs} Total Posts ({stats.publishedBlogs} Live)</p>
          </div>
          <div className="pt-2 sm:pt-3 border-t border-slate-800/80 mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span>{stats.totalBlogs ? (stats.totalBlogViews / stats.totalBlogs).toFixed(0) : 0} avg views/post</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Discover Characters & Chats */}
        <Link
          href="/admin/discoverCharacter"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800 px-1.5 sm:px-2 py-0.5 rounded-full">
                ROLEPLAY CHATS
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-mono">{stats.totalChatsCount.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{stats.totalCharacters} Discover Characters</p>
          </div>
          <div className="pt-2 sm:pt-3 border-t border-slate-800/80 mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span>Explore Characters</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Daily Credit Usage */}
        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 sm:px-2 py-0.5 rounded-full">
                TODAY USAGE
              </span>
            </div>
            <p className="text-xl sm:text-3xl font-black text-white font-mono">{stats.totalCreditsUsed.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">All-Time: {stats.totalAllTimeCredits.toLocaleString()} credits</p>
          </div>
          <div className="pt-2 sm:pt-3 border-t border-slate-800/80 mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
            <span className="text-rose-400 font-bold">{stats.limitReachedUsers} Maxed Users</span>
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* System Health & User Authentication Cards (Moved Up) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Auth Provider Split Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800/90 space-y-2.5 sm:space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 sm:pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>User Authentication Split</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total: {stats.totalUsers}</span>
          </div>

          <div className="space-y-2 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Google SSO Users
              </span>
              <span className="font-bold text-white">{stats.googleUsers} ({stats.totalUsers ? Math.round((stats.googleUsers / stats.totalUsers) * 100) : 0}%)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Credentials (Email/Password)
              </span>
              <span className="font-bold text-white">{stats.credentialUsers} ({stats.totalUsers ? Math.round((stats.credentialUsers / stats.totalUsers) * 100) : 0}%)</span>
            </div>

            {/* Split Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${stats.totalUsers ? (stats.googleUsers / stats.totalUsers) * 100 : 50}%` }}
                className="bg-blue-500 h-full"
              />
              <div
                style={{ width: `${stats.totalUsers ? (stats.credentialUsers / stats.totalUsers) * 100 : 50}%` }}
                className="bg-slate-600 h-full"
              />
            </div>
          </div>
        </div>

        {/* Live System Health & Rate Queue Card */}
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800/90 space-y-2.5 sm:space-y-3 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 sm:pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
              <Activity className="w-4 h-4" />
              <span>System Rate & Uptime Health</span>
            </div>
            <Link
              href="/admin/health"
              className="text-[10px] sm:text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-0.5 sm:gap-1"
            >
              <span>/admin/health</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono">
            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block">Process Uptime</span>
              <span className="text-emerald-300 font-bold text-xs sm:text-sm">{healthInfo?.formattedUptime || "0s"}</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block">Active In Last 60s</span>
              <span className="text-cyan-300 font-bold text-xs sm:text-sm">{healthInfo?.rateQueue?.activeInLastMin || 0} / {healthInfo?.rateQueue?.maxLimit || 15}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Analytics 1: Most Used Discover Characters Leaderboard */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Most Used Discover Characters</span>
                  <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300">
                    {topCharacters.length} active
                  </span>
                </h3>
                <p className="hidden md:block text-[11px] text-slate-400 font-mono">Ranked by total user roleplay chats started (&gt;0 usage)</p>
              </div>
            </div>
            <Link
              href="/admin/discoverCharacter"
              className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 sm:gap-1 font-mono"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topCharacters.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No characters found</div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1.5">
              {topCharacters.map((char, index) => {
                const charSessionsCount = char._count?.chatSessions !== undefined ? char._count.chatSessions : (char.chatsCount || 0);
                const pct = Math.min(100, Math.round((charSessionsCount / maxCharChats) * 100));
                return (
                  <div key={char.id} className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl sm:rounded-2xl border border-slate-800/80 space-y-2 hover:bg-slate-900/90 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-bold font-mono shrink-0 ${
                          index === 0 ? "bg-amber-400 text-slate-950" : index === 1 ? "bg-slate-300 text-slate-950" : index === 2 ? "bg-amber-700 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          #{index + 1}
                        </span>
                        <img
                          src={char.avatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                          alt={char.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate text-xs">{char.name}</span>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block truncate">{char.category} • ⭐ {char.rating || "4.9"}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <span className="font-bold text-purple-300 text-xs">{charSessionsCount}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 block">sessions</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(6, pct)}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Category Breakdown Chips */}
          {categoryStats.length > 0 && (
            <div className="pt-2.5 sm:pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Usage By Category</span>
              <div className="grid grid-cols-2 gap-2">
                {categoryStats.slice(0, 4).map((cat) => (
                  <div key={cat.category} className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-mono">
                    <span className="text-slate-300 truncate">{cat.category}</span>
                    <span className="text-purple-400 font-bold">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analytics 2: Full Blog Views & Top Posts */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Blog Article Views Analytics</h3>
                <p className="hidden md:block text-[11px] text-slate-400 font-mono">Full reader engagement & top viewed articles</p>
              </div>
            </div>
            <Link
              href="/admin/blog"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 sm:gap-1 font-mono"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Blog Stat Summary Chips */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block">Total</span>
              <span className="text-emerald-300 font-bold text-xs sm:text-sm">{stats.totalBlogViews.toLocaleString()}</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block">Live</span>
              <span className="text-cyan-300 font-bold text-xs sm:text-sm">{stats.publishedBlogs}</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase block">Drafts</span>
              <span className="text-slate-400 font-bold text-xs sm:text-sm">{stats.draftBlogs}</span>
            </div>
          </div>

          {topBlogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No blog posts found</div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {topBlogs.map((blog, index) => {
                const pct = Math.min(100, Math.round(((blog.views || 0) / maxBlogViews) * 100));
                return (
                  <div key={blog.id} className="p-2.5 sm:p-3 bg-slate-900/60 rounded-xl sm:rounded-2xl border border-slate-800/80 space-y-2 hover:bg-slate-900/90 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md sm:rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-bold font-mono shrink-0 ${
                          index === 0 ? "bg-amber-400 text-slate-950" : index === 1 ? "bg-slate-300 text-slate-950" : index === 2 ? "bg-amber-700 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          #{index + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate text-xs">{blog.title}</span>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block truncate">{blog.category || "Education"} • {blog.author}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono">
                        <span className="font-bold text-emerald-300 text-xs">{(blog.views || 0).toLocaleString()}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 block">views</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(6, pct)}%` }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                      />
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
