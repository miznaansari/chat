"use client";

import { useState } from "react";
import {
  Menu,
  Sparkles,
  SquarePen,
  MessageSquare,
  Trash2,
  LogOut,
  ChevronDown,
  User,
  X,
  Bot,
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [activeModelName, setActiveModelName] = useState("Gemini 3.6 Flash Lite");

  return (
    <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar Drawer */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-16"
        } transition-all duration-300 bg-neutral-900/90 border-r border-neutral-800/80 flex flex-col shrink-0 z-20`}
      >
        {/* Sidebar Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-800/50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {sidebarOpen && (
            <button
              onClick={onNewChat}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              title="New Chat"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat Button (Full Width when Open) */}
        {sidebarOpen && (
          <div className="p-3">
            <button
              onClick={onNewChat}
              className="w-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 font-medium py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs transition-all shadow-sm"
            >
              <SquarePen className="w-4 h-4 text-blue-400" />
              <span>New Roleplay Chat</span>
            </button>
          </div>
        )}

        {/* Recent Chats List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {sidebarOpen && (
            <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Recent Roleplays
            </div>
          )}

          {chats.length === 0 ? (
            sidebarOpen && (
              <div className="px-3 py-4 text-center text-xs text-neutral-500">
                No chat sessions yet. Create one to begin!
              </div>
            )
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? "bg-neutral-800 text-white font-medium shadow-sm"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-400" : "text-neutral-500"}`} />

                  {sidebarOpen && (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate font-semibold text-neutral-200">
                          {chat.title}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate">
                          {chat.sessionCharacters?.map((c) => `[${c.name}]`).join(" ") || "Characters"}
                        </div>
                      </div>

                      {/* Delete Chat Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-700/60 rounded transition-all"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-neutral-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* User Avatar with initial matching Gemini UI */}
              <div className="w-8 h-8 rounded-full bg-amber-700/80 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {user?.name || "User"}
                  </div>
                  <div className="text-[10px] text-neutral-400">Authenticated</div>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <button
                onClick={onLogout}
                className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar matching Gemini UI screenshot */}
        <header className="h-14 border-b border-neutral-800/60 px-6 flex items-center justify-between bg-neutral-950 z-10">
          {/* Top Left Gemini Model Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-neutral-200 hover:bg-neutral-900 px-3 py-1.5 rounded-full transition-colors"
            >
              <span>{activeModelName}</span>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50">
                <button
                  onClick={() => {
                    setActiveModelName("Gemini 3.6 Flash Lite");
                    setModelDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-neutral-800 flex items-center justify-between text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold">3.6 Flash Lite</span>
                  </div>
                  {activeModelName.includes("3.6") && (
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveModelName("Gemini 3.1 Flash Lite");
                    setModelDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs hover:bg-neutral-800 flex items-center justify-between text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-semibold">3.1 Flash Lite</span>
                  </div>
                  {activeModelName.includes("3.1") && (
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* User Initial Circle in Header matching Gemini screenshot */}
          <div className="w-8 h-8 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-xs shadow-inner">
            {user?.name?.[0]?.toUpperCase() || "M"}
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 flex overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
