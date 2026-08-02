"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Bot,
  Zap,
  BookOpen,
  Gamepad2,
  Code,
  Send,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Plus,
  Settings,
  Layers,
  Terminal,
  CheckCircle2,
  ArrowUpRight,
  Sliders,
  Flame,
} from "lucide-react";

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("study");

  const tabs = [
    {
      id: "study",
      label: "Study & Exam Matrix",
      icon: BookOpen,
      badge: "100% Academic Prep",
      color: "from-purple-600 to-indigo-600",
    },
    {
      id: "story",
      label: "Multi-Persona RPG",
      icon: Gamepad2,
      badge: "Multi-Character Room",
      color: "from-pink-600 to-rose-600",
    },
    {
      id: "engine",
      label: "Dynamic Speaker Turn",
      icon: Zap,
      badge: "Zero Latency",
      color: "from-cyan-600 to-blue-600",
    },
    {
      id: "snippets",
      label: "Snippets & Prompts",
      icon: Code,
      badge: "Instant Execution",
      color: "from-emerald-600 to-teal-600",
    },
  ];

  const showcaseData = {
    study: {
      sessionTitle: "Quantum Physics Oral Exam Prep",
      personas: [
        { name: "Dr. Aris (Physics Tutor)", avatar: "⚛️", role: "Subject Specialist", color: "purple" },
        { name: "Exam Evaluator AI", avatar: "📝", role: "Score Coach", color: "indigo" },
      ],
      messages: [
        {
          sender: "Dr. Aris (Physics Tutor)",
          avatar: "⚛️",
          type: "ai",
          personaBadge: "Study Tutor",
          time: "10:42 AM",
          text: "Welcome back! Today we are simulating oral exam questions on Schrödinger wave equations. Question 1: What is the physical significance of the wavefunction magnitude squared $|\\psi|^2$?",
        },
        {
          sender: "Student (You)",
          avatar: "👤",
          type: "user",
          personaBadge: "User",
          time: "10:43 AM",
          text: "It represents the probability density of finding a particle in a given region of space at a given time.",
        },
        {
          sender: "Exam Evaluator AI",
          avatar: "📝",
          type: "ai",
          personaBadge: "Turn Engine Auto-Selected",
          time: "10:43 AM",
          text: "Correct! Score: 10/10. Key concept included: 'probability density'. Dr. Aris will now follow up with boundary conditions.",
        },
      ],
      snippets: ["Explain Boundary Conditions", "Calculate Energy Levels", "Give Practice Quiz"],
    },
    story: {
      sessionTitle: "Neon Cyberpunk Syndicate Multiverse",
      personas: [
        { name: "Kaelen (Hacker AI)", avatar: "⚡", role: "Netrunner", color: "cyan" },
        { name: "Commander Vane", avatar: "🛡️", role: "Security Chief", color: "pink" },
      ],
      messages: [
        {
          sender: "Kaelen (Netrunner)",
          avatar: "⚡",
          type: "ai",
          personaBadge: "Active Persona",
          time: "11:15 PM",
          text: "I've breached the mainframe outer firewall. We have 45 seconds before security trace units pinpoint our signal origin!",
        },
        {
          sender: "Commander Vane",
          avatar: "🛡️",
          type: "ai",
          personaBadge: "Turn Engine Auto-Selected",
          time: "11:15 PM",
          text: "All security grids locked down! Halt network override immediately or orbital defense turrets engage!",
        },
        {
          sender: "Operative (You)",
          avatar: "👤",
          type: "user",
          personaBadge: "User",
          time: "11:16 PM",
          text: "Kaelen, trigger the EMP pulse decoy now! Vane, your firewalls are already compromised.",
        },
      ],
      snippets: ["Trigger EMP Decoy", "Hack Mainframe", "Initiate Stealth Protocol"],
    },
    engine: {
      sessionTitle: "Smart Speaker Turn Latency Benchmark",
      personas: [
        { name: "Gemini 2.0 Flash Engine", avatar: "⚡", role: "Context Evaluator", color: "cyan" },
        { name: "Turn Engine Kernel", avatar: "⚙️", role: "Speaker Dispatcher", color: "purple" },
      ],
      messages: [
        {
          sender: "System Matrix",
          avatar: "🖥️",
          type: "ai",
          personaBadge: "Engine Status",
          time: "Real-time",
          text: "Evaluating conversation context graph across 3 active personas. Latency benchmark: 0 ms delay.",
        },
        {
          sender: "Gemini Turn Evaluator",
          avatar: "⚡",
          type: "ai",
          personaBadge: "Smart Speaker Selection",
          time: "Real-time",
          text: "Selected 'Language Tutor Persona' for next response turn based on user's grammar query intent.",
        },
      ],
      snippets: ["Benchmark Latency", "Force Speaker Switch", "Analyze Context Graph"],
    },
    snippets: {
      sessionTitle: "Custom Reusable Prompts & Snippet Vault",
      personas: [
        { name: "Snippet Manager", avatar: "📚", role: "Library Vault", color: "emerald" },
      ],
      messages: [
        {
          sender: "Snippet Engine",
          avatar: "📚",
          type: "ai",
          personaBadge: "Vault Active",
          time: "Instant",
          text: "Your reusable roleplay snippet library has 14 saved one-click execution templates (Exam Drill, Hinglish Translation, Code Debugger).",
        },
      ],
      snippets: ["/quiz-me - Initiate 5 question exam", "/hinglish - Translate to Hinglish", "/debug - Analyze syntax error"],
    },
  };

  const activeData = showcaseData[activeTab];

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto w-full space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-wide">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>LIVE PRODUCT SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Experience the <span className="antigravity-glow-text">NextAiChat Interface</span>
        </h2>
        <p className="text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Explore how our high-performance AI roleplay engine runs live inside your browser with multi-persona rooms, study prep tools, and zero latency.
        </p>
      </div>

      {/* Mode Selector Tab Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-[0_0_30px_rgba(147,51,234,0.5)] scale-105 border border-white/20`
                  : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white animate-pulse" : "text-neutral-400"}`} />
              <span>{tab.label}</span>
              {isActive && (
                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono border border-white/20">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mac-Style Cyber Product Window Container */}
      <div className="relative z-10 rounded-3xl bg-neutral-950/90 border border-purple-500/30 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Top Window Chrome Bar */}
        <div className="h-12 px-4 sm:px-6 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-400/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/50" />
          </div>

          {/* Fake Browser URL Bar */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-xl bg-neutral-950/80 border border-white/10 text-xs text-neutral-400 font-mono w-96 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white">https://app.nextaichat.com/chat/live</span>
            <span className="text-purple-400 font-bold ml-auto">SSL 256-bit</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>0 ms LATENCY</span>
          </div>
        </div>

        {/* Product Inner Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          
          {/* Left Sidebar (Chats & Personas) */}
          <div className="md:col-span-4 lg:col-span-3 bg-neutral-900/40 border-r border-white/10 p-4 space-y-5 hidden md:block">
            {/* New Session Button */}
            <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" />
              <span>New Roleplay Room</span>
            </button>

            {/* Active Sessions List */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                Active Roleplay Sessions
              </div>
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs font-semibold flex items-center justify-between">
                  <span className="truncate">{activeData.sessionTitle}</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-white/5 text-neutral-400 text-xs truncate hover:text-white transition-colors cursor-pointer">
                  French Conversation Dialogue (B2)
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-white/5 text-neutral-400 text-xs truncate hover:text-white transition-colors cursor-pointer">
                  Full-Stack React & Node Mentor
                </div>
              </div>
            </div>

            {/* Active Room Personas */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Active Room Personas ({activeData.personas.length})
              </div>
              <div className="space-y-2">
                {activeData.personas.map((p, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center gap-2.5">
                    <span className="text-base">{p.avatar}</span>
                    <div className="space-y-0.5 truncate">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-purple-300 font-mono">{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Profile Quick Badge */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white">
                  JS
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Student User</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Pro Active</div>
                </div>
              </div>
              <Settings className="w-4 h-4 text-neutral-500 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Main Chat Workspace */}
          <div className="md:col-span-8 lg:col-span-9 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            
            {/* Chat Workspace Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeData.sessionTitle}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-mono">
                    Gemini 2.0 Flash
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Dynamic Turn Engine evaluating speaker context in real time
                </p>
              </div>

              <a
                href={process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 transition-all shrink-0"
              >
                <span>Launch Live App</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Messages Area */}
            <div className="space-y-4 py-2 flex-1 overflow-y-auto max-h-[320px] pr-1">
              {activeData.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.type === "user" ? "ml-4 sm:ml-12" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white shrink-0 text-sm font-bold shadow-md">
                    {msg.avatar}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        {msg.sender}
                        <span className="px-1.5 py-0.2 rounded bg-purple-950/80 text-[10px] text-purple-300 border border-purple-800 font-mono">
                          {msg.personaBadge}
                        </span>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">{msg.time}</span>
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                        msg.type === "user"
                          ? "bg-purple-950/70 border-purple-500/40 text-purple-100"
                          : "bg-neutral-900/80 border-white/10 text-neutral-200"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Snippet Quick Action Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold flex items-center gap-1">
                <Code className="w-3 h-3 text-purple-400" /> Quick Snippets:
              </span>
              {activeData.snippets.map((snip, idx) => (
                <button
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-purple-950 border border-white/10 hover:border-purple-500/50 text-[11px] text-neutral-300 hover:text-white transition-colors font-mono cursor-pointer"
                >
                  {snip}
                </button>
              ))}
            </div>

            {/* Simulated Prompt Input Bar */}
            <div className="relative flex items-center bg-neutral-900/90 border border-purple-500/30 focus-within:border-purple-500 rounded-2xl p-2 shadow-inner">
              <input
                type="text"
                readOnly
                value="Ask a study question or type next roleplay action..."
                className="w-full bg-transparent px-3 text-xs text-neutral-400 outline-none cursor-default"
              />
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 opacity-90 shadow-md"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
