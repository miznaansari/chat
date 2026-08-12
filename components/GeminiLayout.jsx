"use client";

import { useState, useEffect, useRef } from "react";
import Tooltip from "@/components/Tooltip";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sparkles,
  SquarePen,
  MessageSquare,
  Trash2,
  LogOut,
  ChevronDown,
  X,
  Settings,
  CheckSquare,
  Home,
  UserPlus,
  Compass,
  Heart,
  User,
  History,
  AlertTriangle,
  UserCheck,
  Loader2,
  Zap,
} from "lucide-react";


export default function GeminiLayout({
  user,
  chats = [],
  activeChatId,
  activeChat,
  viewMode = "home",
  onSelectHome,
  onUpdateChat,
  onSelectChat,
  onNewChat = () => { },
  onDeleteChat,
  onBatchDeleteChats,
  onLogout,
  children,
}) {
  const pathname = usePathname();
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState(new Set());

  // Daily Gemini Usage Limit State
  const [usageLimitData, setUsageLimitData] = useState({
    todayCount: 0,
    dailyLimit: 100,
    remainingCredits: 100,
    isLimitReached: false,
  });

  // High Demand / Rate Queue Warning State
  const [isHighDemand, setIsHighDemand] = useState(false);

  useEffect(() => {
    let dismissTimer = null;
    const handleHighDemandEvent = (e) => {
      if (typeof e.detail?.active === "boolean") {
        setIsHighDemand(e.detail.active);
        if (e.detail.active) {
          clearTimeout(dismissTimer);
          dismissTimer = setTimeout(() => {
            setIsHighDemand(false);
          }, 15000);
        }
      }
    };
    window.addEventListener("ai-high-demand", handleHighDemandEvent);
    return () => {
      window.removeEventListener("ai-high-demand", handleHighDemandEvent);
      clearTimeout(dismissTimer);
    };
  }, []);

  useEffect(() => {
    fetchUsageData();

    const handleUsageUpdated = () => {
      fetchUsageData();
    };

    window.addEventListener("ai-usage-updated", handleUsageUpdated);
    return () => {
      window.removeEventListener("ai-usage-updated", handleUsageUpdated);
    };
  }, [pathname, activeChatId]);

  const fetchUsageData = async () => {
    try {
      const res = await fetch("/api/user/usage");
      if (res.ok) {
        const data = await res.json();
        setUsageLimitData(data);
      }
    } catch (err) {
      console.error("Failed to fetch user usage limit data", err);
    }
  };

  const isHomeActive = pathname === "/" && viewMode === "home";
  const isAddCharActive = pathname === "/character/add";
  const isHistoryActive = pathname === "/" && viewMode === "chat";
  const isSettingActive = pathname === "/setting" || pathname === "/settings";

  const toggleSelectChat = (id) => {
    setSelectedChatIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedChatIds.size === chats.length) {
      setSelectedChatIds(new Set());
    } else {
      setSelectedChatIds(new Set(chats.map((c) => c.id)));
    }
  };

  const handleBatchDeleteClick = () => {
    if (selectedChatIds.size === 0) return;
    if (onBatchDeleteChats) {
      onBatchDeleteChats(Array.from(selectedChatIds));
      setSelectedChatIds(new Set());
      setIsBatchMode(false);
    }
  };
  // Synchronously initialize desktop sidebar state from localStorage on frame 0
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gemini_sidebar_open");
        if (saved !== null) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to read sidebar state from localStorage", e);
      }
    }
    return true;
  });

  const [mobileOpen, setMobileOpen] = useState(false); // Mobile default CLOSED (no refresh flash)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    setMobileOpen(false);
    try {
      if (onLogout) {
        await onLogout();
      }
    } catch (err) {
      console.error("Logout error", err);
      setIsLoggingOut(false);
    }
  };

  const getModelDisplayName = (modelId) => {
    if (modelId === "gemini-3.1-flash-lite") return "Gemini 3.1 Flash Lite";
    return "Gemini 3.5 Flash Lite";
  };

  const [activeModelName, setActiveModelName] = useState(() =>
    getModelDisplayName(activeChat?.selectedModel)
  );
  const modelDropdownRef = useRef(null);

  // Synchronize dropdown title with activeChat.selectedModel
  useEffect(() => {
    if (activeChat?.selectedModel) {
      setActiveModelName(getModelDisplayName(activeChat.selectedModel));
    }
  }, [activeChat?.selectedModel]);

  const handleModelChange = async (modelId) => {
    const displayName = getModelDisplayName(modelId);
    setActiveModelName(displayName);
    setModelDropdownOpen(false);

    if (!activeChatId) return;

    try {
      const res = await fetch(`/api/chats/${activeChatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel: modelId }),
      });

      const data = await res.json();
      if (res.ok && data.chatSession && onUpdateChat) {
        onUpdateChat(data.chatSession);
      }
    } catch (e) {
      console.error("Failed to update selected model:", e);
    }
  };

  // Close model dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        modelDropdownOpen &&
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(e.target)
      ) {
        setModelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [modelDropdownOpen]);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => {
        const nextState = !prev;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("gemini_sidebar_open", JSON.stringify(nextState));
          } catch (e) {
            console.error("Failed to save sidebar state to localStorage", e);
          }
        }
        return nextState;
      });
    }
  };

  const handleSelectChatMobile = (id) => {
    onSelectChat(id);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-[100dvh] w-full fixed inset-0 bg-[#030712] text-neutral-100 overflow-hidden overscroll-none font-sans bg-antigravity-grid relative">
      {/* Full-Screen Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-2xl shadow-red-900/40">
            <Loader2 className="w-8 h-8 animate-spin text-red-400" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-white tracking-wide">Signing Out...</h3>
            <p className="text-xs text-neutral-400">Securing your session and redirecting</p>
          </div>
        </div>
      )}

      {/* GENZ / ALPHA VIBRANT AMBIENT MESH GLOWS (MATCHING HOME DISCOVERY VIEW) */}
      <div className="fixed top-[-10%] left-[-5%] w-[650px] h-[650px] bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-transparent rounded-full blur-3xl opacity-50 transform-gpu animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/30 via-indigo-600/20 to-transparent rounded-full blur-3xl opacity-50 transform-gpu animate-pulse-glow pointer-events-none z-0" />
      <div className="fixed top-[35%] right-[10%] w-[450px] h-[450px] bg-gradient-to-tr from-rose-600/20 via-purple-900/10 to-transparent rounded-full blur-3xl opacity-40 transform-gpu pointer-events-none z-0" />

      {/* Floating Physics Particles */}
      <div className="fixed top-1/4 left-10 w-28 h-28 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md animate-float-slow pointer-events-none hidden md:block z-0 shadow-[0_0_30px_rgba(168,85,247,0.2)]" />
      <div className="fixed bottom-1/4 right-12 w-36 h-36 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md animate-float-reverse pointer-events-none hidden md:block z-0 shadow-[0_0_30px_rgba(6,182,212,0.2)]" />

      {/* Orbit Rings Centered */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-purple-500/20 animate-orbit pointer-events-none hidden lg:block z-0">
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_15px_#a855f7]" />
      </div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-cyan-500/20 animate-orbit-reverse pointer-events-none hidden lg:block z-0">
        <div className="absolute bottom-0 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
      </div>


      {/* Mobile Backdrop Overlay (Always in DOM for instant rendering, smooth hardware transition) */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity duration-200 ease-out ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col h-full bg-neutral-950/95 md:bg-neutral-950/40 md:backdrop-blur-xl border-r border-purple-500/20 transition-transform md:transition-[width,transform] duration-200 ease-out shrink-0 overscroll-none will-change-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${sidebarOpen ? "w-72 md:w-72 shadow-2xl md:shadow-none" : "w-72 md:w-16"}`}
      >


        {/* Sidebar Header */}
        <div className="h-14 px-3 flex items-center justify-between border-b border-neutral-800/50 shrink-0 touch-none select-none">
          <div className="flex items-center gap-2 min-w-0">
            <Tooltip content="Toggle Drawer Menu" position="right" badgeIcon="⚡">
              <button
                onClick={handleToggleSidebar}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors shrink-0 touch-manipulation cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </Tooltip>
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <img
                src="/logo-landspace.png"
                alt="NextAiChat Logo"
                className={`h-28 w-auto object-contain transition-[opacity,max-width] duration-200 origin-left ${!sidebarOpen ? "md:opacity-0 md:max-w-0 md:pointer-events-none" : "md:opacity-100 md:max-w-[140px]"}`}
              />
            </Link>
          </div>

          <Tooltip content="New Chat Session" position="bottom" badgeIcon="🎭">
            <button
              onClick={() => {
                onNewChat();
                setMobileOpen(false);
              }}
              className={`p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-[opacity,max-width,padding,colors] duration-200 ease-out shrink-0 ${!sidebarOpen ? "md:opacity-0 md:max-w-0 md:p-0 md:overflow-hidden md:pointer-events-none" : "md:opacity-100 md:max-w-[40px]"}`}
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        {/* Home & Discover Grid Button */}
        <div className="px-2 sm:px-3 pt-2 shrink-0">
          <Tooltip content="Home Character Showcase" position="right" badgeIcon="🏠" className="w-full">
            <button
              onClick={() => {
                if (onSelectHome) onSelectHome();
                setMobileOpen(false);
              }}
              className={`w-full font-medium py-2.5 px-3 rounded-xl flex items-center gap-3 justify-start transition-all duration-200 ease-out cursor-pointer touch-manipulation ${viewMode === "home"
                ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-md font-bold border border-purple-400"
                : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span
                className={`transition-[opacity,max-width] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen
                  ? "md:opacity-0 md:max-w-0 md:pointer-events-none"
                  : "md:opacity-100 md:max-w-[180px]"
                  }`}
              >
                Discover Characters
              </span>
            </button>
          </Tooltip>
        </div>

        {/* New Chat Button */}
        <div className="p-2 sm:p-3 shrink-0">
          <Tooltip content="Create Multi-Character Session" position="right" badgeIcon="🚀" className="w-full">
            <button
              onClick={() => {
                onNewChat();
                setMobileOpen(false);
              }}
              className="w-full bg-purple-950/40 hover:bg-purple-900/60 text-neutral-200 border border-purple-800/50 font-medium py-2.5 px-3 rounded-xl flex items-center gap-3 justify-start transition-colors duration-200 ease-out shadow-sm cursor-pointer touch-manipulation"
            >

              <SquarePen className="w-4 h-4 text-purple-400 shrink-0" />
              <span
                className={`transition-[opacity,max-width] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen
                  ? "md:opacity-0 md:max-w-0 md:pointer-events-none"
                  : "md:opacity-100 md:max-w-[180px]"
                  }`}
              >
                New Roleplay Chat
              </span>
            </button>
          </Tooltip>
        </div>


        {/* Recent Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className={`text-[11px] font-semibold text-neutral-500 uppercase tracking-wider transition-[opacity,max-width,height,padding] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen ? "md:opacity-0 md:max-w-0 md:h-0 md:py-0 md:pointer-events-none" : "md:opacity-100 md:max-w-[200px]"}`}>
              Recent Roleplays
            </span>

            {chats.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsBatchMode(!isBatchMode);
                  setSelectedChatIds(new Set());
                }}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${isBatchMode
                  ? "bg-purple-600 text-white border-purple-500 shadow-md"
                  : "bg-purple-950/60 text-purple-300 border-purple-800/60 hover:bg-purple-900/80 hover:text-white"
                  }`}
                title="Select chats for fast bulk deletion"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isBatchMode ? "Cancel" : "Select Fast"}</span>
              </button>
            )}
          </div>

          {/* Batch Selection Action Bar */}
          {isBatchMode && sidebarOpen && (
            <div className="mx-1 mb-2 p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-between gap-1 text-xs animate-in fade-in duration-150">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[11px] text-purple-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                {selectedChatIds.size === chats.length ? "Deselect All" : "Select All"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={selectedChatIds.size === 0}
                  onClick={handleBatchDeleteClick}
                  className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] flex items-center gap-1 disabled:opacity-40 transition-all cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Selected ({selectedChatIds.size})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBatchMode(false);
                    setSelectedChatIds(new Set());
                  }}
                  className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {chats.length === 0 ? (
            <div className={`px-3 py-4 text-center text-xs text-neutral-500 transition-[opacity,max-width,height,padding] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen ? "md:opacity-0 md:max-w-0 md:h-0 md:py-0 md:pointer-events-none" : "md:opacity-100 md:max-w-[200px]"}`}>
              No chat sessions yet. Create one to begin!
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const isSelected = selectedChatIds.has(chat.id);
              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    if (isBatchMode) {
                      toggleSelectChat(chat.id);
                    } else {
                      handleSelectChatMobile(chat.id);
                    }
                  }}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 ease-out justify-start touch-manipulation ${isSelected
                    ? "bg-purple-900/80 border border-purple-600 text-white font-medium shadow-sm"
                    : isActive
                      ? "bg-purple-950/60 border border-purple-800/60 text-white font-medium shadow-sm"
                      : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                    }`}
                  title={chat.title}
                >
                  {isBatchMode ? (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectChat(chat.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded accent-purple-600 cursor-pointer shrink-0"
                    />
                  ) : (
                    <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-purple-400" : "text-neutral-500"}`} />
                  )}

                  <div className={`flex-1 min-w-0 flex items-center justify-between gap-2 transition-[opacity,max-width] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen ? "md:opacity-0 md:max-w-0 md:pointer-events-none" : "md:opacity-100 md:max-w-[200px]"}`}>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate font-semibold text-neutral-200">
                        {chat.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate capitalize">
                        {chat.sessionCharacters?.map((c) => c.name).join(", ") || "Characters"}
                      </div>
                    </div>

                    {/* Delete Chat Button */}
                    {!isBatchMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="opacity-90 md:opacity-0 md:group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-700/60 rounded transition-[opacity,color,background-color] shrink-0"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 pb-16 md:pb-3 border-t border-neutral-800/80 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">

              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>

              <div className={`min-w-0 transition-[opacity,max-width] duration-200 ease-out whitespace-nowrap overflow-hidden origin-left ${!sidebarOpen ? "max-md:opacity-100 md:opacity-0 md:max-w-0 md:pointer-events-none" : "opacity-100 max-w-[140px]"}`}>
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-[10px] text-neutral-400">Authenticated</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Tooltip content="App Settings" position="top" badgeIcon="⚙️" className="hidden md:block">
                <Link
                  href="/setting"
                  className={`hidden md:flex p-1.5 text-neutral-400 hover:text-purple-400 hover:bg-neutral-800 rounded-lg transition-colors items-center justify-center cursor-pointer ${!sidebarOpen ? "max-md:opacity-100 md:opacity-0 md:max-w-0 md:p-0 md:overflow-hidden md:pointer-events-none" : "opacity-100 max-w-[40px]"
                    } ${isSettingActive ? "text-purple-400 bg-neutral-800" : ""}`}
                  title="App Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </Tooltip>

              <Tooltip content="Sign Out Account" position="right" badgeIcon="🔒">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogoutClick}
                  className={`p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-70 ${!sidebarOpen ? "max-md:opacity-100 md:opacity-0 md:max-w-0 md:p-0 md:overflow-hidden md:pointer-events-none" : "opacity-100 max-w-[40px]"}`}
                  title="Sign Out Account"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
            </div>

          </div>
        </div>


      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <header className="solid-fixed-header !z-50 h-14 border-b border-purple-500/20 px-3 md:px-6 flex items-center justify-between bg-neutral-950 select-none relative">
          {/* Header Left Navigation & View Pills */}
          <div className="flex items-center gap-2">
            {/* Toggle Drawer button for Mobile Header */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors md:hidden touch-manipulation cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo on Left */}
            <Link href="/" className="flex items-center md:hidden shrink-0">
              <img
                src="/logo-landspace.png"
                alt="NextAiChat Logo"
                className="h-20 w-auto object-contain max-w-[230px]"
              />
            </Link>

            {/* Desktop View Switcher Pills */}
            <div className="hidden sm:flex items-center bg-neutral-900/80 border border-neutral-800 rounded-full p-0.5 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => {
                  if (onSelectHome) onSelectHome();
                }}
                className={`px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${viewMode === "home"
                  ? "bg-purple-600 text-white shadow-sm font-bold"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Discovery</span>
              </button>

              {activeChat && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectChat) onSelectChat(activeChat.id);
                  }}
                  className={`px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${viewMode === "chat"
                    ? "bg-purple-600 text-white shadow-sm font-bold"
                    : "text-neutral-400 hover:text-white"
                    }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate max-w-[120px]">{activeChat.title}</span>
                </button>
              )}
              {/* Active Persona Indicator / Missing Persona Warning Pill */}
              {viewMode === "chat" && activeChat && (
                <div className="hidden md:flex items-center">
                  {activeChat.userPersonaName && activeChat.userPersonaDetails && activeChat.userPersonaDetails !== "Standard roleplay participant." ? (
                    <Tooltip content={`Roleplay Persona: ${activeChat.userPersonaName}`} position="bottom" badgeIcon="🎭">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-200 shadow-sm">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Playing as: <strong className="text-white font-extrabold">{activeChat.userPersonaName}</strong></span>
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip content="No custom 'Me Persona' attached. Character responses may be unpersonalized." position="bottom" badgeIcon="⚠️">
                      <Link
                        href="/setting"
                        className="flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 hover:bg-amber-900/90 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 transition-all shadow-sm cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                        <span>No "Me Persona" Added</span>
                      </Link>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Header Right Actions & Model Dropdown */}
          <div className="flex items-center gap-2">
            {/* High Demand Traffic Warning Pill */}
            {isHighDemand && (
              <Tooltip
                content="High demand detected (rate limit queue active). Replies may take longer."
                position="bottom"
                badgeIcon="🔥"
              >
                <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/60 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-200 shadow-md animate-pulse shrink-0">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden xs:inline">Due to high demand reply can be slow</span>
                  <span className="xs:hidden">High Demand</span>
                </div>
              </Tooltip>
            )}

            {/* Model Selector Dropdown (when chat is active - Desktop only) */}
            {viewMode === "chat" && (
              <div className="relative z-[9999] hidden sm:block" ref={modelDropdownRef}>
                <button
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-200 bg-neutral-900/90 hover:bg-neutral-800 px-3 py-1.5 rounded-full transition-all border border-purple-500/30 hover:border-purple-400/60 shadow-sm cursor-pointer touch-manipulation"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />
                  <span className="truncate max-w-[110px] sm:max-w-none">{activeModelName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </button>

                {modelDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-neutral-900/95 border border-purple-500/30 rounded-2xl shadow-2xl py-2 z-[99999] backdrop-blur-xl ring-1 ring-white/10">
                    <div className="px-3 py-1.5 mb-1 text-[10px] font-mono tracking-wider uppercase text-purple-400 font-bold border-b border-neutral-800">
                      Select AI Model
                    </div>
                    <button
                      onClick={() => handleModelChange("gemini-3.5-flash-lite")}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeChat?.selectedModel === "gemini-3.5-flash-lite" || !activeChat?.selectedModel || activeModelName.includes("3.5")
                          ? "bg-purple-950/40 text-white font-bold"
                          : "text-neutral-300 hover:bg-neutral-800/80"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>3.5 Flash Lite</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 ml-5">Recommended • Fast & Smart</span>
                      </div>
                      {(activeChat?.selectedModel === "gemini-3.5-flash-lite" || !activeChat?.selectedModel || activeModelName.includes("3.5")) && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      )}
                    </button>

                    <button
                      onClick={() => handleModelChange("gemini-3.1-flash-lite")}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeChat?.selectedModel === "gemini-3.1-flash-lite"
                          ? "bg-purple-950/40 text-white font-bold"
                          : "text-neutral-300 hover:bg-neutral-800/80"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>3.1 Flash Lite</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 ml-5">Legacy Speed Engine</span>
                      </div>
                      {activeChat?.selectedModel === "gemini-3.1-flash-lite" && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* Gemini Daily Credit Chip */}
            <Tooltip
              content={
                usageLimitData?.isLimitReached
                  ? "Daily limit reached (100 max)! Resets daily at midnight, or click to contact admin."
                  : `${usageLimitData?.remainingCredits ?? 100} credits remaining out of ${usageLimitData?.dailyLimit ?? 100} today`
              }
              position="bottom"
              badgeIcon="⚡"
            >
              <Link
                href="/setting"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border transition-all shadow-sm cursor-pointer ${usageLimitData?.isLimitReached
                  ? "bg-red-950/90 border-red-500/80 text-red-300 hover:bg-red-900/90 animate-pulse"
                  : ((usageLimitData?.todayCount || 0) / (usageLimitData?.dailyLimit || 100)) >= 0.8
                    ? "bg-amber-950/90 border-amber-500/80 text-amber-300 hover:bg-amber-900/90"
                    : "bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-neutral-900 border-purple-500/40 text-purple-200 hover:border-purple-400 hover:shadow-purple-950/50"
                  }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                <span className="font-mono tracking-tight text-white">
                  {usageLimitData?.todayCount ?? 0}/{usageLimitData?.dailyLimit ?? 100}
                </span>
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-purple-300 font-black">
                  Credits
                </span>
              </Link>
            </Tooltip>

            {/* User Initial Circle in Header (Hidden on mobile) */}
            <div
              className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold items-center justify-center text-xs shadow-inner shrink-0 cursor-default"
              title={`Logged in as ${user?.name || "User"}`}
            >
              {user?.name?.[0]?.toUpperCase() || "M"}
            </div>
          </div>

        </header>

        {/* Content View */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">{children}</main>

        {/* Native Clean Mobile Bottom Navigation Bar (hidden when chat is active) */}
        {viewMode !== "chat" && (
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-purple-500/20 select-none shrink-0 pointer-events-auto">
            <div className="h-14 flex items-center justify-between w-full">
              {/* Home Tab */}
              <button
                type="button"
                onClick={() => {
                  if (onSelectHome) onSelectHome();
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors cursor-pointer ${isHomeActive ? "text-purple-400 font-semibold" : "text-neutral-400 hover:text-white"
                  }`}
              >
                <Home className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">Home</span>
              </button>

              {/* Add Character Tab */}
              <Link
                href="/character/add"
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors cursor-pointer ${isAddCharActive ? "text-purple-400 font-semibold" : "text-neutral-400 hover:text-white"
                  }`}
              >
                <UserPlus className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">Add Char</span>
              </Link>

              {/* History / Chats Tab */}
              <button
                type="button"
                onClick={() => {
                  if (chats.length > 0 && onSelectChat) {
                    onSelectChat(chats[0].id);
                  } else {
                    onNewChat();
                  }
                }}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors relative cursor-pointer ${isHistoryActive ? "text-purple-400 font-semibold" : "text-neutral-400 hover:text-white"
                  }`}
              >
                <div className="relative inline-flex items-center justify-center">
                  <History className="w-5 h-5 shrink-0" />
                  {chats.length > 0 && (
                    <span className="absolute -top-1 -right-2.5 w-3.5 h-3.5 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center">
                      {chats.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">History</span>
              </button>

              {/* Setting Tab */}
              <Link
                href="/setting"
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors cursor-pointer ${isSettingActive ? "text-purple-400 font-semibold" : "text-neutral-400 hover:text-white"
                  }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">Setting</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
