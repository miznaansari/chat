"use client";

import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Search,
  Sparkles,
  User,
  ChevronRight,
  ChevronLeft,
  Plus,
  Loader2,
  Users,
  X,
  BookOpen,
  Star,
  AlertTriangle,
  UserCheck,
  MessageSquare,
  RotateCcw,
  History
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

// Dynamic Color palette matching ChatView.jsx for character avatar & speaker chips
const SPEAKER_CHIP_COLORS = [
  "from-blue-900/90 via-indigo-950 to-blue-950 border-blue-400/60 shadow-blue-500/20",
  "from-purple-900/90 via-pink-950 to-purple-950 border-purple-400/60 shadow-purple-500/20",
  "from-emerald-900/90 via-teal-950 to-emerald-950 border-emerald-400/60 shadow-emerald-500/20",
  "from-amber-900/90 via-orange-950 to-amber-950 border-amber-400/60 shadow-amber-500/20",
  "from-rose-900/90 via-red-950 to-rose-950 border-rose-400/60 shadow-rose-500/20",
];

function getSpeakerChipStyle(charName) {
  if (!charName) return SPEAKER_CHIP_COLORS[0];
  let hash = 0;
  for (let i = 0; i < charName.length; i++) {
    hash = charName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SPEAKER_CHIP_COLORS.length;
  return SPEAKER_CHIP_COLORS[index];
}

const SLIDER_CARD_THEMES = [
  { bg: "bg-[#f2efe9]", text: "text-neutral-900", subText: "text-neutral-600", btn: "bg-[#27272a] text-white hover:bg-black", brand: "text-neutral-800" },
  { bg: "bg-[#b8802a]", text: "text-white", subText: "text-amber-100", btn: "bg-white text-neutral-900 hover:bg-amber-50", brand: "text-amber-100" },
  { bg: "bg-[#8c1d24]", text: "text-white", subText: "text-rose-100", btn: "bg-white text-neutral-900 hover:bg-rose-50", brand: "text-rose-100" },
  { bg: "bg-[#1e293b]", text: "text-white", subText: "text-slate-300", btn: "bg-white text-neutral-900 hover:bg-slate-100", brand: "text-slate-300" },
  { bg: "bg-[#14532d]", text: "text-white", subText: "text-emerald-100", btn: "bg-white text-neutral-900 hover:bg-emerald-50", brand: "text-emerald-100" },
  { bg: "bg-[#e5e0d8]", text: "text-neutral-900", subText: "text-neutral-600", btn: "bg-[#18181b] text-white hover:bg-black", brand: "text-neutral-800" },
  { bg: "bg-[#581c87]", text: "text-white", subText: "text-purple-200", btn: "bg-white text-neutral-900 hover:bg-purple-50", brand: "text-purple-200" },
  { bg: "bg-[#0f766e]", text: "text-white", subText: "text-teal-100", btn: "bg-white text-neutral-900 hover:bg-teal-50", brand: "text-teal-100" },
  { bg: "bg-[#c2410c]", text: "text-white", subText: "text-orange-100", btn: "bg-white text-neutral-900 hover:bg-orange-50", brand: "text-orange-100" },
  { bg: "bg-[#334155]", text: "text-white", subText: "text-slate-200", btn: "bg-white text-neutral-900 hover:bg-slate-50", brand: "text-slate-200" },
];

function SliderCarouselSection({ items, onSelectPreview }) {
  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  let baseItems = items.filter((c) => c.category === "slider");
  if (!baseItems || baseItems.length === 0) {
    baseItems = items.slice(0, 6);
  }

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (!baseItems || baseItems.length === 0) return null;

  return (
    <div className="space-y-3 my-2 font-sans select-none overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
        }}
        plugins={[plugin.current]}
        className="w-full relative"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between px-4 sm:px-1 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <h3 className="text-base md:text-lg font-black text-white tracking-wide">
              Trending Stories 🔥
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>

        {/* Carousel Content */}
        <CarouselContent className="-ml-2.5 sm:-ml-4">
          {baseItems.map((char, idx) => {
            const isCenter = idx === selectedIndex;
            const theme = SLIDER_CARD_THEMES[idx % SLIDER_CARD_THEMES.length];
            const cleanTitle = char.name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

            return (
              <CarouselItem
                key={`${char.id || char.name}-${idx}`}
                className="pl-2.5 sm:pl-4 basis-[70%] sm:basis-[52%] md:basis-[46%] max-w-[290px] sm:max-w-[500px]"
              >
                <div
                  onClick={() => {
                    if (idx === selectedIndex) {
                      onSelectPreview(char);
                    } else if (api) {
                      api.scrollTo(idx);
                    }
                  }}
                  style={{
                    borderRadius: "24px",
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    isolation: "isolate",
                  }}
                  className={`group relative transition-all duration-500 ease-out cursor-pointer rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-row h-[145px] sm:h-[220px] ${theme.bg} ${
                    isCenter
                      ? "scale-100 opacity-100 z-20 ring-2 ring-white/20 shadow-2xl shadow-black/50"
                      : "scale-[0.90] opacity-75 z-10 shadow-lg"
                  }`}
                >
                  {/* Left Content Column */}
                  <div className="w-[58%] sm:w-[58%] p-2.5 sm:p-6 flex flex-col justify-between z-10 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className={`text-[8px] sm:text-xs font-black uppercase tracking-wider truncate ${theme.brand}`}>
                        NextAiChat <span className="opacity-40">|</span> {char.badge || "Story"}
                      </span>
                    </div>

                    <div className="space-y-0.5 my-auto">
                      <h4 className={`font-black text-[11px] sm:text-lg leading-tight tracking-tight uppercase line-clamp-1 sm:line-clamp-2 ${theme.text}`}>
                        {cleanTitle}
                      </h4>
                      <p className={`text-[9px] sm:text-xs font-medium line-clamp-1 sm:line-clamp-2 leading-tight ${theme.subText}`}>
                        {char.tagline}
                      </p>
                    </div>

                    <div className="pt-0.5 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        className={`px-2.5 sm:px-5 py-0.5 sm:py-2 rounded-lg sm:rounded-2xl font-black text-[9px] sm:text-xs transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer ${theme.btn}`}
                      >
                        <span>Start now</span>
                      </button>

                      <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/20 text-white/90 backdrop-blur-sm">
                        ★ {char.rating || "4.9"}
                      </span>
                    </div>
                  </div>

                  {/* Right Image Column (Fills width and height of container) */}
                  <div className="w-[42%] sm:w-[42%] h-full relative overflow-hidden shrink-0 rounded-r-[24px] sm:rounded-r-[32px]">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 rounded-r-[24px] sm:rounded-r-[32px]"
                    />
                    <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {baseItems.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => api?.scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === selectedIndex ? "w-6 bg-pink-500" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}

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

  // User Persona State
  const [userPersonas, setUserPersonas] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState("");

  // Existing Chat Prompt State
  const [existingChatPrompt, setExistingChatPrompt] = useState(null);

  useEffect(() => {
    fetchPublicCharacters();
    fetchUserPersonas();
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

  const fetchUserPersonas = async () => {
    try {
      const res = await fetch("/api/user/personas");
      if (res.ok) {
        const data = await res.json();
        const list = data.personas || [];
        setUserPersonas(list);
        if (list.length > 0) {
          const def = list.find((p) => p.isDefault) || list[0];
          setSelectedPersonaId(def.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user personas", err);
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

  // Derive Dynamic Categories with "Game" and "WhatsApp Group" explicitly prioritized at the top
  const rawCategories = Array.from(new Set(displayCharacters.map((c) => c.category).filter(Boolean)));
  const sortedCategories = rawCategories.sort((a, b) => {
    const getWeight = (cat) => {
      const lower = cat.toLowerCase();
      if (lower === "slider" || lower.includes("slider")) return 0;
      if (lower === "game" || lower.includes("game")) return 1;
      if (lower.includes("whatsapp")) return 2;
      if (lower.includes("exam")) return 3;
      return 10;
    };
    const wA = getWeight(a);
    const wB = getWeight(b);
    if (wA !== wB) return wA - wB;
    return a.localeCompare(b);
  });
  const dynamicCategories = ["All Showcase", ...sortedCategories];

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

    if (!forceCreateNew) {
      const existing = chats.find(
        (c) =>
          c.discoverCharacterId === char.id ||
          c.title.toLowerCase() === char.name.toLowerCase()
      );

      if (existing) {
        setExistingChatPrompt({ char, existingSession: existing });
        setLoadingCharId(null);
        return;
      }
    }

    incrementChatsCount(char.id, char.name);

    try {
      const parsedCharacters = Array.isArray(char.characters) && char.characters.length > 0
        ? char.characters.map((c) => ({
          name: c.name,
          persona: c.persona || c.personality || "Interactive character persona.",
        }))
        : [{ name: char.name, persona: char.tagline }];

      // Attach selected "Me Persona" if available
      let pId = null;
      let pName = null;
      let pDetails = null;

      if (selectedPersonaId) {
        const found = userPersonas.find((p) => p.id === selectedPersonaId);
        if (found) {
          pId = found.id;
          pName = found.name;
          pDetails = found.persona;
        }
      }

      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: char.name,
          story: char.story,
          selectedModel: "gemini-3.5-flash-lite",
          characters: parsedCharacters,
          userPersonaId: pId,
          userPersonaName: pName,
          userPersonaDetails: pDetails,
          discoverCharacterId: char.id,
          discoveryChatId: char.id,
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
    <div className="bg-neutral-900/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden animate-pulse flex flex-col h-full">
      <div className="h-28 sm:h-36 w-full bg-neutral-800/70 shrink-0 relative" />
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          <div className="h-3.5 bg-neutral-800/80 rounded-md w-3/4" />
          <div className="h-2.5 bg-neutral-800/50 rounded-md w-full" />
        </div>
        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
          <div className="h-2.5 bg-neutral-800/60 rounded-md w-12" />
          <div className="h-5 w-14 rounded-lg bg-neutral-800/80" />
        </div>
      </div>
    </div>
  );

  const CharacterCard = ({ char }) => (
    <div
      key={char.id}
      onClick={() => setSelectedCharPreview(char)}
      className="group relative bg-neutral-900/80 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/60 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] flex flex-col h-full touch-manipulation select-none md:active:scale-95"
    >
      {/* Floating Badge Tag - Positioned at top-right corner floating slightly outside */}
      {char.badge && (
        <span
          className={`absolute -top-2.5 -right-1 z-20 px-2 py-0.5 rounded-md ${char.badgeBg || "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold"
            } text-[9px] font-black uppercase tracking-wider shadow-lg border border-white/20 pointer-events-none transition-transform group-hover:scale-105`}
        >
          {char.badge}
        </span>
      )}

      {/* Photo Container - Clean avatar image with rounded top */}
      <div className="relative h-28 sm:h-36 w-full bg-neutral-950 overflow-hidden rounded-t-2xl shrink-0">
        <img
          src={char.avatar}
          alt={char.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
              Preview
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 strict-scroll-stream min-h-0 p-4 md:p-8 space-y-7 text-white font-sans relative touch-manipulation overscroll-contain">

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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${isActive
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

      {/* Featured Slider Carousel Section */}
      {(selectedFilter === "All Showcase" || selectedFilter === "all" || selectedFilter === "slider") && !searchQuery && (
        <SliderCarouselSection items={displayCharacters} onSelectPreview={setSelectedCharPreview} />
      )}

      {/* Hero Showcase Banner (Desktop Only - Ultra-Slim Header) */}
      <div className="hidden lg:flex relative rounded-2xl py-3 px-5 md:py-3.5 md:px-6 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-slate-950 border border-purple-500/30 shadow-lg overflow-hidden items-center justify-between gap-4 group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-[10px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            <span>NextAiChat Discovery • Multi-Persona Roleplay Engine</span>
          </div>

          <h1 className="text-sm md:text-lg font-extrabold text-white leading-snug tracking-tight">
            Chat with Endless AI Personas & Interactive Group Debates
          </h1>

          <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-[11px] text-purple-200 flex items-center gap-2 shadow-inner">
            <span className="font-extrabold text-amber-300 shrink-0">🔥 Highly Recommended:</span>
            <span>Try our multi-character roleplay mode — it will blow your mind! 🤯</span>
          </div>
        </div>

        <div className="relative shrink-0 hidden md:flex items-center gap-2.5">
          <div
            onClick={() => setSelectedCharPreview(displayCharacters[0] || DEFAULT_CHARACTERS[0])}
            className="w-24 h-28 rounded-xl overflow-hidden border border-purple-500/40 shadow-md relative group/card cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <img
              src={displayCharacters[0]?.avatar || DEFAULT_CHARACTERS[0].avatar}
              alt="Spotlight"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 left-1 right-1 text-center">
              <span className="text-[9px] font-extrabold text-white block truncate">{displayCharacters[0]?.name || "Featured"}</span>
              <span className="text-[8px] text-amber-400 font-mono font-semibold">★ {displayCharacters[0]?.rating || "4.9"}</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedCharPreview(displayCharacters[1] || DEFAULT_CHARACTERS[1])}
            className="w-24 h-28 rounded-xl overflow-hidden border border-cyan-500/40 shadow-md relative group/card cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <img
              src={displayCharacters[1]?.avatar || DEFAULT_CHARACTERS[1].avatar}
              alt="Spotlight Duo"
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-1.5 left-1 right-1 text-center">
              <span className="text-[9px] font-extrabold text-white block truncate">{displayCharacters[1]?.name || "Duo"}</span>
              <span className="text-[8px] text-cyan-400 font-mono font-semibold">★ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CATEGORY SHOWCASE SECTIONS */}
      {fetching ? (
        <div className="space-y-7">
          {[1, 2].map((catIdx) => (
            <div key={catIdx} className="space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                <div className="h-5 w-36 bg-neutral-800/60 rounded-lg animate-pulse" />
                <div className="h-4 w-16 bg-neutral-800/40 rounded-lg animate-pulse" />
              </div>
              <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div key={idx} className="w-[155px] sm:w-auto shrink-0">
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (selectedFilter !== "all" && selectedFilter !== "All Showcase") || searchQuery.trim() !== "" ? (
        /* Filtered / Searched Category View: Show ALL cards on screen in a full responsive grid (No horizontal scroll container) */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base md:text-lg font-extrabold text-white tracking-wide">
                {searchQuery ? `Search results for "${searchQuery}"` : selectedFilter}
              </h3>
              <span className="text-xs font-mono text-purple-300 font-bold">({filteredCharacters.length})</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFilter("All Showcase");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              Show All Showcase →
            </button>
          </div>



          {filteredCharacters.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
              No characters found matching filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {filteredCharacters.map((char) => (
                <div key={char.id} className="w-full">
                  <CharacterCard char={char} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All Showcase View: Dynamically Grouped by Database Categories (Slider category excluded here as it is featured in the top carousel) */
        <div className="space-y-7">
          {dynamicCategories.filter((cat) => cat !== "All Showcase" && cat.toLowerCase() !== "slider").map((cat) => {
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

                {/* Compact Touch-Manipulated Horizontal Slider on Mobile */}
                <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-x-auto sm:overflow-x-visible pt-2.5 pb-2 sm:pb-0 snap-x snap-mandatory scrollbar-none touch-manipulation -mx-4 px-4 sm:mx-0 sm:px-0">
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

      {/* AI DISCLAIMER FOOTER NOTICE */}
      <div className="mt-10 mb-6 pt-6 border-t border-neutral-800/60 text-center space-y-2">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>AI Generated Characters Disclaimer</span>
        </div>
        <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
          All characters on this platform are <span className="text-purple-300 font-semibold">AI-generated fictional personas</span> and do not represent real individuals, living or deceased.
        </p>
        <p className="text-[11px] text-neutral-400/80 font-mono">
          © {new Date().getFullYear()} NextAIChat • AI Character Roleplay Platform
        </p>
      </div>

      {/* CHARACTER PREVIEW & CONFIRMATION MODAL */}
      {selectedCharPreview && (
        <div
          onClick={() => setSelectedCharPreview(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[999999] flex items-center justify-center p-3.5 sm:p-4 pt-16 pb-20 md:pt-6 md:pb-6 overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#090d16] border border-purple-500/40 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(147,51,234,0.4)] my-auto flex flex-col h-auto max-h-[calc(100vh-140px)] md:max-h-[85vh] animate-fadeIn font-sans"
          >

            {/* Scrollable Container containing Hero Banner + Sticky Title Bar + Body Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">

              {/* Modal Full-Width Top Hero Image & Title Overlay */}
              <div className="relative w-full h-52 sm:h-64 bg-neutral-950 overflow-hidden shrink-0">
                {/* Ambient Blurred Background */}
                <img
                  src={selectedCharPreview.avatar}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
                />

                {/* Main Full Image Fitted Without Cropping */}
                <img
                  src={selectedCharPreview.avatar}
                  alt={selectedCharPreview.name}
                  className="relative z-10 w-full h-full object-contain mx-auto drop-shadow-2xl"
                />

                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#090d16] via-transparent to-black/40 pointer-events-none" />

                {/* Close Button Floating on Top-Right */}
                <button
                  type="button"
                  onClick={() => setSelectedCharPreview(null)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-20 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Character Badge / Rating Pills at Top-Left */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-10 flex-wrap pr-12">
                  {selectedCharPreview.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full ${selectedCharPreview.badgeBg || "bg-purple-950/90 text-purple-300 border border-purple-700/60"} text-[10px] font-extrabold shadow-md backdrop-blur-md`}>
                      {selectedCharPreview.badge}
                    </span>
                  )}
                  {/* {selectedCharPreview.rating && (
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 font-bold font-mono text-[10px] flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ★ {selectedCharPreview.rating}
                    </span>
                  )} */}
                </div>

                {/* Title, Category & Tagline Layered on Bottom of Image */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-1 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                      {selectedCharPreview.name}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-950/90 border border-purple-700/80 text-purple-300 backdrop-blur-md shrink-0 shadow-md">
                      {selectedCharPreview.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-200/90 font-medium leading-relaxed drop-shadow">
                    {selectedCharPreview.tagline}
                  </p>
                </div>
              </div>

              {/* Sticky Title Bar - Pinned at top-0 when user scrolls down */}
              <div className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-b border-purple-500/30 px-4 py-3 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src={selectedCharPreview.avatar}
                    alt={selectedCharPreview.name}
                    className="w-8 h-8 rounded-full border border-purple-500/40 object-cover shrink-0 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                        {selectedCharPreview.name}
                      </h4>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/90 border border-purple-700/80 text-purple-300 shrink-0 hidden sm:inline-block">
                        {selectedCharPreview.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-purple-300 truncate hidden sm:block">
                      {selectedCharPreview.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                    ★ {selectedCharPreview.rating || "4.9"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCharPreview(null)}
                    className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-4 sm:p-6 space-y-5">

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
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${getSpeakerChipStyle(p.name)} border text-xs font-extrabold shadow-md capitalize`}>
                            <span className="text-xs">🗣️</span>
                            <span className="text-white font-black tracking-wide drop-shadow">{p.name}</span>
                          </span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                            Speaker #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {p.persona || p.personality || "Interactive character persona."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlighted "Me Persona" (Who you play as) & Warning Notice */}
                {(() => {
                  const activePersona = userPersonas.find((p) => p.id === selectedPersonaId);
                  const hasPersona = Boolean(activePersona);

                  return (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-blue-950/80 border border-purple-500/50 space-y-3 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-[11px] font-extrabold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <UserCheck className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
                            <span className="hidden sm:inline">Who You Play As ("Me Persona")</span>
                            <span className="sm:hidden">Playing As ("Me Persona")</span>
                          </span>
                          <a
                            href="/setting"
                            className="text-[11px] font-bold text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
                          >
                            <span className="hidden sm:inline">+ Manage in Settings</span>
                            <span className="sm:hidden">+ Settings</span>
                          </a>
                        </div>

                        {hasPersona ? (
                          <div className="space-y-2.5">
                            {/* Active Persona Highlight Card */}
                            <div className="p-3 rounded-xl bg-neutral-950/90 border border-purple-400/40 space-y-1.5 shadow-inner">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-white flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>Playing as: <strong className="text-purple-300 font-extrabold">{activePersona.name}</strong></span>
                                </span>
                                {activePersona.isDefault && (
                                  <span className="text-[9px] font-extrabold font-mono px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 border border-purple-600">
                                    Default Persona
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-300 italic line-clamp-2 leading-relaxed bg-neutral-900/80 p-2 rounded-lg border border-neutral-800">
                                "{activePersona.persona}"
                              </p>
                            </div>

                            {/* Persona Switcher Dropdown (if user has multiple) */}
                            {userPersonas.length > 1 && (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-400 font-semibold shrink-0">Switch Persona:</span>
                                <select
                                  value={selectedPersonaId}
                                  onChange={(e) => setSelectedPersonaId(e.target.value)}
                                  className="flex-1 bg-neutral-950 border border-purple-800/60 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-400 font-medium"
                                >
                                  {userPersonas.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name} {p.isDefault ? "(Default)" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Warning Alert Banner inside Modal when NO Persona is created/selected */
                          <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/70 space-y-2 text-amber-200 shadow-md">
                            <div className="flex items-center gap-2 font-extrabold text-xs text-amber-300">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                              <span>⚠️ Warning: No "Me Persona" Added!</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-amber-100/90 font-medium">
                              AI character responses will <strong className="text-white underline">not be personalized</strong> to your specific background, tone, or personality because you haven't created a "Me Persona". Characters may reply generically!
                            </p>
                            <a
                              href="/setting"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-sm cursor-pointer mt-1"
                            >
                              <span>+ Create "Me Persona" Now</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

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

      {/* EXISTING CHAT DETECTED MODAL */}
      {existingChatPrompt && (
        <div
          onClick={() => setExistingChatPrompt(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[9999999] flex items-center justify-center p-4 overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#090d16] border border-purple-500/50 rounded-3xl overflow-hidden shadow-[0_0_90px_rgba(147,51,234,0.4)] p-6 space-y-5 animate-fadeIn font-sans text-center"
          >
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border-2 border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <History className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            {/* Character Info Card */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300 text-[10px] font-mono font-bold">
                <span>EXISTING CHAT DETECTED</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Aapne ye pehle se use kiya hua hai!
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto">
                You already have an active roleplay conversation with{" "}
                <strong className="text-purple-300 font-extrabold">{existingChatPrompt.char.name}</strong>.
              </p>
            </div>

            {/* Existing Chat Session Details Pill */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-purple-500/30 text-left space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white truncate max-w-[200px]">
                  {existingChatPrompt.existingSession.title}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {new Date(existingChatPrompt.existingSession.updatedAt || existingChatPrompt.existingSession.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 line-clamp-1">
                {existingChatPrompt.existingSession.story}
              </p>
            </div>

            {/* Actions: Redirect to existing, Create new, Close */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const targetSessionId = existingChatPrompt.existingSession.id;
                  setExistingChatPrompt(null);
                  onSelectChat(targetSessionId);
                  if (onSwitchToChatView) onSwitchToChatView();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-200" />
                <span>Redirect to Existing Chat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetChar = existingChatPrompt.char;
                  setExistingChatPrompt(null);
                  handleStartCharacterChat(targetChar, true);
                }}
                className="w-full py-3 rounded-xl bg-neutral-900 border border-purple-500/40 hover:border-purple-400 text-purple-300 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-neutral-850 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>Start Fresh New Session</span>
              </button>

              <button
                type="button"
                onClick={() => setExistingChatPrompt(null)}
                className="w-full py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
