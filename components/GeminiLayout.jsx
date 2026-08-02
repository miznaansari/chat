"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Sparkles,
  SquarePen,
  MessageSquare,
  Trash2,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";

export default function GeminiLayout({
  user,
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onLogout,
  children,
}) {
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
  const [activeModelName, setActiveModelName] = useState("Gemini 3.5 Flash Lite");
  const modelDropdownRef = useRef(null);

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
    <div className="flex h-[100dvh] w-full fixed inset-0 bg-neutral-950 text-neutral-100 overflow-hidden overscroll-none font-sans">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col h-full bg-neutral-900 border-r border-neutral-800 transition-all duration-300 shrink-0 overscroll-none ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${sidebarOpen ? "w-72 md:w-72 shadow-2xl md:shadow-none" : "w-72 md:w-16"}`}
      >
        {/* Sidebar Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-800/50 shrink-0 touch-none select-none">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className={`text-sm font-bold text-white tracking-wide truncate ${!sidebarOpen ? "md:hidden" : ""}`}>
              Gemini RP
            </span>
          </div>

          <button
            onClick={() => {
              onNewChat();
              setMobileOpen(false);
            }}
            className={`p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors shrink-0 ${!sidebarOpen ? "md:hidden" : ""}`}
            title="New Chat"
          >
            <SquarePen className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className={`p-3 shrink-0 ${!sidebarOpen ? "md:hidden" : ""}`}>
          <button
            onClick={() => {
              onNewChat();
              setMobileOpen(false);
            }}
            className="w-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 font-medium py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs transition-all shadow-sm"
          >
            <SquarePen className="w-4 h-4 text-blue-400 shrink-0" />
            <span>New Roleplay Chat</span>
          </button>
        </div>

        {/* Recent Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className={`px-3 py-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider ${!sidebarOpen ? "md:hidden" : ""}`}>
            Recent Roleplays
          </div>

          {chats.length === 0 ? (
            <div className={`px-3 py-4 text-center text-xs text-neutral-500 ${!sidebarOpen ? "md:hidden" : ""}`}>
              No chat sessions yet. Create one to begin!
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChatMobile(chat.id)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${isActive
                    ? "bg-neutral-800 text-white font-medium shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                    }`}
                  title={chat.title}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />

                  <div className={`flex-1 min-w-0 flex items-center justify-between gap-2 ${!sidebarOpen ? "md:hidden" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate font-semibold text-neutral-200">
                        {chat.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate capitalize">
                        {chat.sessionCharacters?.map((c) => c.name).join(", ") || "Characters"}
                      </div>
                    </div>

                    {/* Delete Chat Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-90 md:opacity-0 md:group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-700/60 rounded transition-all shrink-0"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-neutral-800/80 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-700/80 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>

              <div className={`min-w-0 ${!sidebarOpen ? "md:hidden" : ""}`}>
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || "User"}
                </div>
                <div className="text-[10px] text-neutral-400">Authenticated</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className={`p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors ${!sidebarOpen ? "md:hidden" : ""}`}
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Bar matching Gemini UI screenshot */}
        <header className="h-14 border-b border-neutral-800/60 px-3 md:px-6 flex items-center justify-between bg-neutral-950 z-30 shrink-0 relative">
          <div className="flex items-center gap-2">
            {/* Toggle Drawer button for Mobile Header */}
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors md:hidden"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Top Left Gemini Model Dropdown */}
            <div className="relative z-50" ref={modelDropdownRef}>
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-neutral-200 hover:bg-neutral-900 px-2.5 py-1.5 rounded-full transition-colors border border-neutral-800 md:border-transparent cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">{activeModelName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </button>

              {modelDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl py-2 z-[9999] ring-1 ring-white/10">
                  <button
                    onClick={() => {
                      setActiveModelName("Gemini 3.5 Flash Lite");
                      setModelDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-neutral-800/80 flex items-center justify-between text-neutral-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold">3.5 Flash Lite</span>
                    </div>
                    {activeModelName.includes("3.5") && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveModelName("Gemini 3.1 Flash Lite");
                      setModelDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs hover:bg-neutral-800/80 flex items-center justify-between text-neutral-200 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span className="font-semibold">3.1 Flash Lite</span>
                    </div>
                    {activeModelName.includes("3.1") && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 shadow-sm" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Initial Circle in Header */}
          <div className="w-8 h-8 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
            {user?.name?.[0]?.toUpperCase() || "M"}
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 flex overflow-hidden relative">{children}</main>
      </div>
    </div>
  );
}
