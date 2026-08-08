"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  SquarePen,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Trash2,
  Settings,
  LogOut,
  Mic,
  Send,
  Plus,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function ProductShowcase() {
  const [activeChatTab, setActiveChatTab] = useState("physics");
  const [showThought, setShowThought] = useState(true);

  const showcaseChats = {
    physics: {
      title: "Quantum Physics Prep",
      tagline: "Oral Exam & Wave Mechanics Simulator",
      category: "Study Prep",
      characters: [
        { name: "Dr. Aris (Tutor)", color: "border-purple-500/50 bg-purple-950/70 text-purple-200" },
        { name: "Exam Coach", color: "border-cyan-500/50 bg-cyan-950/70 text-cyan-200" },
      ],
      description: "Simulating high-stakes quantum mechanics oral defense with real-time scoring...",
      messages: [
        {
          sender: "Dr. Aris (Tutor)",
          avatarColor: "bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-purple-400/40",
          thought: "Evaluating student's grasp of Schrödinger wavefunction magnitude squared |ψ|² in 3D potential wells.",
          text: "Welcome back! Today we are simulating oral exam questions on quantum wave mechanics. Question 1: What is the physical significance of the wavefunction magnitude squared |ψ|²?",
        },
        {
          sender: "You",
          type: "user",
          text: "It represents the probability density of finding a particle within a given region of space at a specific time t.",
          promptTag: "[Exam Coach]: 'Score: 10/10! Direct follow-up: state the normalization condition.'",
        },
      ],
      activeSpeaker: "Exam Coach",
    },
    ielts: {
      title: "IELTS Band 9 Coach",
      tagline: "Real-time Speaking Test & Fluency Evaluator",
      category: "Language",
      characters: [
        { name: "Coach Sarah", color: "border-pink-500/50 bg-pink-950/70 text-pink-200" },
        { name: "Evaluator AI", color: "border-amber-500/50 bg-amber-950/70 text-amber-200" },
      ],
      description: "Interactive Part 2 speaking simulation with immediate grammatical and lexical feedback...",
      messages: [
        {
          sender: "Coach Sarah",
          avatarColor: "bg-gradient-to-br from-pink-600 to-rose-700 text-white border-pink-400/40",
          thought: "Analyzing lexical range, discourse markers, and intonation for IELTS Part 2 cue card.",
          text: "Welcome to your Part 2 speaking simulation! Your topic is: 'Describe a memorable journey you took'. You have 1 minute to structure your key bullet points.",
        },
        {
          sender: "You",
          type: "user",
          text: "I'd like to describe an expedition to the Himalayan foothills. The landscape was breathtaking and interacting with local sherpas was deeply enriching.",
          promptTag: "[Evaluator AI]: 'Excellent vocabulary! Focus on complex connective transitions in Part 3.'",
        },
      ],
      activeSpeaker: "Coach Sarah",
    },
    story: {
      title: "Cyberpunk Chronicles",
      tagline: "Neon Syndicate Heist & Netrunner Multi-Persona Story",
      category: "Entertainment",
      characters: [
        { name: "Kaelen (Netrunner)", color: "border-cyan-500/50 bg-cyan-950/70 text-cyan-200" },
        { name: "Commander Vane", color: "border-red-500/50 bg-red-950/70 text-red-200" },
      ],
      description: "High-stakes cyberpunk heist where multiple AI personas react to your choices dynamically...",
      messages: [
        {
          sender: "Kaelen (Netrunner)",
          avatarColor: "bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-cyan-400/40",
          thought: "Breaching Arasaka security mainframe firewall node #42. Security droids approaching sector B.",
          text: "The icebreaker program just breached sub-grid 4! Commander Vane is redirecting security droids to the lower levels. We have 90 seconds before orbital scanning locks our position.",
        },
        {
          sender: "You",
          type: "user",
          text: "Trigger the secondary EMP burst in elevator shaft B and route terminal access directly to my deck.",
          promptTag: "[Commander Vane]: 'Intruder alert in mainframe sector B! Containment unit deployed.'",
        },
      ],
      activeSpeaker: "Commander Vane",
    },
  };

  const currentChat = showcaseChats[activeChatTab] || showcaseChats.physics;

  return (
    <section className="relative z-10 py-12 md:py-16 px-4 sm:px-6 lg:px-10 max-w-[1440px] mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Experience <span className="antigravity-gradient-text">NextAiChat Workspace</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
          Zero-latency multi-character rooms, dynamic speaker engines, and instant contextual memory control.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {Object.keys(showcaseChats).map((key) => {
          const chat = showcaseChats[key];
          const isActive = activeChatTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveChatTab(key)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white border-purple-400 shadow-[0_0_25px_rgba(147,51,234,0.45)] scale-105"
                  : "bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isActive ? "text-yellow-300 animate-pulse" : "text-neutral-500"}`} />
              <span>{chat.title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"}`}>
                {chat.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* macOS / Arc Style Workspace Frame */}
      <div className="relative z-10 rounded-3xl bg-[#030712] border border-purple-500/30 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden">
        
        {/* Workspace Window Title Bar */}
        <div className="h-10 bg-neutral-950/95 border-b border-neutral-800/80 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-[11px] text-neutral-400 font-mono pl-2">NextAiChat Workspace — AI Roleplay Engine</span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono font-bold">● LIVE DEMO</span>
        </div>

        {/* Workspace Body */}
        <div className="flex h-[560px] sm:h-[620px] w-full text-neutral-100 font-sans relative overflow-hidden">

          {/* LEFT SIDEBAR */}
          <div className="w-64 sm:w-72 bg-[#090d16]/95 border-r border-neutral-800/80 flex flex-col justify-between shrink-0 hidden md:flex z-10">
            <div className="space-y-3 p-3.5 border-b border-neutral-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors">
                    <Menu className="w-4 h-4" />
                  </button>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo-landspace.png"
                      alt="NextAiChat Logo"
                      width={140}
                      height={34}
                      className="h-8 w-auto object-contain"
                    />
                  </Link>
                </div>
                <button className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors">
                  <SquarePen className="w-4 h-4" />
                </button>
              </div>

              <button className="w-full bg-purple-950/70 hover:bg-purple-900 text-white border border-purple-700/60 font-bold py-2.5 px-3 rounded-xl flex items-center gap-2 text-xs shadow-md cursor-pointer transition-all hover:scale-[1.02]">
                <SquarePen className="w-4 h-4 text-purple-400 shrink-0" />
                <span>New Roleplay Chat</span>
              </button>
            </div>

            {/* Roleplay Chat Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              <div className="px-2.5 py-1 text-[10px] font-black text-neutral-500 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Recent Roleplays</span>
                <span className="text-purple-400">3 Active</span>
              </div>

              {Object.keys(showcaseChats).map((key) => {
                const item = showcaseChats[key];
                const isActive = activeChatTab === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveChatTab(key)}
                    className={`flex items-start gap-2.5 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border border-purple-600/70 text-white font-medium shadow-md"
                        : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-purple-400" : "text-neutral-500"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold truncate">{item.title}</div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {item.characters.map((c) => c.name.split(" ")[0]).join(", ")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-neutral-800/80 flex items-center justify-between bg-neutral-950/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                  N
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate">student@nextaichat.online</div>
                  <div className="text-[9px] text-purple-400 font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Pro Member
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <Settings className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
                <LogOut className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* RIGHT WORKSPACE CANVAS */}
          <div className="flex-1 flex flex-col h-full bg-[#030712] relative overflow-hidden bg-antigravity-grid z-10">

            {/* TOP CHAT HEADER BAR */}
            <header className="h-14 border-b border-purple-500/20 px-3 sm:px-5 flex items-center justify-between bg-neutral-950/90 backdrop-blur-xl z-20 shrink-0">
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-neutral-100 bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800 shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>AI Engine</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </div>

                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-800">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    👥 {currentChat.title}
                  </span>
                  {currentChat.characters.map((char, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${char.color}`}
                    >
                      {char.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowThought(!showThought)}
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    showThought ? "bg-purple-950 text-purple-300 border-purple-600" : "bg-neutral-900 text-neutral-400 border-neutral-800"
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  <span>{showThought ? "Thought Visible" : "Thought Hidden"}</span>
                </button>

                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/60 text-purple-200 text-[10px] font-mono font-extrabold flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                  <span>Auto Turn Engine</span>
                </span>
              </div>
            </header>

            {/* MESSAGES CANVAS */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 relative z-10 custom-scrollbar">

              {currentChat.messages[0] && (
                <div className="space-y-2 max-w-3xl animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-md ${currentChat.messages[0].avatarColor}`}>
                      <Bot className="w-3.5 h-3.5" />
                      <span>{currentChat.messages[0].sender}</span>
                    </span>
                  </div>

                  {showThought && currentChat.messages[0].thought && (
                    <div className="bg-purple-950/80 border border-purple-700/60 rounded-2xl p-3 sm:p-3.5 text-purple-200 text-xs italic leading-relaxed space-y-1 shadow-inner backdrop-blur-md">
                      <div className="flex items-center justify-between text-[10px] font-bold text-purple-300 font-mono uppercase tracking-wider not-italic">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-900/90 text-purple-200 border border-purple-600/40">
                          <BrainCircuit className="w-3 h-3 text-purple-300" />
                          <span>AI THOUGHT PROCESS</span>
                        </span>
                        <span className="text-purple-400/70">Context: Active</span>
                      </div>
                      <p className="pt-0.5">"{currentChat.messages[0].thought}"</p>
                    </div>
                  )}

                  <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 text-xs sm:text-sm text-neutral-100 leading-relaxed shadow-xl backdrop-blur-md">
                    {currentChat.messages[0].text}
                  </div>
                </div>
              )}

              {currentChat.messages[1] && (
                <div className="space-y-2 max-w-3xl ml-auto text-right animate-fadeIn">
                  <div className="flex items-center justify-end gap-1.5 text-xs font-extrabold text-neutral-400 pr-1">
                    <span>You (Student)</span>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                      👤
                    </div>
                  </div>

                  <div className="bg-neutral-900/95 border border-purple-500/30 rounded-2xl p-4 text-xs sm:text-sm text-neutral-100 text-left space-y-2.5 shadow-xl">
                    <p className="leading-relaxed">{currentChat.messages[1].text}</p>
                    {currentChat.messages[1].promptTag && (
                      <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-800/60 text-[11px] text-purple-200 font-mono font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{currentChat.messages[1].promptTag}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center">
                <div className="px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-extrabold flex items-center gap-2 shadow-lg animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Next Turn: {currentChat.activeSpeaker} generating response...</span>
                </div>
              </div>
            </div>

            {/* FLOATING CHAT INPUT BAR */}
            <div className="p-3 sm:p-4 border-t border-purple-500/20 bg-neutral-950/95 backdrop-blur-xl relative z-20 space-y-2">
              <div className="relative flex items-center bg-neutral-900/95 border border-purple-500/40 focus-within:border-purple-400 rounded-2xl p-2 shadow-inner transition-all">
                <button className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  readOnly
                  value={`Type your message to ${currentChat.characters.map((c) => c.name.split(" ")[0]).join(" & ")}...`}
                  className="w-full bg-transparent px-3 text-xs sm:text-sm text-neutral-300 outline-none cursor-default font-sans"
                />
                <button className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors">
                  <Mic className="w-4 h-4 text-purple-400" />
                </button>
                <button className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold shrink-0 shadow-md hover:scale-105 transition-transform cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 font-mono">
                <span className="hidden sm:inline">Press Enter to send • Shift + Enter for line break</span>
                <span className="text-purple-300 font-bold">⚡ Zero Queue Lag • 100% Private Sessions</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
