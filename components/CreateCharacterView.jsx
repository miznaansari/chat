"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Trash2,
  Users,
  ArrowLeft,
  Loader2,
  Wand2,
  Bot,
  MessageSquareText,
  ShieldAlert,
} from "lucide-react";

export default function CreateCharacterView({ user }) {
  const router = useRouter();

  const [sessionTitle, setSessionTitle] = useState("");
  const [story, setStory] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite");

  const [characters, setCharacters] = useState([
    { id: 1, name: "", persona: "" },
    { id: 2, name: "", persona: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [optimizingField, setOptimizingField] = useState(null);

  const handleAddCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        persona: "",
      },
    ]);
  };

  const handleRemoveCharacter = (id) => {
    if (characters.length <= 1) {
      setError("At least one character is required for the session.");
      return;
    }
    setError("");
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCharacterChange = (id, field, value) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleOptimizeText = async (target, text, type = "persona") => {
    if (!text || !text.trim()) return;
    setOptimizingField(target);

    try {
      const res = await fetch("/api/characters/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      const data = await res.json();
      if (res.ok && data.optimizedText) {
        if (target === "story") {
          setStory(data.optimizedText);
        } else {
          handleCharacterChange(target, "persona", data.optimizedText);
        }
      } else {
        setError("Failed to optimize text: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error optimizing text: " + err.message);
    } finally {
      setOptimizingField(null);
    }
  };

  const applyPresetScenario = (preset) => {
    setSessionTitle(preset.title);
    setStory(preset.story);
    setCharacters(
      preset.characters.map((c, idx) => ({
        id: Date.now() + idx,
        name: c.name,
        persona: c.persona,
      }))
    );
  };

  const isHinglish = user?.language === "hinglish" || user?.language === "hi";

  const englishPresets = [
    {
      title: "Cyberpunk Heist",
      story: "Year 2088 in Neo-Tokyo. A high-stakes corporate data heist inside a heavily guarded megacorp skyscraper.",
      characters: [
        { name: "Vesper", persona: "Elite netrunner who can hack any neural network. Sarcastic, quick-witted." },
        { name: "Jax", persona: "Cybernetic mercenary equipped with arm cannons. Calm under pressure." },
      ],
    },
    {
      title: "Fantasy Guild",
      story: "An ancient dungeon hidden beneath the Mistfall Mountains, rumored to hold the Heart of Eternity.",
      characters: [
        { name: "Lyra Frost", persona: "Archmage specializing in ice magic. Regal, highly intelligent." },
        { name: "Kaelen", persona: "Rogue shadowblade with a mysterious past. Agile, protective." },
      ],
    },
    {
      title: "Space Rescue",
      story: "Deep space outpost Sector-9 went silent 48 hours ago. A reconnaissance squad lands to investigate.",
      characters: [
        { name: "Vance", persona: "Squad leader with strict protocol. Strategic, authoritative." },
        { name: "Dr. Elena", persona: "Lead xenobiologist. Curious, courageous in danger." },
      ],
    },
  ];

  const hinglishPresets = [
    {
      title: "Mumbai Cyberpunk Heist",
      story: "Year 2088 Mumbai Underground. Tech-tower me secretive AI core hack karne ki high-stakes mission.",
      characters: [
        { name: "Kabir", persona: "Master netrunner jo kisi bhi neural firewall ko bypass kar sakta hai. Sharp mind, sarcastic." },
        { name: "Vikram", persona: "Heavy cybernetic arm cannon waala bodyguard. Har mushkil situation me calm aur loyal." },
      ],
    },
    {
      title: "Desi Haveli Mystery",
      story: "Royal Haveli me achanak secret locker room unlock hua hai. Sabhi log mystery solve karne me lage hain.",
      characters: [
        { name: "Rajveer", persona: "Smart detective jo har choti detail notice karta hai. Secretive aur polite." },
        { name: "Ananya", persona: "Bold researcher jiske paas purani haveli ka secret map aur documents hain." },
      ],
    },
    {
      title: "Space Mission Hinglish",
      story: "Mars Orbital Outpost se achanak signal loss ho gaya. Team ko emergency landing karke truth pata lagana hai.",
      characters: [
        { name: "Captain Dev", persona: "Strict mission commander. Team ki safety uski primary goal hai." },
        { name: "Dr. Simran", persona: "Chief scientist jo mysterious alien signals aur audio logs analyze karti hai." },
      ],
    },
  ];

  const presets = isHinglish ? hinglishPresets : englishPresets;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const activeCharacters = characters
      .map((c) => ({ name: c.name.trim(), persona: c.persona.trim() }))
      .filter((c) => c.name !== "" && c.persona !== "");

    if (activeCharacters.length === 0) {
      setError("Please fill in at least one character name and persona.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle.trim() || `Roleplay: ${activeCharacters.map((c) => c.name).join(", ")}`,
          story: story.trim() || "An interactive roleplay scenario.",
          characters: activeCharacters,
          selectedModel,
        }),
      });

      const data = await res.json();

      if (res.ok && data.chatSession) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Failed to create session.");
      }
    } catch (err) {
      setError("Error creating session: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarGradient = (index) => {
    const gradients = [
      "from-purple-600 to-indigo-600",
      "from-cyan-600 to-blue-600",
      "from-emerald-600 to-teal-600",
      "from-amber-600 to-rose-600",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#030712] text-neutral-100 p-3 sm:p-5 select-text">
      <div className="max-w-4xl mx-auto space-y-4 pb-12">
        {/* Compact Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Back to Discovery"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Create Roleplay Session
              </h1>
            </div>
          </div>

          {/* Compact Inline AI Model Switcher */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-3.5-flash-lite")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedModel === "gemini-3.5-flash-lite"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Gemini 3.5
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-3.1-flash-lite")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedModel === "gemini-3.1-flash-lite"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Gemini 3.1 Lite
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 bg-red-950/60 border border-red-800/50 text-red-300 px-3 py-2 rounded-xl text-xs">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Compact Preset Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-neutral-500 uppercase shrink-0">Presets:</span>

          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPresetScenario(preset)}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-purple-950/50 border border-neutral-800 hover:border-purple-500/40 text-xs text-neutral-300 hover:text-purple-200 shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Main Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section 1: Scenario & World Setting */}
          <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <MessageSquareText className="w-3.5 h-3.5" />
                Scenario & Background
              </h2>
              <button
                type="button"
                onClick={() => handleOptimizeText("story", story, "story")}
                disabled={!story.trim() || optimizingField === "story"}
                className="text-[11px] text-purple-400 hover:text-purple-300 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                {optimizingField === "story" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3" />
                )}
                <span>AI Enhance Scenario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Title</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="Session title..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 text-neutral-100 text-xs rounded-lg px-3 py-2 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Scenario Background</label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={2}
                  placeholder="Describe environment, rules, or ongoing story goal..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 text-neutral-100 text-xs rounded-lg p-2.5 outline-none transition-all placeholder:text-neutral-600 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Character Roster */}
          <div className="rounded-xl bg-neutral-900/40 border border-neutral-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Characters ({characters.length})
              </h2>

              <button
                type="button"
                onClick={handleAddCharacter}
                className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/50 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Character</span>
              </button>
            </div>

            <div className="space-y-3">
              {characters.map((char, index) => (
                <div
                  key={char.id}
                  className="rounded-lg bg-neutral-950/80 border border-neutral-800/80 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                          index
                        )} text-white font-bold flex items-center justify-center text-xs shrink-0`}
                      >
                        {char.name ? char.name[0].toUpperCase() : index + 1}
                      </div>
                      <span className="font-semibold text-xs text-neutral-200">
                        {char.name || `Character #${index + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOptimizeText(char.id, char.persona, "persona")}
                        disabled={!char.persona.trim() || optimizingField === char.id}
                        className="text-[11px] text-purple-400 hover:text-purple-300 disabled:opacity-40 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {optimizingField === char.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Wand2 className="w-3 h-3" />
                        )}
                        <span>AI Enhance</span>
                      </button>

                      {characters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(char.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                          title="Remove Character"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <input
                        type="text"
                        value={char.name}
                        onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                        placeholder="Character name (e.g. Vesper)*"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-purple-500 text-neutral-100 text-xs rounded-lg px-2.5 py-1.5 outline-none transition-all placeholder:text-neutral-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <textarea
                        value={char.persona}
                        onChange={(e) => handleCharacterChange(char.id, "persona", e.target.value)}
                        rows={2}
                        placeholder="Persona, background, speaking style, traits...*"
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-purple-500 text-neutral-100 text-xs rounded-lg p-2 outline-none transition-all placeholder:text-neutral-600 resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/80">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800/60 text-neutral-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Launching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Roleplay Session</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
