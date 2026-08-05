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
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalBlogs: 0,
    totalUsers: 0,
    totalCreditsUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [charRes, blogRes, userRes] = await Promise.all([
        fetch("/api/admin/discover-characters"),
        fetch("/api/admin/blog"),
        fetch("/api/admin/users"),
      ]);

      let charList = [];
      let blogList = [];
      let userList = [];

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

      const totalCredits = userList.reduce((acc, u) => acc + (u.todayCount || 0), 0);

      setStats({
        totalCharacters: charList.length,
        totalBlogs: blogList.length,
        totalUsers: userList.length,
        totalCreditsUsed: totalCredits,
      });
    } catch (err) {
      console.error("Error loading dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <span className="text-xs font-mono text-slate-400">Loading Dashboard Metrics...</span>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-8">
      {/* Compact Header for Mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3.5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
            NextAiChat System Control • Real-Time Metrics
          </p>
        </div>
      </div>

      {/* Metrics Cards: Sleek 2x2 Grid on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Metric 1: Customers */}
        <Link
          href="/admin/customer"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-1.5 py-0.5 rounded-full border border-cyan-800/40">
              USERS
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">{stats.totalUsers}</p>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
            <span>Customers</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 2: Characters */}
        <Link
          href="/admin/discoverCharacter"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all group cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-purple-400 uppercase tracking-wider bg-purple-950/60 px-1.5 py-0.5 rounded-full border border-purple-800/40">
              CHARS
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">{stats.totalCharacters}</p>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
            <span>Characters</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 3: Blog Articles */}
        <Link
          href="/admin/blog"
          className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-800/40">
              BLOGS
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">{stats.totalBlogs}</p>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400">
            <span>Posts</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Metric 4: Daily Credit Usage */}
        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase tracking-wider bg-amber-950/60 px-1.5 py-0.5 rounded-full border border-amber-800/40">
              USAGE
            </span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-white mb-0.5 sm:mb-1">{stats.totalCreditsUsed}</p>
          <p className="text-[10px] sm:text-xs text-slate-400">Today Credits</p>
        </div>
      </div>

      {/* Quick Navigation Sections: Compact Cards on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        {/* Customer Management Card */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 sm:space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] sm:text-xs font-bold mb-1 sm:mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>/admin/customer</span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-white mb-0.5 sm:mb-1">
              Customer Management
            </h3>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              Inspect registered users, manage daily credit usage limits, reset daily credits, and set custom tier access.
            </p>
          </div>
          <Link
            href="/admin/customer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            <span>Manage Customers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Blog Management Card */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 sm:space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] sm:text-xs font-bold mb-1 sm:mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>/admin/blog</span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-white mb-0.5 sm:mb-1">
              Blog Article Manager
            </h3>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              Create, edit, publish, and delete blog articles. SEO content management with full markdown preview.
            </p>
          </div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <span>Manage Blogs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Discover Character Card */}
        <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 sm:space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[11px] sm:text-xs font-bold mb-1 sm:mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>/admin/discoverCharacter</span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-white mb-0.5 sm:mb-1">
              Discover Characters
            </h3>
            <p className="hidden sm:block text-xs text-slate-400 leading-relaxed">
              Add new roleplay AI characters, configure personas, assign category badges, and set public visibility.
            </p>
          </div>
          <Link
            href="/admin/discoverCharacter"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
          >
            <span>Manage Characters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
