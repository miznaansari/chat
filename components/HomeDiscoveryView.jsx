"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  User,
  ChevronRight,
  Plus,
  Loader2,
  Users,
  X,
  BookOpen,
  Star
} from "lucide-react";

const DEFAULT_CHARACTERS = [
  {
    id: "default-ananya",
    name: "Prof. Ananya / Sarah",
    tagline: "Subject & Exam Prep Tutor",
    badge: "Exam Prep",
    badgeBg: "bg-purple-950/90 border border-purple-700/60 text-purple-300 font-extrabold",
    avatar: "/avatars/tutor_ananya.png",
    category: "Exam & Tutors",
    filterGroup: "assistants",
    chatsCount: 1420,
    rating: "4.9",
    story: "Simulates oral exams, tests knowledge with mock questions & explains any subject step-by-step.",
    characters: [
      { name: "Prof. Ananya", persona: "Patient academic professor who conducts structured exam prep and step-by-step subject explanations." },
      { name: "Sarah", persona: "Supportive study peer who breaks down difficult concepts into simple conversational analogies." }
    ]
  },
  {
    id: "default-delhi",
    name: "Delhi College Squad (Simran & Neha)",
    tagline: "Hinglish Campus Gossip & Exam Prep",
    badge: "Hinglish Squad",
    badgeBg: "bg-pink-950/90 border border-pink-700/60 text-pink-300 font-extrabold",
    avatar: "/avatars/delhi_college_squad.png",
    category: "Hinglish & Campus",
    filterGroup: "assistants",
    chatsCount: 2890,
    rating: "5.0",
    story: "Join Simran and Neha in the college canteen! Discuss semester exams, campus gossip, Hinglish slang, assignment stress & canteen chai breaks.",
    characters: [
      { name: "Simran", persona: "Cool expressive Delhi college girl speaking natural Hinglish (Bhai tension mat le, viva clear kar lenge!)." },
      { name: "Neha", persona: "Studious topper college friend who keeps track of syllabus deadlines and internal marks." }
    ]
  },
  {
    id: "default-kota",
    name: "Kota Physics Gurukul (Er. Verma & Rohit)",
    tagline: "JEE / NEET Physics & Shortcut Tricks",
    badge: "Physics Gurukul",
    badgeBg: "bg-blue-950/90 border border-blue-700/60 text-blue-300 font-extrabold",
    avatar: "/avatars/kota_verma_teacher.png",
    category: "Exam & Tutors",
    filterGroup: "products",
    chatsCount: 3410,
    rating: "5.0",
    story: "Simulate a live 1-on-1 coaching session with Er. Verma and AIR-10 ranker Rohit. Master physics formulas, JEE numerical tricks & exam confidence.",
    characters: [
      { name: "Er. Verma", persona: "Experienced Indian coaching physics teacher who breaks down complex numericals with intuitive Hinglish analogies." },
      { name: "Rohit", persona: "AIR 10 JEE Topper student sharing quick calculation shortcuts and revision routines." }
    ]
  },
  {
    id: "default-tech",
    name: "Bangalore Tech Founders (Aarav & Riya)",
    tagline: "AI Pitch Deck, Start-Up Strategy & Coding",
    badge: "Start-Up Lab",
    badgeBg: "bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 font-extrabold",
    avatar: "/avatars/tech_founders_aarav.png",
    category: "Tech & Startups",
    filterGroup: "tools",
    chatsCount: 1980,
    rating: "4.9",
    story: "Brainstorm startup ideas, product architecture, pitch deck slides, and Hinglish tech banter with Aarav (CTO) and Riya (CEO).",
    characters: [
      { name: "Aarav", persona: "Genius Indian CTO focused on AI model architectures, system design, and clean scalable code." },
      { name: "Riya", persona: "Charismatic CEO focused on fundraising pitches, growth hacking, and product-market fit." }
    ]
  },
  {
    id: "default-vikram",
    name: "Dr. Vikram / Marcus",
    tagline: "Science & Math Master",
    badge: "Problem Solver",
    badgeBg: "bg-indigo-950/90 border border-indigo-700/60 text-indigo-300 font-extrabold",
    avatar: "/avatars/math_vikram.png",
    category: "Exam & Tutors",
    filterGroup: "products",
    chatsCount: 1850,
    rating: "5.0",
    story: "Master complex formulas, competitive exam strategies, and conceptual problem-solving step-by-step.",
    characters: [
      { name: "Dr. Vikram", persona: "Expert STEM mentor specializing in physics, calculus, and competitive exam problem solving." },
      { name: "Marcus", persona: "Analytical lab partner focused on logic puzzles and quick memory tricks." }
    ]
  },
  {
    id: "default-priya",
    name: "Coach Priya / Emma",
    tagline: "English Speaking & Fluency",
    badge: "Spoken English",
    badgeBg: "bg-cyan-950/90 border border-cyan-700/60 text-cyan-300 font-extrabold",
    avatar: "/avatars/coach_priya.png",
    category: "Languages & Career",
    filterGroup: "assistants",
    chatsCount: 2310,
    rating: "4.9",
    story: "Practice conversational English, gentle grammar corrections in parentheses & build speaking confidence.",
    characters: [
      { name: "Coach Priya", persona: "Empathetic ESL instructor who helps non-native speakers speak naturally with real-time feedback." },
      { name: "Emma", persona: "Fluent native English speaker engaging in everyday warm casual dialogue." }
    ]
  },
  {
    id: "default-rohan",
    name: "Coach Rohan / Alex",
    tagline: "Fluency & Pronunciation Coach",
    badge: "Interview Prep",
    badgeBg: "bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 font-extrabold",
    avatar: "/avatars/coach_rohan.png",
    category: "Languages & Career",
    filterGroup: "tools",
    chatsCount: 980,
    rating: "4.8",
    story: "Improve interview speaking skills, professional English vocabulary & accent confidence.",
    characters: [
      { name: "Coach Rohan", persona: "Corporate interview coach training candidates on mock interview responses and corporate articulation." },
      { name: "Alex", persona: "HR recruiter conducting realistic mock job interview simulations." }
    ]
  },
  {
    id: "default-diya",
    name: "Mentor Diya / Maya",
    tagline: "Calm Wellness & Anti-Depression",
    badge: "Mental Wellness",
    badgeBg: "bg-amber-950/90 border border-amber-700/60 text-amber-300 font-extrabold",
    avatar: "/avatars/mentor_diya.png",
    category: "Wellness & Mindset",
    filterGroup: "assistants",
    chatsCount: 3100,
    rating: "5.0",
    story: "A compassionate, quiet space to share stress, manage anxiety, work through depression & find peace of mind.",
    characters: [
      { name: "Mentor Diya", persona: "Calm, gentle mindfulness practitioner offering soothing listening and emotional grounding techniques." },
      { name: "Maya", persona: "Warm empathetic friend who listens without judgment and validates feelings." }
    ]
  },
  {
    id: "default-kabir",
    name: "Mentor Kabir / Julian",
    tagline: "Mindset & Stress Relief",
    badge: "Habit & Reset",
    badgeBg: "bg-rose-950/90 border border-rose-700/60 text-rose-300 font-extrabold",
    avatar: "/avatars/mentor_kabir.png",
    category: "Wellness & Mindset",
    filterGroup: "products",
    chatsCount: 1640,
    rating: "4.9",
    story: "Overcome burnout, stay focused, reframe low moods, and build positive resilient habits.",
    characters: [
      { name: "Mentor Kabir", persona: "Resilience coach guiding users through stress reframing, habit building, and mental resets." },
      { name: "Julian", persona: "Motivational mentor focused on overcoming procrastination and personal productivity." }
    ]
  }
];

