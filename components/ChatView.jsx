"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Sparkles,
  Plus,
  Mic,
  Send,
  Eye,
  EyeOff,
  User,
  Trash2,
  Info,
  Edit2,
  X,
  Loader2,
  Layers,
  Users,
  Brain,
} from "lucide-react";

// Helper to parse multi-character dialogue blocks like [rahul]: ... [raj]: ...
function parseCharacterSpeechBlocks(rawText) {
  if (!rawText) return [];

  // Match pattern like [CharacterName]:
  const characterBlockRegex = /\[([^\]]+)\]:\s*/g;

  let matches = [];
  let match;
  while ((match = characterBlockRegex.exec(rawText)) !== null) {
    matches.push({
      charName: match[1].trim(),
      index: match.index,
      length: match[0].length,
    });
  }

  // If no character tags matched, return as single raw block
  if (matches.length === 0) {
    return [{ charName: null, speech: rawText.trim() }];
  }

  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const currentChar = matches[i].charName;
    const speechStart = matches[i].index + matches[i].length;
    const speechEnd = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
    const speechText = rawText.substring(speechStart, speechEnd).trim();

    if (speechText) {
      blocks.push({
        charName: currentChar,
        speech: speechText,
      });
    }
  }

  return blocks;
}

// Color palette for character avatars & badges
const charColors = [
  "from-blue-600 to-indigo-600 border-blue-500/40 text-blue-300 bg-blue-950/40",
  "from-purple-600 to-pink-600 border-purple-500/40 text-purple-300 bg-purple-950/40",
  "from-emerald-600 to-teal-600 border-emerald-500/40 text-emerald-300 bg-emerald-950/40",
  "from-amber-600 to-orange-600 border-amber-500/40 text-amber-300 bg-amber-950/40",
  "from-rose-600 to-red-600 border-rose-500/40 text-rose-300 bg-rose-950/40",
];

