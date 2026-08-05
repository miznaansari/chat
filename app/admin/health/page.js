"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Clock,
  Server,
  Zap,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  LogOut,
  TrendingUp,
} from "lucide-react";

export default function AdminHealthPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (!autoRefresh || !admin) return;

    const interval = setInterval(() => {
      fetchHealthMetrics(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, admin]);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setAdmin(data.admin);
      fetchHealthMetrics();
    } catch (err) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthMetrics = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error("Failed to fetch health metrics:", err);
    } finally {
      if (!isBackground) setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const {
    status = "healthy",
    formattedUptime = "0s",
    rateQueue = { activeInLastMin: 0, maxLimit: 15, queuedCount: 0, isHighDemand: false },
    memory = { rssMb: 0, heapTotalMb: 0, heapUsedMb: 0 },
    recentMetrics = [],
  } = healthData || {};

  const maxHistoricalRequests = Math.max(
    ...recentMetrics.map((m) => m.requestCount || 0),
    rateQueue.maxLimit || 15
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="h-16 border-b border-purple-500/20 px-4 md:px-8 flex items-center justify-between bg-neutral-950/90 backdrop-blur-xl shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-base text-white tracking-tight flex items-center gap-2">
              <span>System Health & Rate Uptime</span>
              <span className="text-[10px] bg-purple-900/80 border border-purple-600/50 text-purple-300 font-mono px-2 py-0.5 rounded-full">
                /admin/health
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Logged in as {admin?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => fetchHealthMetrics()}
            disabled={refreshing}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
          </button>

          <Link
            href="/admin"
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 hover:text-white transition-colors cursor-pointer"
            title="Sign Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* System Health Status Banner */}
        <div
          className={`p-4 md:p-6 rounded-3xl border backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl ${
            status === "high_demand"
              ? "bg-amber-950/40 border-amber-500/50 text-amber-200"
              : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                status === "high_demand"
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                  : "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
              }`}
            >
              {status === "high_demand" ? (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wide text-white">
                  {status === "high_demand"
                    ? "System High Demand Active"
                    : "All Systems Operational"}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    status === "high_demand"
                      ? "bg-amber-900/80 border-amber-600 text-amber-300"
                      : "bg-emerald-900/80 border-emerald-600 text-emerald-300"
                  }`}
                >
                  {status === "high_demand" ? "High Traffic" : "Healthy"}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {status === "high_demand"
                  ? "Requests in the last 60 seconds have reached or exceeded the 15 req/min threshold. Rate queuing is actively protecting the Gemini API."
                  : "AI endpoints (/api/chat & /api/feature/turn) are running smoothly within rate limits."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                autoRefresh
                  ? "bg-purple-950/80 border-purple-600/80 text-purple-300 shadow-sm"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
              <span>Auto-refresh (5s)</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Hero Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Requests Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Requests (Last 60s)
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">
                {rateQueue.activeInLastMin}{" "}
                <span className="text-xs text-neutral-500 font-normal">
                  / {rateQueue.maxLimit} max
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Sliding 60-second request window count
              </p>
            </div>
          </div>

          {/* Queued Requests Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Queued Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {rateQueue.queuedCount}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Requests currently waiting in FIFO queue
              </p>
            </div>
          </div>

          {/* System Uptime Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Server Uptime
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-300 font-mono">
                {formattedUptime}
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Node.js process continuous runtime
              </p>
            </div>
          </div>

          {/* Memory Usage Card */}
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Heap Memory
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-purple-300 font-mono">
                {memory.heapUsedMb} <span className="text-xs text-neutral-400 font-normal">MB</span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Heap Total: {memory.heapTotalMb} MB (RSS: {memory.rssMb} MB)
              </p>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph for Recent Minutes */}
        <div className="bg-neutral-900/80 border border-neutral-800 p-5 md:p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">
                Request Volume Timeline (Last 60 Minutes)
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              Total Recorded Minutes: {recentMetrics.length}
            </span>
          </div>

          {recentMetrics.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              No minute request metrics recorded yet. Metrics will populate automatically as users send messages!
            </div>
          ) : (
            <div className="space-y-3">
              {/* Bar Visualizer */}
              <div className="h-28 flex items-end gap-1.5 pt-4 px-2 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-x-auto">
                {recentMetrics.map((m) => {
                  const pct = Math.min(
                    100,
                    Math.round((m.requestCount / maxHistoricalRequests) * 100)
                  );
                  const isHigh = m.requestCount >= rateQueue.maxLimit || m.queuedCount > 0;
                  return (
                    <div
                      key={m.id || m.minuteBucket}
                      className="flex-1 min-w-[12px] flex flex-col items-center gap-1 group relative cursor-pointer"
                      title={`${m.minuteBucket} - Requests: ${m.requestCount}, Queued: ${m.queuedCount}`}
                    >
                      <div
                        style={{ height: `${Math.max(8, pct)}%` }}
                        className={`w-full rounded-t transition-all ${
                          isHigh
                            ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            : "bg-gradient-to-t from-purple-600 to-indigo-400"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] tracking-wider border-b border-neutral-800">
                    <tr>
                      <th className="p-3 px-4">Time Bucket (UTC)</th>
                      <th className="p-3 px-4">Requests Received</th>
                      <th className="p-3 px-4">Requests Queued</th>
                      <th className="p-3 px-4">Traffic State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {[...recentMetrics].reverse().map((m) => (
                      <tr key={m.id || m.minuteBucket} className="hover:bg-neutral-800/40">
                        <td className="p-3 px-4 text-white font-bold">{m.minuteBucket}</td>
                        <td className="p-3 px-4 text-purple-300 font-bold">{m.requestCount}</td>
                        <td className="p-3 px-4 text-amber-300">{m.queuedCount}</td>
                        <td className="p-3 px-4">
                          {m.requestCount >= rateQueue.maxLimit || m.queuedCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/80 text-amber-300 text-[10px] font-bold">
                              High Demand
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 text-[10px] font-bold">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
