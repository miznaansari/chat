"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Bot,
  ChevronRight,
  Loader2,
  Users,
  User,
  Check,
  Star,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

export default function NewSessionModal({ isOpen, onClose, onSessionCreated }) {
  const [sessionTitle, setSessionTitle] = useState("");
  const [story, setStory] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite");

  // Dynamic Multi-Character List
  const [characters, setCharacters] = useState([
    { id: 1, name: "", persona: "" },
  ]);

  // User Persona Selection state
  const [userPersonas, setUserPersonas] = useState([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState(""); // persona ID or "inline" or ""
  
  // Inline Persona Creation state (when user has no persona or wants to make one on the fly)
  const [showInlinePersona, setShowInlinePersona] = useState(false);
  const [inlineName, setInlineName] = useState("");
  const [inlinePersona, setInlinePersona] = useState("");
  const [savingInline, setSavingInline] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [optimizingField, setOptimizingField] = useState(null); // 'story' | charId | 'inlinePersona'

  useEffect(() => {
    if (isOpen) {
      fetchUserPersonas();
    }
  }, [isOpen]);

  const fetchUserPersonas = async () => {
    setLoadingPersonas(true);
    try {
      const res = await fetch("/api/user/personas");
      if (res.ok) {
        const data = await res.json();
        const list = data.personas || [];
        setUserPersonas(list);
        if (list.length > 0) {
          const def = list.find((p) => p.isDefault) || list[0];
          setSelectedPersonaId(def.id);
        } else {
          setSelectedPersonaId("");
        }
      }
    } catch (err) {
      console.error("Failed to load user personas", err);
    } finally {
      setLoadingPersonas(false);
    }
  };

  const handleCreateInlinePersona = async () => {
    if (!inlineName.trim() || !inlinePersona.trim()) return;
    setSavingInline(true);
    try {
      const res = await fetch("/api/user/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inlineName.trim(),
          persona: inlinePersona.trim(),
          isDefault: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.persona) {
        setUserPersonas((prev) => [data.persona, ...prev]);
        setSelectedPersonaId(data.persona.id);
        setShowInlinePersona(false);
        setInlineName("");
        setInlinePersona("");
      } else {
        alert(data.error || "Failed to create persona");
      }
    } catch (err) {
      alert("Error creating persona: " + err.message);
    } finally {
      setSavingInline(false);
    }
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
        } else if (target === "inlinePersona") {
          setInlinePersona(data.optimizedText);
        } else {
          handleCharacterChange(target, "persona", data.optimizedText);
        }
      } else {
        alert("Failed to optimize text: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error optimizing text: " + err.message);
    } finally {
      setOptimizingField(null);
    }
  };

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
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCharacterChange = (id, field, value) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Filter active session characters
    const activeCharacters = characters
      .map((c) => ({ name: c.name.trim(), persona: c.persona.trim() }))
      .filter((c) => c.name !== "" && c.persona !== "");

    if (activeCharacters.length === 0) {
      setError("Please fill in at least one character name and persona.");
      return;
    }

    setLoading(true);

    try {
      // Find selected persona data
      let pId = null;
      let pName = null;
      let pDetails = null;

      if (selectedPersonaId && selectedPersonaId !== "") {
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
          title: sessionTitle.trim() || `Roleplay: ${activeCharacters.map((c) => c.name).join(", ")}`,
          story: story.trim() || "An interactive roleplay scenario.",
          characters: activeCharacters,
          selectedModel,
          userPersonaId: pId,
          userPersonaName: pName,
          userPersonaDetails: pDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create session");
      }

      onSessionCreated(data.chatSession);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const activePersonaObj = userPersonas.find((p) => p.id === selectedPersonaId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Multi-Character Roleplay Session</h2>
              <p className="text-xs sm:text-sm text-neutral-300">Add multiple characters & scenario background for Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs sm:text-sm shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* USER PERSONA ("ME" PERSONA) SELECTION SECTION */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <label className="text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-wider">
                  "Me Persona" (Who you are in this chat)
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowInlinePersona(!showInlinePersona)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-950/80 border border-blue-800/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{showInlinePersona ? "Hide Persona Creator" : "+ New Persona"}</span>
              </button>
            </div>

            {/* Inline Persona Creator Form */}
            {showInlinePersona && (
              <div className="bg-neutral-950 border border-blue-800/80 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                  <span>Quick Create "Me Persona"</span>
                  <span className="text-xs text-neutral-400 font-normal">Saves to your Settings</span>
                </div>
                <input
                  type="text"
                  placeholder="Your Persona Name (e.g. Arjun / Alex)"
                  value={inlineName}
                  onChange={(e) => setInlineName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
                />
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-neutral-300 font-medium">Backstory / Role Details</label>
                    <button
                      type="button"
                      onClick={() => handleOptimizeText("inlinePersona", inlinePersona, "persona")}
                      disabled={!inlinePersona?.trim() || optimizingField === "inlinePersona"}
                      className="text-xs font-semibold text-purple-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ Improve</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Describe your background, personality, or job so AI characters know how to react..."
                    value={inlinePersona}
                    onChange={(e) => setInlinePersona(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateInlinePersona}
                  disabled={savingInline || !inlineName.trim() || !inlinePersona.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {savingInline ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save & Select Persona</span>}
                </button>
              </div>
            )}

            {loadingPersonas ? (
              <div className="text-xs sm:text-sm text-neutral-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Loading your personas...</span>
              </div>
            ) : userPersonas.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs sm:text-sm space-y-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>⚠️ Notice: No "Me Persona" Created</span>
                </div>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Without a "Me Persona", AI responses will be generic because characters won't know your backstory, tone, or personality.
                </p>
                <p className="text-xs text-amber-300 font-semibold">
                  Click <span className="underline">+ New Persona</span> above to create your profile on the fly!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userPersonas.map((p) => {
                    const isSelected = selectedPersonaId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPersonaId(p.id)}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-900/60 border-blue-500 text-white shadow-md font-medium"
                            : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-white truncate">{p.name}</span>
                            {p.isDefault && (
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-300 line-clamp-1">{p.persona}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                {activePersonaObj && (
                  <div className="text-xs text-blue-200 bg-blue-950/60 p-3 rounded-xl border border-blue-800/60 font-medium">
                    <span className="font-extrabold text-blue-300">Active Me Persona:</span> "{activePersonaObj.name}" — {activePersonaObj.persona}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Session Title & Scenario */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider">
              Session Title
            </label>
            <input
              type="text"
              placeholder="e.g. Victorian Mystery / Sci-Fi Mission"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors font-medium"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider">
                Scenario / Story Setting Background
              </label>
              <button
                type="button"
                onClick={() => handleOptimizeText("story", story, "story")}
                disabled={!story?.trim() || optimizingField === "story"}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 px-2.5 py-1 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                title="Improve spelling, grammar & enhance story setting with Gemini"
              >
                {optimizingField === "story" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Improving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>✨ Improve with Gemini</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe the setting, plot context, or world rules for all characters..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed font-medium"
            />
          </div>

          {/* Multiple Characters Section */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-extrabold text-blue-400 uppercase tracking-wider">
                Session Characters ({characters.length})
              </label>
              <button
                type="button"
                onClick={handleAddCharacter}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Character</span>
              </button>
            </div>

            {characters.map((char, index) => (
              <div
                key={char.id}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-neutral-200">
                    Character #{index + 1}
                  </span>
                  {characters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(char.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remove Character"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Character Tag Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sherlock"
                      value={char.name}
                      onChange={(e) =>
                        handleCharacterChange(char.id, "name", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-neutral-300">
                        Character Persona & Speaking Style
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOptimizeText(char.id, char.persona, "persona")}
                        disabled={!char.persona?.trim() || optimizingField === char.id}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60 px-2 py-0.5 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                        title="Improve spelling, grammar & expand persona with Gemini"
                      >
                        {optimizingField === char.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                            <span>Improving...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>✨ Improve with Gemini</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Smart, observational detective who speaks formally."
                      value={char.persona}
                      onChange={(e) =>
                        handleCharacterChange(char.id, "persona", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2 px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none font-medium leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model Selector */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider">
              Gemini Model
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.5-flash-lite")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedModel === "gemini-3.5-flash-lite"
                    ? "bg-blue-950/50 border-blue-500 text-white shadow-md font-semibold"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>3.5 Flash Lite</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">High speed multi-character</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.1-flash-lite")}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedModel === "gemini-3.1-flash-lite"
                    ? "bg-blue-950/50 border-blue-500 text-white shadow-md font-semibold"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>3.1 Flash Lite</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Lightweight fast model</p>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Launch Multi-Character Session</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
