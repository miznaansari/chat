"use client";

import { useState } from "react";
import {
  Search,
  Sparkles,
  Compass,
  User,
  ChevronRight,
  Plus,
  Loader2,
  Zap,
  Flame,
  Star,
  Layers,
  Bot,
  Swords,
  Users
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Showcase", icon: Layers },
  { id: "sales", label: "Your Sales", icon: Star },
  { id: "products", label: "Products", icon: Zap },
  { id: "tools", label: "Recent Tools", icon: Flame },
  { id: "assistants", label: "AI Mentors", icon: Bot },
  { id: "fantasy", label: "Anime & Fantasy", icon: Swords },
  { id: "group", label: "Group Debates", icon: Users },
];

const DEFAULT_CHARACTERS = [
  {
    id: "default-priya",
    name: "NextAi Priya",
    tagline: "Futuristic AI Companion & Tech Mentor",
    badge: "OFF",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "assistants",
    chatsCount: "42.8k",
    rating: "4.9",
    story: "Priya is an advanced futuristic AI companion designed to guide you through coding, tech, creative ideas, and daily assistance.",
    characters: [{ name: "Priya", persona: "Friendly, highly intelligent, futuristic AI companion and tech mentor." }]
  },
  {
    id: "default-ippo",
    name: "Ippo Ecer",
    tagline: "Wise Master & Ancient Philosopher",
    badge: "HOT",
    badgeBg: "bg-purple-600 text-white font-bold shadow-purple-600/30",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "assistants",
    chatsCount: "28.3k",
    rating: "4.8",
    story: "Master Ippo shares ancient wisdom, deep philosophy, and calm guidance for life's biggest challenges.",
    characters: [{ name: "Ippo", persona: "Calm, wise, thoughtful ancient master and philosopher." }]
  },
  {
    id: "default-teonn",
    name: "Teonn",
    tagline: "Fantasy Adventurer & Storyteller",
    badge: "TOP",
    badgeBg: "bg-blue-600 text-white font-bold shadow-blue-600/30",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "fantasy",
    chatsCount: "35.1k",
    rating: "4.9",
    story: "Teonn takes you on epic quests, mythical journeys, and action-packed fantasy roleplays.",
    characters: [{ name: "Teonn", persona: "Brave, energetic fantasy adventurer and storyteller." }]
  },
  {
    id: "default-rise",
    name: "Rise Omar",
    tagline: "Cyber Warrior & Tactical Operative",
    badge: "New",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "fantasy",
    chatsCount: "19.5k",
    rating: "4.7",
    story: "Rise Omar is an elite operative navigating high-tech dystopian cyberpunk missions.",
    characters: [{ name: "Rise Omar", persona: "Tactical, focused, cybernetic operative." }]
  },
  {
    id: "default-group",
    name: "Annasip & Moni",
    tagline: "Dynamic Duo Group Debate",
    badge: "New",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "group",
    chatsCount: "54.2k",
    rating: "5.0",
    story: "Experience a multi-character dialogue debate between the pragmatic Annasip and optimistic Moni.",
    characters: [
      { name: "Annasip", persona: "Pragmatic, logical strategist who challenges every idea with evidence." },
      { name: "Moni", persona: "Optimistic, creative visionary who sees possibilities in every challenge." }
    ]
  },
  {
    id: "default-ramito",
    name: "Ramito",
    tagline: "Noir Detective & Mystery Solver",
    badge: "NEW",
    badgeBg: "bg-emerald-500 text-white font-bold shadow-emerald-500/30",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "assistants",
    chatsCount: "14.9k",
    rating: "4.8",
    story: "Detective Ramito invites you to solve dark mysteries, investigate clues, and uncover secrets.",
    characters: [{ name: "Ramito", persona: "Sharp, observant noir detective." }]
  },
  {
    id: "default-cyber",
    name: "Cyber Girl",
    tagline: "Futuristic Hacker & Cyber Specialist",
    badge: "NEW",
    badgeBg: "bg-cyan-500 text-black font-extrabold shadow-cyan-500/20",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "fantasy",
    chatsCount: "22.7k",
    rating: "4.9",
    story: "Cyber Girl assists you with neural hacking, AI networks, and futuristic digital roleplays.",
    characters: [{ name: "Cyber Girl", persona: "Sassy, quick-witted, master hacker." }]
  },
  {
    id: "default-fire",
    name: "Fire Mage",
    tagline: "Elemental Sorceress & Spellcaster",
    badge: "NEW",
    badgeBg: "bg-rose-500 text-white font-bold shadow-rose-500/30",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "fantasy",
    chatsCount: "31.4k",
    rating: "4.9",
    story: "Command fire spells, ancient incantations, and elemental magic in fantasy battles.",
    characters: [{ name: "Fire Mage", persona: "Fiery, passionate, spellcasting sorceress." }]
  },
  {
    id: "default-aether",
    name: "Aether Sage",
    tagline: "Cosmic Explorer & Dimensions Guide",
    badge: "HOT",
    badgeBg: "bg-purple-500 text-white font-bold shadow-purple-500/30",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "assistants",
    chatsCount: "18.1k",
    rating: "4.8",
    story: "Explore multiverses, celestial realms, and space adventures with Aether Sage.",
    characters: [{ name: "Aether Sage", persona: "Mysterious, celestial, deep cosmic thinker." }]
  }
];

