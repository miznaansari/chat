"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, UserCheck, Plus, Bot, ChevronRight, Loader2 } from "lucide-react";

export default function NewSessionModal({ isOpen, onClose, onSessionCreated }) {
  const [activeTab, setActiveTab] = useState("new"); // "new" | "saved"
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);

  // Form State
  const [characterName, setCharacterName] = useState("");
  const [characterDesc, setCharacterDesc] = useState("");
  const [saveAsPreset, setSaveAsPreset] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash-lite"); // "gemini-3.5-flash-lite" | "gemini-3.1-flash-lite"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch saved characters on modal open
  useEffect(() => {
    if (isOpen) {
      fetchCharacters();
    }
  }, [isOpen]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch("/api/characters");
      if (res.ok) {
        const data = await res.json();
        setSavedCharacters(data.characters || []);
      }
    } catch (err) {
      console.error("Failed to load saved characters", err);
    }
  };

  const handleSelectSavedCharacter = (char) => {
    setSelectedCharacterId(char.id);
    setCharacterName(char.name);
    setCharacterDesc(char.description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!characterName.trim() || !characterDesc.trim()) {
      setError("Character Name and Description are required");
      return;
    }

    setLoading(true);

    try {
      let charId = selectedCharacterId;

      // If user wants to save a new character as preset
      if (activeTab === "new" && saveAsPreset) {
        const charRes = await fetch("/api/characters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: characterName,
            description: characterDesc,
          }),
        });
        if (charRes.ok) {
          const charData = await charRes.json();
          charId = charData.character.id;
        }
      }

      // Create new chat session
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: charId,
          characterName: characterName.trim(),
          characterDesc: characterDesc.trim(),
          selectedModel,
          title: `Chat with ${characterName}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create session");
      }

      // Reset & close
      setCharacterName("");
      setCharacterDesc("");
      setSelectedCharacterId(null);
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Create Roleplay Character Session</h2>
              <p className="text-xs text-neutral-400">Configure your character persona & Gemini model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-neutral-950 p-1 rounded-xl my-4 border border-neutral-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "new"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
              }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Character</span>
          </button>
          {savedCharacters.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === "saved"
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
                }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Saved Characters ({savedCharacters.length})</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "saved" && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Select Saved Character
              </label>
              {savedCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => handleSelectSavedCharacter(char)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedCharacterId === char.id
                      ? "bg-blue-950/40 border-blue-500 text-white"
                      : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">[{char.name}]</span>
                    {selectedCharacterId === char.id && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {char.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Character Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. [char1] or Sherlock Holmes"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1 uppercase tracking-wider">
              Character Persona & Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe character role, personality, speaking style, backstory..."
              value={characterDesc}
              onChange={(e) => setCharacterDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Model Selector - Only 3.6 Flash Lite and 3.1 Flash Lite */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">
              Gemini AI Model
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
                  <span>3.6 Flash Lite</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">High speed & latest capabilities</p>
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

          {activeTab === "new" && (
            <label className="flex items-center gap-2 cursor-pointer pt-1 text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={saveAsPreset}
                onChange={(e) => setSaveAsPreset(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded bg-neutral-950 border-neutral-800"
              />
              <span>Save character in character store for future sessions</span>
            </label>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
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
                  <span>Start Roleplay Session</span>
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