function getCharStyle(charName) {
  if (!charName) return charColors[0];
  let hash = 0;
  for (let i = 0; i < charName.length; i++) {
    hash = charName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % charColors.length;
  return charColors[index];
}

// Component to render message text with Markdown, HTML <u> underline, & Thought highlighting
function FormattedMessageContent({ content }) {
  if (!content) return null;

  // Process text to convert single-quoted thoughts into styled thought badges
  const renderFormattedText = (text) => {
    // Regex matching text enclosed in single quotes 'thought'
    const parts = text.split(/('[\s\S]*?')/g);

    return parts.map((part, index) => {
      if (part.startsWith("'") && part.endsWith("'") && part.length > 2) {
        const thoughtContent = part.slice(1, -1);
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 mx-1 my-0.5 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/80 text-purple-200 text-xs italic shadow-sm"
            title="Inner Thought"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0 inline" />
            <span>'{thoughtContent}'</span>
          </span>
        );
      }
      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => <span className="inline leading-relaxed">{children}</span>,
            strong: ({ children }) => <strong className="font-bold text-white px-0.5">{children}</strong>,
            em: ({ children }) => <em className="italic text-neutral-300">{children}</em>,
            u: ({ children }) => (
              <u className="underline underline-offset-4 text-blue-300 decoration-blue-400 font-semibold px-0.5">
                {children}
              </u>
            ),
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-neutral-200">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-neutral-200">{children}</ul>,
            li: ({ children }) => <li className="my-0.5">{children}</li>,
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 border border-neutral-800 rounded-xl">
                <table className="min-w-full divide-y divide-neutral-800 text-xs text-neutral-200">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => <thead className="bg-neutral-900">{children}</thead>,
            th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-neutral-300 uppercase tracking-wider">{children}</th>,
            td: ({ children }) => <td className="px-3 py-2 border-t border-neutral-800/60">{children}</td>,
          }}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return <div className="space-y-1">{renderFormattedText(content)}</div>;
}

export default function ChatView({
  activeChat,
  onUpdateChat,
  onDeleteChat,
  onOpenNewModal,
}) {
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyEdit, setStoryEdit] = useState("");
  const [charactersEdit, setCharactersEdit] = useState([]);
  const [showContextInfo, setShowContextInfo] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      setStoryEdit(activeChat.story || "");
      setCharactersEdit(activeChat.sessionCharacters || []);
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
        if (data.chatSession.sessionCharacters) {
          setCharactersEdit(data.chatSession.sessionCharacters);
        }
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
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, includeInContext: currentFlag } : m))
      );
    }
  };

  const handleSaveStoryAndCharacters = async () => {
    try {
      const res = await fetch(`/api/chats/${activeChat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: storyEdit,
          characters: charactersEdit.map((c) => ({ name: c.name, persona: c.persona })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateChat(data.chatSession);
        setShowStoryModal(false);
      }
    } catch (err) {
      alert("Failed to update session details");
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-neutral-950 relative overflow-hidden">
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
          Create a multi-character roleplay session to chat with multiple AI personas in a single response.
        </p>

        <button
          onClick={onOpenNewModal}
          className="px-5 py-2.5 rounded-full bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Character Chat</span>
        </button>
      </div>
    );
  }

  const sessionChars = activeChat.sessionCharacters || charactersEdit || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-hidden relative">
      {/* Top Multi-Character Session Bar */}
      <div className="h-14 border-b border-neutral-800/80 px-3 md:px-6 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
            <Users className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-semibold text-xs md:text-sm text-white truncate max-w-[110px] sm:max-w-xs">
                {activeChat.title}
              </span>

              {/* Character Badges */}
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                {sessionChars.map((char) => (
                  <span
                    key={char.id || char.name}
                    className="text-xs font-semibold bg-neutral-800 border border-neutral-700 text-blue-300 px-2 py-0.5 rounded-full capitalize"
                  >
                    {char.name}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowStoryModal(true)}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors shrink-0"
                title="Edit Story & Characters"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] md:text-xs text-neutral-400 line-clamp-1 max-w-[140px] sm:max-w-md">
              {activeChat.story || "Interactive roleplay scenario."}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          <button
            onClick={() => setShowContextInfo(!showContextInfo)}
            className={`text-xs px-2 md:px-3 py-1 rounded-full border flex items-center gap-1 md:gap-1.5 transition-all ${
              showContextInfo
                ? "bg-blue-950/60 border-blue-500 text-blue-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
            title="Context Window Status"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden sm:inline">Context:</span>
            <span>~{totalTokens}t</span>
            <span className="hidden md:inline-block text-[10px] bg-neutral-800 px-1.5 py-0.2 rounded-full text-neutral-300">
              {includedMessages.length}/{messages.length} msgs
            </span>
          </button>

          <button
            onClick={() => onDeleteChat(activeChat.id)}
            className="p-1.5 md:p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors shrink-0"
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
            Every message with an active eye icon (<Eye className="w-3 h-3 inline text-blue-400" />) is included in Gemini's prompt memory history (~{totalTokens} tokens). Click any message's eye icon to toggle it off and exclude it from context history!
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

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mt-2">
              <span className="text-xs text-neutral-400">Characters in this scene:</span>
              {sessionChars.map((char) => (
                <span
                  key={char.id || char.name}
                  className="inline-flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1 text-xs text-blue-400 font-semibold capitalize"
                >
                  {char.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            const charBlocks = !isUser ? parseCharacterSpeechBlocks(msg.content) : [];

            return (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-3xl mx-auto group ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">
                    <Users className="w-4 h-4" />
                  </div>
                )}

                <div className="flex-1 max-w-2xl">
                  {/* Sender Header & Context Toggle */}
                  <div className="flex items-center justify-between mb-1.5 text-[11px] text-neutral-400 px-1">
                    <span className="font-medium text-neutral-300">
                      {isUser
                        ? "You"
                        : `Scene Roleplay Dialogue (${sessionChars.map((c) => c.name).join(", ")})`}
                    </span>

                    <div className="flex items-center gap-2">
                      {!msg.includeInContext && (
                        <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-300 px-1.5 py-0.5 rounded">
                          Excluded from AI context
                        </span>
                      )}

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
                  {isUser ? (
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed bg-neutral-800 text-neutral-100 rounded-tr-xs ${
                        !msg.includeInContext ? "opacity-60 border-dashed border-amber-900/50" : ""
                      }`}
                    >
                      <FormattedMessageContent content={msg.content} />
                    </div>
                  ) : (
                    /* Multi-Character Speech Card Renderer */
                    <div className="space-y-3">
                      {charBlocks.map((block, bIdx) => {
                        const styleClass = getCharStyle(block.charName);
                        return (
                          <div
                            key={bIdx}
                            className={`p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-xs shadow-md ${
                              !msg.includeInContext ? "opacity-60 border-dashed border-amber-900/50" : ""
                            }`}
                          >
                            {block.charName && (
                              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-800/60">
                                <span
                                  className={`text-sm font-extrabold px-3.5 py-1 rounded-full border shadow-md tracking-wide capitalize ${styleClass}`}
                                >
                                  {block.charName}
                                </span>
                              </div>
                            )}

                            <FormattedMessageContent content={block.speech} />
                          </div>
                        );
                      })}
                    </div>
                  )}
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
              <Users className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Generating multi-character responses...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Input Capsule Bar */}
      <div className="p-4 md:px-8 max-w-4xl mx-auto w-full z-10">
        <form
          onSubmit={handleSendMessage}
          className="relative bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2.5 shadow-2xl flex items-center gap-3 focus-within:border-neutral-700 transition-all"
        >
          <button
            type="button"
            onClick={onOpenNewModal}
            className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors shrink-0"
            title="New Chat Session"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Speak to ${sessionChars.map((c) => c.name).join(", ")}...`}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
            disabled={loading}
          />

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
          Supports HTML <u>underline</u>, **bold**, *italics*, tables, & single-quoted 'thoughts'.
        </p>
      </div>

      {/* Edit Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-semibold text-white text-base">Edit Scenario Story</h3>
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Story / Scenario Setting
              </label>
              <textarea
                rows={3}
                value={storyEdit}
                onChange={(e) => setStoryEdit(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowStoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStoryAndCharacters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
