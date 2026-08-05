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
  User,
  Plus,
  Trash2,
  Edit3,
  Star,
  X,
  UserCheck,
  UserPlus,
  Mail,
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
  const [activeTab, setActiveTab] = useState("all"); // "all" | "personas" | "credits" | "password" | "language"

  // AI API Usage Analytics State
  const [usageData, setUsageData] = useState({
    today: "",
    todayCount: 0,
    dailyLimit: 100,
    remainingCredits: 100,
    isLimitReached: false,
    totalCount: 0,
    history7DaysCount: 0,
    history30DaysCount: 0,
    history: [],
  });
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [rangeFilter, setRangeFilter] = useState("today");

  // User Personas ("Me" Persona) State
  const [personas, setPersonas] = useState([]);
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null); // null for create, object for edit
  const [personaForm, setPersonaForm] = useState({
    name: "",
    persona: "",
    avatar: "",
    isDefault: false,
  });
  const [savingPersona, setSavingPersona] = useState(false);
  const [optimizingPersona, setOptimizingPersona] = useState(false);
  const [personaStatus, setPersonaStatus] = useState({ type: null, message: "" });

  useEffect(() => {
    fetchAiUsage();
    fetchPersonas();
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

  const fetchPersonas = async () => {
    try {
      setLoadingPersonas(true);
      const res = await fetch("/api/user/personas");
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas || []);
      }
    } catch (err) {
      console.error("Failed to fetch personas", err);
    } finally {
      setLoadingPersonas(false);
    }
  };

  const handleOpenCreatePersona = () => {
    setEditingPersona(null);
    setPersonaForm({
      name: "",
      persona: "",
      avatar: "",
      isDefault: personas.length === 0,
    });
    setPersonaStatus({ type: null, message: "" });
    setPersonaModalOpen(true);
  };

  const handleOpenEditPersona = (p) => {
    setEditingPersona(p);
    setPersonaForm({
      name: p.name || "",
      persona: p.persona || "",
      avatar: p.avatar || "",
      isDefault: Boolean(p.isDefault),
    });
    setPersonaStatus({ type: null, message: "" });
    setPersonaModalOpen(true);
  };

  const handleSavePersona = async (e) => {
    e.preventDefault();
    setPersonaStatus({ type: null, message: "" });

    if (!personaForm.name.trim()) {
      setPersonaStatus({ type: "error", message: "Persona name is required." });
      return;
    }
    if (!personaForm.persona.trim()) {
      setPersonaStatus({ type: "error", message: "Persona description is required." });
      return;
    }

    setSavingPersona(true);

    try {
      const isEdit = Boolean(editingPersona);
      const url = isEdit
        ? `/api/user/personas/${editingPersona.id}`
        : "/api/user/personas";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personaForm),
      });

      const data = await res.json();
      if (!res.ok) {
        setPersonaStatus({ type: "error", message: data.error || "Failed to save persona." });
      } else {
        setPersonaModalOpen(false);
        fetchPersonas();
      }
    } catch (err) {
      setPersonaStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setSavingPersona(false);
    }
  };

  const handleDeletePersona = async (id) => {
    if (!confirm("Are you sure you want to delete this 'Me Persona'?")) return;

    try {
      const res = await fetch(`/api/user/personas/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPersonas();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete persona.");
      }
    } catch (err) {
      alert("Error deleting persona: " + err.message);
    }
  };

  const handleSetDefaultPersona = async (id) => {
    try {
      const res = await fetch(`/api/user/personas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        fetchPersonas();
      }
    } catch (err) {
      console.error("Failed to set default persona", err);
    }
  };

  const handleOptimizePersonaText = async () => {
    if (!personaForm.persona.trim()) return;
    setOptimizingPersona(true);
    try {
      const res = await fetch("/api/characters/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: personaForm.persona, type: "persona" }),
      });
      const data = await res.json();
      if (res.ok && data.optimizedText) {
        setPersonaForm((prev) => ({ ...prev, persona: data.optimizedText }));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ai-usage-updated"));
        }
      } else {
        alert("Failed to optimize: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error optimizing text: " + err.message);
    } finally {
      setOptimizingPersona(false);
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

  const sortedPersonas = useMemo(() => {
    return [...personas].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
  }, [personas]);

  const activeDefaultPersona = useMemo(() => {
    return personas.find((p) => p.isDefault) || personas[0] || null;
  }, [personas]);

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
    <div className="flex-1 overflow-y-auto p-2 pb-28 sm:p-6 sm:pb-16 md:p-10 md:pb-12 space-y-8 select-text">
      {/* Page Title */}
      <div className="space-y-1 pt-2">
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          <span className="sm:hidden">Manage account security, personas, credits & language.</span>
          <span className="hidden sm:inline">Manage your account security credentials, personal AI profiles ("Me Persona"), daily credit limits, and language preferences.</span>
        </p>
      </div>

      {/* Mobile Category Scroll Pills (< md) */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800/80 no-scrollbar">
        {[
          { id: "all", label: "All Settings", icon: Sparkles },
          { id: "personas", label: "User Personas", icon: User, count: personas.length },
          { id: "credits", label: "Gemini Credits", icon: Zap, count: `${usageData.todayCount}/${usageData.dailyLimit || 100}` },
          { id: "password", label: "Change Password", icon: KeyRound },
          { id: "language", label: "System Language", icon: Globe, count: language.toUpperCase() },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${isActive
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-950"
                : "bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-950 text-neutral-400 border border-neutral-800"
                    }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Split Layout for md and md+ Desktop/Tablet Screens */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* Col 1: Left Options Navigation Sidebar (md+) */}
        <div className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-3.5 shadow-xl backdrop-blur-md space-y-2 sticky top-6">
          <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 border-b border-neutral-800/80 mb-1">
            Setting Options
          </div>
          {[
            { id: "all", label: "All Settings", desc: "Complete overview of all options", icon: Sparkles },
            { id: "personas", label: "User Personas", desc: "Me Persona profiles for roleplay", icon: User, count: personas.length },
            { id: "credits", label: "Gemini Credits", desc: "Daily limit & usage log", icon: Zap, count: `${usageData.todayCount}/${usageData.dailyLimit || 100}` },
            { id: "password", label: "Change Password", desc: "Security & credentials", icon: KeyRound },
            { id: "language", label: "System Language", desc: "English & Hinglish modes", icon: Globe, count: language.toUpperCase() },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer border group ${isActive
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white border-purple-400 shadow-lg shadow-purple-950/60"
                  : "bg-neutral-950/60 text-neutral-400 hover:text-white border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl border shrink-0 transition-colors ${isActive
                      ? "bg-white/20 border-white/30 text-white"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 group-hover:text-purple-400 group-hover:border-purple-500/30"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs sm:text-sm truncate">{tab.label}</div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? "text-purple-200 font-medium" : "text-neutral-500"}`}>
                      {tab.desc}
                    </div>
                  </div>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                      }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Col 2: Right Selected Content Area */}
        <div className="flex-1 w-full space-y-6 sm:space-y-8 min-w-0">

          {/* Section 1: My User Personas ("Me" Persona) */}
          {(activeTab === "all" || activeTab === "personas") && (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-2 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">My User Personas ("Me Persona")</h2>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/50">
                        {personas.length} Saved
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Define your name, backstory & role to improve AI roleplay quality and personalized responses
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreatePersona}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer self-start sm:self-auto"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create New Persona</span>
                </button>
              </div>

              {loadingPersonas ? (
                <div className="flex items-center justify-center py-10 text-neutral-500 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span>Loading user personas...</span>
                </div>
              ) : sortedPersonas.length === 0 ? (
                <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-2xl p-8 text-center text-xs text-neutral-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/50 border border-blue-800/40 text-blue-400 flex items-center justify-center mx-auto">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm">No "Me Persona" Created Yet</p>
                    <p className="text-neutral-400 max-w-md mx-auto">
                      Creating a User Persona tells AI characters who you are (your name, backstory, job, or personality), dramatically improving roleplay immersion and accuracy!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreatePersona}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Persona</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active Default Persona Quick Selector Banner */}
                  <div className="bg-neutral-950/90 border border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/50 text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                        {activeDefaultPersona?.avatar ? (
                          <span>{activeDefaultPersona.avatar}</span>
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-current text-amber-300" /> Active Default
                          </span>
                          <h3 className="font-extrabold text-white text-sm sm:text-base">
                            {activeDefaultPersona?.name}
                          </h3>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5 max-w-xl">
                          {activeDefaultPersona?.persona}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                      <label className="text-xs font-semibold text-neutral-400 hidden md:inline">Select Active Default:</label>
                      <select
                        value={activeDefaultPersona?.id || ""}
                        onChange={(e) => handleSetDefaultPersona(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer hover:border-blue-500/50 transition-colors"
                      >
                        {sortedPersonas.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.isDefault ? "★ " : ""}{p.name} {p.isDefault ? "(Active Default)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Persona Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedPersonas.map((p) => (
                      <div
                        key={p.id}
                        className={`bg-neutral-950 border rounded-2xl p-5 space-y-4 relative transition-all group flex flex-col justify-between ${p.isDefault
                          ? "border-blue-500/80 shadow-lg shadow-blue-950/50 bg-gradient-to-b from-blue-950/25 to-neutral-950"
                          : "border-neutral-800/90 hover:border-neutral-700"
                          }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-base shrink-0 overflow-hidden">
                                {p.avatar ? (
                                  <span className="text-xl">{p.avatar}</span>
                                ) : (
                                  <User className="w-5 h-5 text-blue-400" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                                  {p.isDefault && (
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-current text-amber-300" />
                                      <span>Default</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-500 font-mono block">
                                  Updated: {new Date(p.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Edit / Delete Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPersona(p)}
                                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                                title="Edit Persona"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePersona(p.id)}
                                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-red-950 hover:border-red-800 text-neutral-400 hover:text-red-400 transition-colors"
                                title="Delete Persona"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-300 line-clamp-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80 font-normal leading-relaxed">
                            {p.persona}
                          </p>
                        </div>

                        {/* Card Bottom: Default Selection Radio/Button */}
                        <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                          {p.isDefault ? (
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-400 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-500/50 shadow-xs">
                              <Check className="w-4 h-4 text-blue-400" />
                              <span>Active Default Persona</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultPersona(p.id)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                            >
                              <Star className="w-3.5 h-3.5 text-neutral-500 hover:text-amber-400" />
                              <span>Set as Default Persona</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Grid (Password & Language) */}
          {(activeTab === "all" || activeTab === "password" || activeTab === "language") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1: Change Password */}
              {(activeTab === "all" || activeTab === "password") && (
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
                        className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${status.type === "success"
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
              )}

              {/* Card 2: Language Preference */}
              {(activeTab === "all" || activeTab === "language") && (
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
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${language === "en"
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
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${language === "hinglish"
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
              )}
            </div>
          )}

          {/* AI Usage Analytics & Credit Allowance Card */}
          {(activeTab === "all" || activeTab === "credits") && (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-2 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-400 shadow-sm">
                    <Activity className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white tracking-tight">API Usage</h2>
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
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${rangeFilter === tab.key
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-neutral-400 hover:text-white"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Gemini Credit Allowance Card */}
              <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-purple-400">
                      <Zap className="w-6 h-6 text-amber-400 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">Daily Credits</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                          {usageData.dailyLimit || 100} Max / Day
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Each AI chat response consumes 1 daily credit. Auto-resets daily at 00:00 UTC.
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Admin Button */}
                  <Link
                    href="/contact"
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all cursor-pointer shrink-0 self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>Need More Credits? Contact Admin →</span>
                  </Link>
                </div>

                {/* Progress Bar & Stat Breakdown */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-neutral-300">Today's Credit Usage</span>
                    <span className="text-purple-300 font-mono font-bold">
                      {usageData.todayCount || 0} Used / {usageData.dailyLimit || 100} Daily Limit ({usageData.remainingCredits ?? 100} Left)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-900 h-3 rounded-full overflow-hidden border border-neutral-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${usageData.isLimitReached
                        ? "bg-gradient-to-r from-red-600 to-rose-500"
                        : ((usageData.todayCount || 0) / (usageData.dailyLimit || 100)) >= 0.7
                          ? "bg-gradient-to-r from-amber-500 to-orange-500"
                          : "bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400"
                        }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((usageData.todayCount || 0) / (usageData.dailyLimit || 100)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>0 Credits</span>
                    <span>
                      {Math.min(
                        100,
                        Math.round(((usageData.todayCount || 0) / (usageData.dailyLimit || 100)) * 100)
                      )}% Used
                    </span>
                    <span>{usageData.dailyLimit || 100} Daily Max</span>
                  </div>
                </div>

                {/* Request Limit Increase Info Box */}
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Want to increase your account limit? Admins can upgrade your custom daily limit.</span>
                  </div>
                  <Link
                    href="/contact"
                    className="text-purple-300 hover:text-white font-extrabold underline text-xs shrink-0 flex items-center gap-1"
                  >
                    <span>Contact Admin to Request Limit Increase</span>
                    <span>→</span>
                  </Link>
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
                          className={`p-3 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${isToday
                            ? "bg-purple-950/30 border-purple-500/40 shadow-sm"
                            : "bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${isToday
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
                                className={`h-full rounded-full transition-all duration-500 ${isToday
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
          )}
        </div>
      </div>

      {/* Modal for Creating / Editing Persona */}
      {personaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPersona ? "Edit 'Me Persona'" : "Create New 'Me Persona'"}
                  </h3>
                  <p className="text-xs text-neutral-400">Your profile persona sent to AI characters</p>
                </div>
              </div>
              <button
                onClick={() => setPersonaModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {personaStatus.message && (
              <div
                className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${personaStatus.type === "error"
                  ? "bg-red-950/70 border-red-800 text-red-300"
                  : "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                  }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{personaStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSavePersona} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Persona / User Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun / Alex / Detective Sam"
                  value={personaForm.name}
                  onChange={(e) => setPersonaForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Backstory, Bio & Role Details <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleOptimizePersonaText}
                    disabled={!personaForm.persona.trim() || optimizingPersona}
                    className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 px-2 py-0.5 rounded-lg transition-all disabled:opacity-40"
                  >
                    {optimizingPersona ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                        <span>Improving...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>✨ Improve with Gemini</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe yourself, your personality, background, role, or preferred conversation tone..."
                  value={personaForm.persona}
                  onChange={(e) => setPersonaForm((prev) => ({ ...prev, persona: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Avatar Emoji / Icon (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🦸‍♂️ / 👑 / 💻 / 🕵️‍♂️"
                  value={personaForm.avatar}
                  onChange={(e) => setPersonaForm((prev) => ({ ...prev, avatar: e.target.value }))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  checked={personaForm.isDefault}
                  onChange={(e) => setPersonaForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                  className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs text-neutral-300 font-medium cursor-pointer">
                  Set as my Default "Me Persona" for new chats
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setPersonaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPersona}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingPersona ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{editingPersona ? "Save Changes" : "Create Persona"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