export default function HomeDiscoveryView({
  chats = [],
  onSelectChat,
  onSessionCreated,
  onOpenNewModal,
  onSwitchToChatView
}) {
  const [displayCharacters, setDisplayCharacters] = useState(DEFAULT_CHARACTERS);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Showcase");
  const [loadingCharId, setLoadingCharId] = useState(null);
  const [bannerTab, setBannerTab] = useState("Characters");
  const [selectedCharPreview, setSelectedCharPreview] = useState(null);

  useEffect(() => {
    fetchPublicCharacters();
  }, []);

  const fetchPublicCharacters = async () => {
    try {
      const res = await fetch("/api/discover-characters");
      if (res.ok) {
        const data = await res.json();
        if (data.characters && data.characters.length > 0) {
          setDisplayCharacters(data.characters);
        }
      }
    } catch (err) {
      console.error("Failed to fetch public characters", err);
    } finally {
      setFetching(false);
    }
  };

  const incrementChatsCount = async (charId, charName) => {
    try {
      const targetId = charId || charName;
      await fetch(`/api/discover-characters/${encodeURIComponent(targetId)}/increment`, {
        method: "POST",
      });

      setDisplayCharacters((prev) =>
        prev.map((c) => {
          if (c.id === charId || c.name === charName) {
            const current = typeof c.chatsCount === "number" ? c.chatsCount : parseInt(c.chatsCount) || 0;
            return { ...c, chatsCount: current + 1 };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to increment chats count", err);
    }
  };

  // Derive Dynamic Categories directly from actual characters in state
  const dynamicCategories = ["All Showcase", ...Array.from(new Set(displayCharacters.map((c) => c.category).filter(Boolean)))];

  const filteredCharacters = displayCharacters.filter((char) => {
    const matchesSearch =
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (char.story && char.story.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "all" ||
      selectedFilter === "All Showcase" ||
      char.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleStartCharacterChat = async (char, forceCreateNew = false) => {
    setLoadingCharId(char.id);

    incrementChatsCount(char.id, char.name);

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
      const parsedCharacters = Array.isArray(char.characters) && char.characters.length > 0
        ? char.characters.map((c) => ({
            name: c.name,
            persona: c.persona || c.personality || "Interactive character persona.",
          }))
        : [{ name: char.name, persona: char.tagline }];

      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: char.name,
          story: char.story,
          selectedModel: "gemini-3.5-flash-lite",
          characters: parsedCharacters,
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

  const SkeletonCard = () => (
    <div className="bg-neutral-900/40 backdrop-blur-xl border border-purple-500/10 rounded-2xl md:rounded-3xl overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-square w-full bg-neutral-800/60" />
      <div className="p-3.5 space-y-2">
        <div className="h-4 bg-neutral-800/80 rounded w-3/4" />
        <div className="h-3 bg-neutral-800/40 rounded w-full" />
        <div className="pt-2.5 flex items-center justify-between border-t border-neutral-800/40">
          <div className="h-3 bg-neutral-800/50 rounded w-1/3" />
          <div className="w-6 h-6 rounded-full bg-neutral-800/80" />
        </div>
      </div>
    </div>
  );

  const CharacterCard = ({ char }) => (
    <div
      key={char.id}
      onClick={() => setSelectedCharPreview(char)}
      className="group relative bg-neutral-900/80 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex flex-col h-full active:scale-95"
    >
      <div className="relative h-28 sm:h-36 w-full bg-neutral-950 overflow-hidden shrink-0">
        <img
          src={char.avatar}
          alt={char.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {char.badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded ${char.badgeBg || "bg-purple-950 text-purple-300 border border-purple-700"} text-[9px] font-extrabold shadow-sm`}>
            {char.badge}
          </span>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-mono text-amber-400 font-bold">★ {char.rating || "4.9"}</span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-xs sm:text-sm text-white truncate group-hover:text-purple-300 transition-colors">{char.name}</h4>
          <p className="text-[10px] sm:text-xs text-purple-300 font-medium truncate">{char.tagline}</p>
        </div>

        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
          <span className="font-mono">{char.chatsCount} chats</span>
          {loadingCharId === char.id ? (
            <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 group-hover:bg-purple-600 group-hover:text-white font-bold text-[10px] transition-all">
              Preview →
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 strict-scroll-stream min-h-0 p-4 md:p-8 space-y-7 text-white font-sans relative">
      
      {/* Standalone Search Bar & Create Persona Row */}
      <div className="flex flex-row items-center justify-between gap-2.5 md:gap-4">
        {/* Standalone Floating Search Capsule */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/90 focus-within:border-purple-500/70 p-2.5 px-4 rounded-2xl md:rounded-3xl shadow-lg transition-all">
          <Search className="w-4 h-4 text-purple-400 shrink-0" />
          <input
            type="text"
            placeholder="Search characters or personas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0 bg-transparent text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none truncate"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Create Persona Button */}
        <button
          type="button"
          onClick={onOpenNewModal}
          className="shrink-0 px-4 py-2.5 rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Create Persona</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Dynamic Category Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth touch-pan-x">
        {dynamicCategories.map((cat) => {
          const isActive = selectedFilter === cat || (selectedFilter === "all" && cat === "All Showcase");
          return (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 font-bold"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-purple-400"}`} />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Showcase Banner (Desktop Only - Hidden on Mobile & Tablet) */}
      <div className="hidden lg:flex relative rounded-3xl p-5 md:p-8 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-slate-950 border border-purple-500/30 shadow-2xl overflow-hidden flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group">
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
              onClick={() => setSelectedCharPreview(displayCharacters[1] || DEFAULT_CHARACTERS[1])}
              className="px-5 py-2 rounded-full text-xs font-bold bg-neutral-900/80 text-purple-300 hover:text-white border border-purple-800/60 hover:bg-purple-900/50 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Launch Group Debate</span>
            </button>
          </div>
        </div>

        <div className="relative shrink-0 hidden md:flex items-center gap-3">
          <div
            onClick={() => setSelectedCharPreview(displayCharacters[0] || DEFAULT_CHARACTERS[0])}
            className="w-36 h-48 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl relative group/card cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <img
              src={displayCharacters[0]?.avatar || DEFAULT_CHARACTERS[0].avatar}
              alt="Spotlight"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[11px] font-bold text-white block truncate">{displayCharacters[0]?.name || "Prof. Ananya"}</span>
              <span className="text-[9px] text-amber-400 font-mono font-semibold">★ {displayCharacters[0]?.rating || "4.9"}</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCharPreview(displayCharacters[1] || DEFAULT_CHARACTERS[1])}
            className="w-36 h-48 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl relative group/card cursor-pointer hover:scale-105 transition-all duration-300 translate-y-3"
          >
            <img
              src={displayCharacters[1]?.avatar || DEFAULT_CHARACTERS[1].avatar}
              alt="Spotlight Duo"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[11px] font-bold text-white block truncate">{displayCharacters[1]?.name || "Delhi Squad"}</span>
              <span className="text-[9px] text-cyan-400 font-mono font-semibold">★ 5.0 • Duo</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CATEGORY SHOWCASE SECTIONS */}
      {fetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : selectedFilter !== "all" && selectedFilter !== "All Showcase" ? (
        /* Filtered Single Category View */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">{selectedFilter}</h3>
              <span className="text-xs font-mono text-purple-300 font-bold">({filteredCharacters.length})</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFilter("All Showcase")}
              className="text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Show All Showcase →
            </button>
          </div>

          {filteredCharacters.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
              No characters found matching filter.
            </div>
          ) : (
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
              {filteredCharacters.map((char) => (
                <div key={char.id} className="w-[155px] sm:w-auto shrink-0 snap-start">
                  <CharacterCard char={char} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Showcase View: Dynamically Grouped by Database Categories */
        <div className="space-y-7">
          {dynamicCategories.filter((cat) => cat !== "All Showcase").map((cat) => {
            const categoryChars = filteredCharacters.filter((c) => c.category === cat);
            if (categoryChars.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">{cat}</h3>
                    <span className="text-xs font-mono text-purple-300 font-bold">({categoryChars.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFilter(cat)}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All ({categoryChars.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Compact Touch-Pan-X Horizontal Slider on Mobile */}
                <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
                  {categoryChars.map((char) => (
                    <div key={char.id} className="w-[155px] sm:w-auto shrink-0 snap-start">
                      <CharacterCard char={char} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHARACTER PREVIEW & CONFIRMATION MODAL */}
      {selectedCharPreview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-3.5 sm:p-4 overflow-hidden">
          <div className="relative w-full max-w-xl bg-[#090d16] border border-purple-500/40 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(147,51,234,0.4)] my-auto flex flex-col h-[calc(100dvh-28px)] sm:h-auto sm:max-h-[85vh] animate-fadeIn font-sans">
            
            {/* Modal Header Bar */}
            <div className="relative p-4 sm:p-5 bg-neutral-950/90 border-b border-neutral-800/80 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCharPreview(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3 pr-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-neutral-900 border border-purple-500/40 shrink-0 shadow-lg">
                  <img src={selectedCharPreview.avatar} alt={selectedCharPreview.name} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                      {selectedCharPreview.name}
                    </h3>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 shrink-0">
                      {selectedCharPreview.category}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-purple-300 font-medium truncate">{selectedCharPreview.tagline}</p>
                </div>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
              
              {/* Roleplay Storyline Background */}
              <div className="space-y-2">
                <h4 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Roleplay Storyline & Scenario</span>
                </h4>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal shadow-inner">
                  {selectedCharPreview.story}
                </div>
              </div>

              {/* Multi-Speaker Personas */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                  <span>Multi-Speaker Personas ({Array.isArray(selectedCharPreview.characters) ? selectedCharPreview.characters.length : 1})</span>
                </h4>

                <div className="space-y-2">
                  {(Array.isArray(selectedCharPreview.characters) && selectedCharPreview.characters.length > 0
                    ? selectedCharPreview.characters
                    : [{ name: selectedCharPreview.name, persona: selectedCharPreview.tagline }]
                  ).map((p, idx) => (
                    <div key={idx} className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                          <span>🗣️</span>
                          <span>{p.name}</span>
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500">Speaker #{idx + 1}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {p.persona || p.personality || "Interactive character persona."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Fixed Footer Action Bar */}
            <div className="p-4 sm:px-6 sm:py-4 bg-neutral-950/95 border-t border-neutral-800/80 flex items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCharPreview(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer border border-neutral-800 shrink-0"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={loadingCharId === selectedCharPreview.id}
                onClick={() => {
                  const target = selectedCharPreview;
                  setSelectedCharPreview(null);
                  handleStartCharacterChat(target, false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide whitespace-nowrap"
              >
                {loadingCharId === selectedCharPreview.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Launching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>START ROLEPLAY CHAT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
