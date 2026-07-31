"use client";

import { useState } from "react";
import { X, Sparkles, Plus, Trash2, Bot, ChevronRight, Loader2, Users } from "lucide-react";

export default function NewSessionModal({ isOpen, onClose, onSessionCreated }) {
  const [sessionTitle, setSessionTitle] = useState("");
  const [story, setStory] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite");

  // Dynamic Multi-Character List (starts clean and empty, no pre-filled text to erase)
  const [characters, setCharacters] = useState([
    { id: 1, name: "", persona: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    // Filter characters that have non-empty name or persona
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create Multi-Character Roleplay Session</h2>
              <p className="text-xs text-neutral-400">Add multiple characters & scenario background for Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          {/* Session Title & Scenario */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Session Title
            </label>
            <input
              type="text"
              placeholder="e.g. Victorian Mystery / Sci-Fi Mission"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-base sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Scenario / Story Setting Background
            </label>
            <textarea
              rows={2}
              placeholder="Describe the setting, plot context, or world rules for all characters..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-base sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Multiple Characters Section */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Session Characters ({characters.length})
              </label>
              <button
                type="button"
                onClick={handleAddCharacter}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Character</span>
              </button>
            </div>

            {characters.map((char, index) => (
              <div
                key={char.id}
                className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">
                    Character #{index + 1}
                  </span>
                  {characters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacter(char.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove Character"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
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
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2 px-3 text-base sm:text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Character Persona & Speaking Style
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart, observational detective who speaks formally."
                      value={char.persona}
                      onChange={(e) =>
                        handleCharacterChange(char.id, "persona", e.target.value)
                      }
                      className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2 px-3 text-base sm:text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Model Selector */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
              Gemini Model
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.5-flash-lite")}
                className={`p-3 rounded-xl border text-left transition-all ${selectedModel === "gemini-3.5-flash-lite"
                  ? "bg-blue-950/40 border-blue-500 text-white"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>3.5 Flash Lite</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">High speed multi-character</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel("gemini-3.1-flash-lite")}
                className={`p-3 rounded-xl border text-left transition-all ${selectedModel === "gemini-3.1-flash-lite"
                  ? "bg-blue-950/40 border-blue-500 text-white"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>3.1 Flash Lite</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">Lightweight fast model</p>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
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
