"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Mic,
  Send,
  Eye,
  EyeOff,
  User,
  Bot,
  Info,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Cpu,
  Layers,
} from "lucide-react";

export default function ChatView({
  activeChat,
  onUpdateChat,
  onDeleteChat,
  onOpenNewModal,
}) {
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPersona, setEditingPersona] = useState(false);
  const [charNameEdit, setCharNameEdit] = useState("");
  const [charDescEdit, setCharDescEdit] = useState("");
  const [showContextInfo, setShowContextInfo] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      setCharNameEdit(activeChat.characterName || "");
      setCharDescEdit(activeChat.characterDesc || "");
      fetchChatMessages(activeChat.id);
    } else {
      setMessages([]);
    }
  }, [activeChat?.id]);

  const fetchChatMessages = async (chatId) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.chatSession.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Context token calculation
  const includedMessages = messages.filter((m) => m.includeInContext);
  const totalTokens = includedMessages.reduce(
    (acc, m) => acc + (m.tokenEstimate || Math.ceil(m.content.length / 4)),
    0
  );

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || !activeChat || loading) return;

    const currentPrompt = inputPrompt;
    setInputPrompt("");
    setLoading(true);

    // Optimistic user message preview
    const tempUserMsg = {
      id: "temp-" + Date.now(),
      role: "user",
      content: currentPrompt,
      includeInContext: true,
      tokenEstimate: Math.ceil(currentPrompt.length / 4),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatSessionId: activeChat.id,
          prompt: currentPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Replace optimistic message and append model response
      setMessages((prev) =>
        prev.filter((m) => m.id !== tempUserMsg.id).concat(data.userMessage, data.modelMessage)
      );
    } catch (err) {
      alert("Error sending message: " + err.message);
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleContext = async (messageId, currentFlag) => {
    const newFlag = !currentFlag;

    // Optimistic UI update
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, includeInContext: newFlag } : m))
    );

    try {
      const res = await fetch(`/api/chats/${activeChat.id}/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeInContext: newFlag }),
      });
      if (!res.ok) {
        throw new Error("Failed to toggle context flag");
      }
    } catch (err) {
      console.error("Toggle error", err);
      // Revert optimistic update
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, includeInContext: currentFlag } : m))
      );
    }
  };

  const handleSavePersona = async () => {
    if (!charNameEdit.trim() || !charDescEdit.trim()) return;

    try {
      const res = await fetch(`/api/chats/${activeChat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: charNameEdit.trim(),
          characterDesc: charDescEdit.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateChat(data.chatSession);
        setEditingPersona(false);
      }
    } catch (err) {
      alert("Failed to update character persona");
    }
  };

  // If no chat session selected
  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-neutral-950 relative overflow-hidden">
        {/* Gemini Background Sparkle Effect */}
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl">
          <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
              fill="url(#gemini-gradient-empty)"
            />
            <defs>
              <linearGradient
                id="gemini-gradient-empty"
                x1="0"
                y1="0"
                x2="24"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#60A5FA" />
                <stop offset="0.5" stopColor="#A855F7" />
                <stop offset="1" stopColor="#F472B6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 className="text-3xl font-normal tracking-tight text-white mb-2">
          Where should we start?
        </h2>
        <p className="text-neutral-400 max-w-md text-sm mb-6">
          Create a roleplay character session to begin chatting with customized AI personas.
        </p>

        <button
          onClick={onOpenNewModal}
          className="px-5 py-2.5 rounded-full bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Roleplay Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-hidden relative">
      {/* Top Session Bar */}
      <div className="h-14 border-b border-neutral-800/80 px-6 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400 font-bold text-xs">
            {activeChat.characterName?.[0] || "C"}
          </div>

          {editingPersona ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={charNameEdit}
                onChange={(e) => setCharNameEdit(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                placeholder="Char Name"
              />
              <button
                onClick={handleSavePersona}
                className="p-1 text-green-400 hover:text-green-300"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingPersona(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">
                  [{activeChat.characterName}]
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  {activeChat.selectedModel === "gemini-3.1-flash-lite"
                    ? "3.1 Flash Lite"
                    : "3.6 Flash Lite"}
                </span>
                <button
                  onClick={() => setEditingPersona(true)}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors p-0.5"
                  title="Edit character persona"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-neutral-400 line-clamp-1 max-w-lg">
                {activeChat.characterDesc}
              </p>
            </div>
          )}
        </div>

        {/* Right Actions: Context Window Info & Delete */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowContextInfo(!showContextInfo)}
            className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 transition-all ${
              showContextInfo
                ? "bg-blue-950/60 border-blue-500 text-blue-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
            title="Context Window Status"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Context: ~{totalTokens} tokens</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.2 rounded-full text-neutral-300">
              {includedMessages.length}/{messages.length} msgs
            </span>
          </button>

          <button
            onClick={() => onDeleteChat(activeChat.id)}
            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors"
            title="Delete Chat Session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Window Explanation Banner */}
      {showContextInfo && (
        <div className="bg-neutral-900 border-b border-neutral-800 p-3 px-6 text-xs text-neutral-300 flex items-start gap-3 animate-in slide-in-from-top-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white">Context Window Management: </span>
            Every message with an active eye icon (<Eye className="w-3 h-3 inline text-blue-400" />) is included in Gemini's prompt memory history (~{totalTokens} tokens). Click any message's eye icon to toggle it off and exclude it from history payload!
          </div>
          <button
            onClick={() => setShowContextInfo(false)}
            className="text-neutral-500 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center my-12">
            {/* Gemini Colorful Sparkle Logo matching user screenshot */}
            <div className="w-16 h-16 relative mb-6">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                  fill="url(#gemini-sparkle-center)"
                />
                <defs>
                  <linearGradient
                    id="gemini-sparkle-center"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="0.33" stopColor="#EC4899" />
                    <stop offset="0.66" stopColor="#EAB308" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="text-3xl font-normal text-white mb-2">
              Where should we start?
            </h1>
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-1.5 text-xs text-neutral-300 mt-2">
              <span>Roleplaying as:</span>
              <span className="font-semibold text-blue-400">[{activeChat.characterName}]</span>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-3xl mx-auto group ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">
                    {activeChat.characterName?.[0] || "C"}
                  </div>
                )}

                <div className="flex-1 max-w-2xl">
                  {/* Sender Header & Context Toggle */}
                  <div className="flex items-center justify-between mb-1 text-[11px] text-neutral-400 px-1">
                    <span className="font-medium text-neutral-300">
                      {isUser ? "You" : `[${activeChat.characterName}]`}
                    </span>

                    <div className="flex items-center gap-2">
                      {!msg.includeInContext && (
                        <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded">
                          Excluded from AI context
                        </span>
                      )}

                      {/* Eye Icon to Toggle Context Inclusion */}
                      <button
                        onClick={() => handleToggleContext(msg.id, msg.includeInContext)}
                        className={`p-1 rounded transition-colors ${
                          msg.includeInContext
                            ? "text-neutral-500 hover:text-blue-400 hover:bg-neutral-900"
                            : "text-amber-400 hover:text-amber-300 bg-amber-950/40"
                        }`}
                        title={
                          msg.includeInContext
                            ? "Included in Context - Click to Exclude"
                            : "Excluded from Context - Click to Include"
                        }
                      >
                        {msg.includeInContext ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-neutral-800 text-neutral-100 rounded-tr-xs"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-xs"
                    } ${!msg.includeInContext ? "opacity-60 border-dashed border-amber-900/50" : ""}`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-200 shrink-0 text-xs font-semibold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-4 max-w-3xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md animate-pulse">
              {activeChat.characterName?.[0] || "C"}
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>[{activeChat.characterName}] is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Gemini Bottom Input Capsule Bar - Matching user screenshot */}
      <div className="p-4 md:px-8 max-w-4xl mx-auto w-full z-10">
        <form
          onSubmit={handleSendMessage}
          className="relative bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-3 focus-within:border-neutral-700 transition-all"
        >
          {/* Plus icon on left */}
          <button
            type="button"
            onClick={onOpenNewModal}
            className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors shrink-0"
            title="New Chat Session"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Text-sm inputfield as requested */}
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask ${activeChat.characterName}...`}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
            disabled={loading}
          />

          {/* Mic and Send button on right */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-blue-600"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-[11px] text-center text-neutral-500 mt-2">
          Gemini Roleplay may display inaccurate info. Toggle eye icons to edit context window.
        </p>
      </div>
    </div>
  );
}
