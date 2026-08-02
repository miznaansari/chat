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
  Edit2,
} from "lucide-react";

export default function ProductShowcase() {
  const [activeChatTab, setActiveChatTab] = useState("physics");

  const showcaseChats = {
    physics: {
      title: "Quantum Physics Prep",
      characters: ["Dr. Aris (Tutor)", "Exam Coach"],
      description: "Quantum Physics oral exam & wave mechanics tutor simulation...",
      messages: [
        {
          sender: "Dr. Aris (Tutor)",
          avatarColor: "bg-purple-900/90 text-purple-200 border-purple-700/60",
          thought: "Evaluating student's understanding of Schrödinger wave function magnitude squared",
          text: "Welcome back! Today we are simulating oral exam questions on Schrödinger wave equations. Question 1: What is the physical significance of the wavefunction magnitude squared |ψ|²?",
        },
        {
          sender: "You",
          type: "user",
          text: "It represents the probability density of finding a particle in a given region of space at a given time.",
          promptTag: "[Exam Coach]: 'Score 10/10! State boundary conditions next.'",
        },
      ],
      activeSpeaker: "Exam Coach",
    },
    ielts: {
      title: "IELTS Band 9 Coach",
      characters: ["Coach Sarah", "Evaluator AI"],
      description: "Live IELTS Part 2 speaking test simulation with real-time feedback...",
      messages: [
        {
          sender: "Coach Sarah",
          avatarColor: "bg-rose-900/90 text-pink-200 border-pink-700/60",
          thought: "Checking fluency, lexical resource, and grammatical accuracy for Part 2 topic",
          text: "Welcome to your Part 2 speaking simulation! Your topic is: 'Describe a memorable journey you took'. You have 1 minute to structure your key points.",
        },
        {
          sender: "You",
          type: "user",
          text: "I would like to talk about a mountain trek I embarked on last summer. The scenery was breathtaking and the local culture was deeply inspiring.",
          promptTag: "[Evaluator AI]: 'Excellent lexical range! Practice connective transitions next.'",
        },
      ],
      activeSpeaker: "Coach Sarah",
    },
    story: {
      title: "Cyberpunk Chronicles",
      characters: ["Kaelen (Netrunner)", "Commander Vane"],
      description: "Neon Cyberpunk syndicate heist & netrunner multi-persona story...",
      messages: [
        {
          sender: "Kaelen (Netrunner)",
          avatarColor: "bg-cyan-900/90 text-cyan-200 border-cyan-700/60",
          thought: "Bypassing Arasaka mainframe firewall node #42 and patching grid feed",
          text: "The icebreaker program just breached sub-grid 4! Commander Vane is moving security droids to lower levels. We have 90 seconds before orbital scan locks our location.",
        },
        {
          sender: "You",
          type: "user",
          text: "Deploy EMP pulse on lower elevator shafts and patch my terminal into the grid core.",
          promptTag: "[Commander Vane]: 'Intruder detected in sector B! Backup requested.'",
        },
      ],
      activeSpeaker: "Commander Vane",
    },
  };

  const currentChat = showcaseChats[activeChatTab] || showcaseChats.physics;

  return (
    <section className="relative z-10 py-12 md:py-16 px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Experience <span className="antigravity-gradient-text">NextAiChat Workspace</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          Interactive AI tutors, language coaches, and multi-character story rooms powered by Gemini.
        </p>
      </div>

      {/* Realistic Product Container matching Screenshot */}
      <div className="relative z-10 rounded-3xl bg-[#030712] border border-purple-500/30 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden">

        {/* Main Application Container */}
        <div className="flex h-[560px] sm:h-[620px] w-full text-neutral-100 font-sans relative overflow-hidden">

          {/* ================= LEFT SIDEBAR ================= */}
          <div className="w-64 sm:w-72 bg-[#090d16]/95 border-r border-neutral-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
            {/* Sidebar Top Header */}
            <div className="space-y-3 p-3 border-b border-neutral-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
                    <Menu className="w-4 h-4" />
                  </button>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo-landspace.png"
                      alt="NextAiChat Logo"
                      width={160}
                      height={40}
                      className="h-9 sm:h-10 w-auto object-contain"
                    />
                  </Link>
                </div>
                <button className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
                  <SquarePen className="w-4 h-4" />
                </button>
              </div>

              {/* New Roleplay Chat Button */}
              <button className="w-full bg-purple-950/60 hover:bg-purple-900/80 text-white border border-purple-800/60 font-semibold py-2.5 px-3 rounded-xl flex items-center gap-2.5 text-xs shadow-sm cursor-pointer transition-all">
                <SquarePen className="w-4 h-4 text-purple-400 shrink-0" />
                <span>New Roleplay Chat</span>
              </button>
            </div>

            {/* Recent Roleplays List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                Recent Roleplays
              </div>

              {/* Physics Session Tab */}
              <div
                onClick={() => setActiveChatTab("physics")}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeChatTab === "physics"
                    ? "bg-purple-950/80 border border-purple-800/80 text-white font-medium shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                  }`}
              >
                <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${activeChatTab === "physics" ? "text-purple-400" : "text-neutral-500"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">Quantum Physics Prep</div>
                  <div className="text-[10px] text-neutral-400 truncate">Dr. Aris, Exam Coach</div>
                </div>
              </div>

              {/* IELTS Session Tab */}
              <div
                onClick={() => setActiveChatTab("ielts")}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeChatTab === "ielts"
                    ? "bg-purple-950/80 border border-purple-800/80 text-white font-medium shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                  }`}
              >
                <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${activeChatTab === "ielts" ? "text-purple-400" : "text-neutral-500"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">IELTS Band 9 Coach</div>
                  <div className="text-[10px] text-neutral-400 truncate">Coach Sarah, AI</div>
                </div>
              </div>

              {/* Cyberpunk Session Tab */}
              <div
                onClick={() => setActiveChatTab("story")}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeChatTab === "story"
                    ? "bg-purple-950/80 border border-purple-800/80 text-white font-medium shadow-sm"
                    : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                  }`}
              >
                <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${activeChatTab === "story" ? "text-purple-400" : "text-neutral-500"}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">Cyberpunk Chronicles</div>
                  <div className="text-[10px] text-neutral-400 truncate">Kaelen, Commander Vane</div>
                </div>
              </div>
            </div>

            {/* User Profile Footer */}
            <div className="p-3 border-t border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                  A
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">alex.vance@example.com</div>
                  <div className="text-[9px] text-neutral-400">Authenticated</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <Settings className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                <LogOut className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* ================= RIGHT WORKSPACE CANVAS ================= */}
          <div className="flex-1 flex flex-col h-full bg-[#030712] relative overflow-hidden bg-antigravity-grid">

            {/* Background Glowing Orbit Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-purple-900/30 pointer-events-none z-0">
              <div className="absolute top-1/4 left-0 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_12px_#a855f7]" />
              <div className="absolute bottom-1/3 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
            </div>

            {/* TOP CHAT HEADER BAR */}
            <header className="h-14 border-b border-purple-500/20 px-3 sm:px-4 flex items-center justify-between bg-neutral-950/80 backdrop-blur-xl z-20 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {/* Model Selector Dropdown */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900/80 px-3 py-1.5 rounded-full border border-neutral-800 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>AI Model</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </div>

                {/* Chat Title & Character Pills */}
                <div className="hidden sm:flex items-center gap-1.5 pl-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    👥 {currentChat.title}
                  </span>
                  {currentChat.characters.map((char, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] text-neutral-300 font-mono"
                    >
                      {char}
                    </span>
                  ))}
                  <Edit2 className="w-3 h-3 text-neutral-400 cursor-pointer" />
                </div>
              </div>

              {/* Right Control Mode */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-700 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                  ⚡ Dynamic Turn
                </span>
                <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-400 cursor-pointer ml-1" />
              </div>
            </header>

            {/* CHAT MESSAGES CANVAS */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 relative z-10">

              {/* Character Response Message */}
              {currentChat.messages[0] && (
                <div className="space-y-2 max-w-3xl">
                  {/* Speaker Name Badge */}
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold border ${currentChat.messages[0].avatarColor}`}>
                    {currentChat.messages[0].sender}
                  </span>

                  {/* Character Thought Box */}
                  {currentChat.messages[0].thought && (
                    <div className="bg-purple-950/70 border border-purple-800/60 rounded-xl p-3 text-purple-200 text-xs italic leading-relaxed space-y-1 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-300 font-mono uppercase tracking-wider not-italic">
                        <span className="px-1.5 py-0.2 rounded bg-purple-900/90 text-purple-200">💭 THOUGHT</span>
                      </div>
                      <p>"{currentChat.messages[0].thought}"</p>
                    </div>
                  )}

                  {/* Dialogue Message Content */}
                  <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-neutral-200 leading-relaxed shadow-lg">
                    {currentChat.messages[0].text}
                  </div>
                </div>
              )}

              {/* User Dialogue Message */}
              {currentChat.messages[1] && (
                <div className="space-y-1 max-w-3xl ml-auto text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-neutral-400 pr-1">
                    <span>You</span>
                    <div className="w-5 h-5 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 text-[10px]">
                      👤
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-neutral-200 text-left space-y-2 shadow-lg">
                    <p>{currentChat.messages[1].text}</p>
                    {currentChat.messages[1].promptTag && (
                      <div className="text-[11px] text-purple-300 font-mono font-medium">
                        {currentChat.messages[1].promptTag}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scene Roleplay Header Pill */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-neutral-400 mb-1 flex items-center gap-1">
                  <span>Scene Roleplay Dialogue ({currentChat.characters.join(", ")})</span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-extrabold shadow-sm">
                  {currentChat.activeSpeaker}
                </span>
              </div>
            </div>

            {/* FLOATING CHAT INPUT BAR */}
            <div className="p-3 sm:p-4 border-t border-purple-500/20 bg-neutral-950/90 backdrop-blur-xl relative z-20 space-y-1.5">
              <div className="relative flex items-center bg-neutral-900/90 border border-purple-500/30 focus-within:border-purple-500 rounded-2xl p-2 shadow-inner">
                <button className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
                  <Plus className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  readOnly
                  value={`Speak to ${currentChat.characters.join(", ")}...`}
                  className="w-full bg-transparent px-3 text-xs sm:text-sm text-neutral-400 outline-none cursor-default"
                />
                <button className="p-2 text-neutral-400 hover:text-white rounded-lg">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 shadow-md">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-[10px] text-neutral-500 text-center font-mono hidden sm:block">
                Press <span className="px-1 py-0.2 rounded bg-neutral-800 text-neutral-300">Enter</span> to send, <span className="px-1 py-0.2 rounded bg-neutral-800 text-neutral-300">Shift + Enter</span> for new line. Right-click or press + for quick actions.
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