export default function HomeDiscoveryView({
  chats = [],
  onSelectChat,
  onSessionCreated,
  onOpenNewModal,
  onSwitchToChatView
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loadingCharId, setLoadingCharId] = useState(null);
  const [bannerTab, setBannerTab] = useState("Characters");

  const filteredCharacters = DEFAULT_CHARACTERS.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.story.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "sales" && char.category === "Your Sales") ||
      (selectedFilter === "products" && char.category === "Products") ||
      (selectedFilter === "tools" && char.category === "Recent Tools") ||
      char.filterGroup === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const yourSalesChars = filteredCharacters.filter((c) => c.category === "Your Sales");
  const productsChars = filteredCharacters.filter((c) => c.category === "Products");
  const recentToolsChars = filteredCharacters.filter((c) => c.category === "Recent Tools");

  const handleStartCharacterChat = async (char, forceCreateNew = false) => {
    setLoadingCharId(char.id);

    if (!forceCreateNew) {
      const existing = chats.find(
        (c) => c.title.toLowerCase() === char.name.toLowerCase()
      );

      if (existing) {
        onSelectChat(existing.id);
        if (onSwitchToChatView) onSwitchToChatView();
        setLoadingCharId(null);
        return;
      }
    }

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: char.name,
          story: char.story,
          selectedModel: "gemini-3.5-flash-lite",
          characters: char.characters.map((c) => ({
            name: c.name,
            persona: c.persona || c.personality || "Interactive character persona."
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newSession = data.chatSession || data;
        onSessionCreated(newSession);
        if (onSwitchToChatView) onSwitchToChatView();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to start chat session with " + char.name);
      }
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Error starting chat.");
    } finally {
      setLoadingCharId(null);
    }
  };

  return (
    <div className="flex-1 strict-scroll-stream min-h-0 p-4 md:p-8 space-y-7 text-white font-sans relative select-none">
      {/* Top Search Filter Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-900/70 backdrop-blur-2xl border border-purple-500/20 p-3 md:px-5 rounded-2xl md:rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 flex-1 bg-neutral-950/80 border border-neutral-800 focus-within:border-purple-500/60 p-2 px-3.5 rounded-xl md:rounded-2xl transition-all">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            placeholder="Search characters, scenarios, personas or group debates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenNewModal}
            className="px-4 py-2 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Persona</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 font-bold"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-purple-400"}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-slate-950 border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-3.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
            <span>NextAiChat Discovery • Multi-Persona Roleplay Engine</span>
          </div>

          <h1 className="text-xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
            Chat with Endless AI Personas & Interactive Group Debates
          </h1>

          <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-lg">
            Experience real-time AI roleplays powered by Gemini 3.5. Create custom personas, trigger dynamic multi-character dialogues, or explore featured community characters.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setBannerTab("Characters")}
              className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                bannerTab === "Characters"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400"
                  : "bg-neutral-900/80 text-neutral-300 hover:text-white border border-neutral-800"
              }`}
            >
              <User className="w-4 h-4 text-purple-300" />
              <span>Explore Characters</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartCharacterChat(DEFAULT_CHARACTERS[4], true)}
              className="px-5 py-2 rounded-full text-xs font-bold bg-neutral-900/80 text-purple-300 hover:text-white border border-purple-800/60 hover:bg-purple-900/50 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Launch Group Debate</span>
            </button>
          </div>
        </div>

        <div className="relative shrink-0 hidden md:flex items-center gap-3">
          <div
            onClick={() => handleStartCharacterChat(DEFAULT_CHARACTERS[0], false)}
            className="w-36 h-48 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl relative group/card cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <img
              src={DEFAULT_CHARACTERS[0].avatar}
              alt="Priya Spotlight"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[11px] font-bold text-white block truncate">{DEFAULT_CHARACTERS[0].name}</span>
              <span className="text-[9px] text-amber-400 font-mono font-semibold">★ 4.9 • 42.8k</span>
            </div>
          </div>

          <div
            onClick={() => handleStartCharacterChat(DEFAULT_CHARACTERS[4], false)}
            className="w-36 h-48 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl relative group/card cursor-pointer hover:scale-105 transition-all duration-300 translate-y-3"
          >
            <img
              src={DEFAULT_CHARACTERS[4].avatar}
              alt="Annasip Spotlight"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[11px] font-bold text-white block truncate">{DEFAULT_CHARACTERS[4].name}</span>
              <span className="text-[9px] text-cyan-400 font-mono font-semibold">★ 5.0 • Duo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section 1: "Your Sales" */}
      {yourSalesChars.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">Your Sales</h3>
            </div>
            <button
              type="button"
              onClick={onOpenNewModal}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-4.5">
            {yourSalesChars.map((char) => (
              <div
                key={char.id}
                onClick={() => handleStartCharacterChat(char, false)}
                className="group relative bg-neutral-900/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/60 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex flex-col"
              >
                <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {char.badge && (
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md ${char.badgeBg} text-[10px] tracking-wide`}>
                      {char.badge}
                    </span>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-300">AI</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
                </div>

                <div className="p-3.5 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-purple-300 transition-colors">{char.name}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{char.tagline}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-800/60 text-[10px] text-neutral-400">
                    <span className="font-mono">{char.chatsCount} turns</span>
                    {loadingCharId === char.id ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCharacterChat(char, true);
                        }}
                        className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                        title={`Create new fresh session with ${char.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Section 2: "Products" */}
      {productsChars.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">Products</h3>
            </div>
            <button
              type="button"
              onClick={onOpenNewModal}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-4.5">
            {productsChars.map((char) => (
              <div
                key={char.id}
                onClick={() => handleStartCharacterChat(char, false)}
                className="group relative bg-neutral-900/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/60 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex flex-col"
              >
                <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {char.badge && (
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md ${char.badgeBg} text-[10px] tracking-wide`}>
                      {char.badge}
                    </span>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-300">AI</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
                </div>

                <div className="p-3.5 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-purple-300 transition-colors">{char.name}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{char.tagline}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-800/60 text-[10px] text-neutral-400">
                    <span className="font-mono">{char.chatsCount} turns</span>
                    {loadingCharId === char.id ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCharacterChat(char, true);
                        }}
                        className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                        title={`Create new fresh session with ${char.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Section 3: "Recent Tools" */}
      {recentToolsChars.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">Recent Tools</h3>
            </div>
            <button
              type="button"
              onClick={onOpenNewModal}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-4.5">
            {recentToolsChars.map((char) => (
              <div
                key={char.id}
                onClick={() => handleStartCharacterChat(char, false)}
                className="group relative bg-neutral-900/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/60 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex flex-col"
              >
                <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
                  <img
                    src={char.avatar}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {char.badge && (
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md ${char.badgeBg} text-[10px] tracking-wide`}>
                      {char.badge}
                    </span>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-neutral-300">AI</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />
                </div>

                <div className="p-3.5 pt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-purple-300 transition-colors">{char.name}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">{char.tagline}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-800/60 text-[10px] text-neutral-400">
                    <span className="font-mono">{char.chatsCount} turns</span>
                    {loadingCharId === char.id ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCharacterChat(char, true);
                        }}
                        className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
                        title={`Create new fresh session with ${char.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
