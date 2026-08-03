"use client";

import { useState, useRef, useEffect, useMemo, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Tooltip from "@/components/Tooltip";


import {
  Sparkles,
  Plus,
  Mic,
  Send,
  Eye,
  EyeOff,
  User,
  Trash2,
  Edit2,
  X,
  Loader2,
  Layers,
  Users,
  Brain,
  Zap,
  BookOpen,
  Bookmark,
  MoreVertical,
} from "lucide-react";

// Helper to parse multi-character dialogue blocks like [rahul]: ... [raj]: ...
function parseCharacterSpeechBlocks(rawText) {
  if (!rawText) return [];

  // Match pattern like [CharacterName]: or **CharacterName**: or CharacterName: at start of line
  const characterBlockRegex = /(?:^|\n)(?:\[([^\]]+)\]|\*\*([^*]+)\*\*|([A-Z][a-zA-Z0-9_\s]{1,20})):\s*/g;

  let matches = [];
  let match;
  while ((match = characterBlockRegex.exec(rawText)) !== null) {
    const charName = (match[1] || match[2] || match[3] || "").trim();
    if (charName) {
      matches.push({
        charName,
        index: match.index,
        length: match[0].length,
      });
    }
  }

  // If no character tags matched, return as single raw block
  if (matches.length === 0) {
    return [{ charName: null, speech: rawText.trim() }];
  }

  const blocks = [];
  // If there's narrative intro text before the first character tag, capture it
  if (matches[0].index > 0) {
    const introText = rawText.substring(0, matches[0].index).trim();
    if (introText) {
      blocks.push({ charName: null, speech: introText });
    }
  }

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

// Circular SVG progress ring gauge component
function ContextCircularGauge({ percentage, size = 36, strokeWidth = 3.5, label = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Ensure minimal visible stroke if percentage > 0
  const validPercentage = Math.max(percentage, percentage > 0 ? 0.8 : 0);
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  const colorClass =
    percentage > 90
      ? "text-rose-500"
      : percentage > 70
        ? "text-amber-400"
        : "text-blue-400";

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-800"
          fill="transparent"
        />
        {/* Dynamic Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-500 ease-out`}
          fill="transparent"
        />
      </svg>
      {label && (
        <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label}
        </span>
      )}
    </div>
  );
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

// Narrative Teaser Card component for story hooks like (Ab dekhte hai aage kya hota hai...)
const NarrativeTeaserCard = memo(function NarrativeTeaserCard({ text }) {
  const cleanText = text.replace(/^\s*[\(*_]+\s*|\s*[\)*_]+\s*$/g, "").trim();

  return (
    <div className="my-2.5 p-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-amber-950/50 to-neutral-900 border border-purple-500/40 text-amber-200/90 shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in duration-200 group hover:border-purple-400/60 transition-all">
      <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>
      <div className="text-xs sm:text-sm font-serif italic tracking-wide leading-relaxed">
        <span className="font-semibold text-purple-300 not-italic mr-2 font-sans uppercase tracking-wider text-[10px] bg-purple-950/90 px-2 py-0.5 rounded-md border border-purple-700/60 shadow-xs">
          🎬 Story Scene Hook
        </span>
        "{cleanText}"
      </div>
    </div>
  );
});

// Helper to render parenthetical thoughts like (Ab dekhte hai student kya choose karta hai...) with a distinct 💭 THOUGHT badge
function renderContentWithThoughts(children) {
  if (typeof children === "string") {
    if (!children.includes("(") || !children.includes(")")) return children;
    // Match parenthetical text like (anything inside parentheses)
    const regex = /\(([^)\n]{2,})\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(children)) !== null) {
      if (match.index > lastIndex) {
        parts.push(children.substring(lastIndex, match.index));
      }

      const innerContent = match[1].trim();
      const wordCount = innerContent.split(/\s+/).filter(Boolean).length;

      // Only treat parenthetical text as THOUGHT if it contains a full thought statement (>= 3 words)
      // Short terms or abbreviations like (HLD) or (LLD) render as normal parenthetical text
      if (wordCount >= 3) {
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center gap-1.5 bg-purple-950/80 border border-purple-700/60 text-purple-200 px-2.5 py-1 rounded-xl font-serif italic text-[0.93em] my-1 mx-1 shadow-md backdrop-blur-sm"
            title="Character Inner Thought / Reflection"
          >
            <span className="not-italic font-sans text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-900/90 px-1.5 py-0.5 rounded-md border border-purple-700/60 inline-flex items-center gap-1 shadow-xs">
              <span>💭</span>
              <span>THOUGHT</span>
            </span>
            "{innerContent}"
          </span>
        );
      } else {
        parts.push(`(${innerContent})`);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < children.length) {
      parts.push(children.substring(lastIndex));
    }

    return parts.length > 0 ? parts : children;
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <span key={i}>{renderContentWithThoughts(child)}</span>
    ));
  }

  return children;
}

// Memoized component to render message text with Markdown & Tables
const FormattedMessageContent = memo(function FormattedMessageContent({ content }) {
  if (!content) return null;

  return (
    <div className="space-y-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => {
            const raw =
              typeof children === "string"
                ? children
                : Array.isArray(children) && typeof children[0] === "string"
                  ? children[0]
                  : "";

            const trimmed = raw.trim();
            const isNarrativeHook =
              /^\s*[\(*]*\s*(ab dekhte|ab aage|dekhte hai|dekhte hain|aage kya|aage dekhte|story note|scene note|what happens next)[^)]*[\)*]*\s*$/i.test(
                trimmed
              );

            if (isNarrativeHook) {
              return <NarrativeTeaserCard text={trimmed} />;
            }

            return (
              <p className="mb-2.5 last:mb-0 leading-relaxed block">
                {renderContentWithThoughts(children)}
              </p>
            );
          },
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
            <div className="overflow-x-auto my-3 border border-purple-500/30 rounded-2xl bg-neutral-950/80 backdrop-blur-md shadow-lg">
              <table className="min-w-full divide-y divide-purple-500/20 text-xs text-neutral-200">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-purple-950/60 font-bold">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-2.5 text-left font-extrabold text-purple-200 uppercase tracking-wider text-[11px] border-b border-purple-500/30">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2.5 border-t border-white/5 text-neutral-300">{children}</td>,
          tr: ({ children }) => <tr className="hover:bg-purple-900/20 transition-colors">{children}</tr>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

// Memoized Chat Message Row component to prevent re-rendering all messages on input typing
const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isLatestMsg,
  latestMessageRef,
  sessionChars,
  onToggleContext,
  isToggling,
}) {
  const isUser = msg.role === "user";
  const charBlocks = useMemo(
    () => (!isUser ? parseCharacterSpeechBlocks(msg.content) : []),
    [isUser, msg.content]
  );

  return (
    <div
      ref={isLatestMsg ? latestMessageRef : null}
      className={`flex gap-4 max-w-3xl mx-auto group ${isUser ? "justify-end" : "justify-start"
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
              disabled={isToggling}
              onClick={() => onToggleContext(msg.id, msg.includeInContext)}
              className={`p-1 rounded transition-colors ${isToggling
                ? "text-blue-400 opacity-80 cursor-wait"
                : msg.includeInContext
                  ? "text-neutral-500 hover:text-blue-400 hover:bg-neutral-900 cursor-pointer"
                  : "text-amber-400 hover:text-amber-300 bg-amber-950/40 cursor-pointer"
                }`}
              title={
                isToggling
                  ? "Updating context memory..."
                  : msg.includeInContext
                    ? "Included in Context - Click to Exclude"
                    : "Excluded from Context - Click to Include"
              }
            >
              {isToggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : msg.includeInContext ? (
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
            className={`p-4 rounded-2xl text-sm leading-relaxed bg-neutral-800 text-neutral-100 rounded-tr-xs ${!msg.includeInContext ? "opacity-60 border-dashed border-amber-900/50" : ""
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
                  className={`p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-xs shadow-md ${!msg.includeInContext ? "opacity-60 border-dashed border-amber-900/50" : ""
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
});

export default function ChatView({
  activeChat,
  onUpdateChat,
  onDeleteChat,
  onOpenNewModal,
}) {
  const [inputPrompt, setInputPrompt] = useState("");
  const [messages, setMessages] = useState(activeChat?.messages || []);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseLength, setResponseLength] = useState("normal"); // "veryshort" | "short" | "normal" | "detailed"
  const [chatMode, setChatMode] = useState("turn"); // "turn" | "classic"
  const [typingCharacter, setTypingCharacter] = useState(null);

  // Load saved response length & chat mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLength = localStorage.getItem("gemini_response_length");
        if (savedLength && ["veryshort", "short", "normal", "detailed"].includes(savedLength)) {
          setResponseLength(savedLength);
        }
        const savedMode = localStorage.getItem("gemini_chat_mode");
        if (savedMode && ["turn", "classic"].includes(savedMode)) {
          setChatMode(savedMode);
        }
      } catch (e) {
        console.error("Error reading saved settings", e);
      }
    }
  }, []);

  const handleSetChatMode = (newMode) => {
    setChatMode(newMode);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gemini_chat_mode", newMode);
      } catch (e) {
        console.error("Error saving chat mode", e);
      }
    }
  };

  const handleSetResponseLength = (newLength) => {
    setResponseLength(newLength);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gemini_response_length", newLength);
      } catch (e) {
        console.error("Error saving response length", e);
      }
    }
  };
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyEdit, setStoryEdit] = useState("");
  const [charactersEdit, setCharactersEdit] = useState([]);
  const [showContextInfo, setShowContextInfo] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Quick Snippets & Instant Paste state
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState(null); // { x, y } screen coordinates
  const [snippets, setSnippets] = useState([]);
  const [newSnippetInput, setNewSnippetInput] = useState("");
  const [showAddSnippetInput, setShowAddSnippetInput] = useState(false);
  const snippetsMenuRef = useRef(null);

  // Close snippets popover menu on click / touch outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSnippetsMenu &&
        snippetsMenuRef.current &&
        !snippetsMenuRef.current.contains(e.target)
      ) {
        setShowSnippetsMenu(false);
        setContextMenuPos(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSnippetsMenu]);

  // Global right-click event handler to open context menu anywhere on screen
  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      e.preventDefault();

      const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
      const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;
      const menuWidth = 330;
      const menuHeight = 380;

      let posX = e.clientX;
      let posY = e.clientY;

      if (posX + menuWidth > windowWidth - 12) {
        posX = Math.max(12, windowWidth - menuWidth - 12);
      }
      if (posY + menuHeight > windowHeight - 12) {
        posY = Math.max(12, windowHeight - menuHeight - 12);
      }

      setContextMenuPos({ x: posX, y: posY });
      setShowSnippetsMenu(true);
    };

    document.addEventListener("contextmenu", handleGlobalContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleGlobalContextMenu);
    };
  }, []);

  // Fetch reusable phrases from database on mount with localStorage fallback
  const fetchSnippets = async () => {
    try {
      const res = await fetch("/api/snippets");
      if (res.ok) {
        const data = await res.json();
        const dbSnippets = data.snippets || [];
        setSnippets(dbSnippets);
        if (typeof window !== "undefined") {
          localStorage.setItem("gemini_chat_snippets", JSON.stringify(dbSnippets));
        }
        return;
      }
    } catch (err) {
      console.error("Failed to fetch snippets from database", err);
    }

    // Fallback to local storage if offline or not logged in
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gemini_chat_snippets");
        if (saved) {
          setSnippets(JSON.parse(saved));
        }
      } catch (e) {
        setSnippets([]);
      }
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleAddSnippet = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    const textToAdd = newSnippetInput.trim();
    if (!textToAdd) return;

    // Optimistic UI update
    const tempId = "temp-" + Date.now();
    const newSnipObj = { id: tempId, text: textToAdd };
    const updated = [...snippets, newSnipObj];
    setSnippets(updated);
    setNewSnippetInput("");
    setShowAddSnippetInput(false);

    if (typeof window !== "undefined") {
      localStorage.setItem("gemini_chat_snippets", JSON.stringify(updated));
    }

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAdd }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.snippet) {
          setSnippets((prev) =>
            prev.map((s) => (s.id === tempId ? data.snippet : s))
          );
        }
      }
    } catch (err) {
      console.error("Failed to save snippet to database", err);
    }
  };

  const handleDeleteSnippet = async (snippetToDelete, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const snipId = typeof snippetToDelete === "object" ? snippetToDelete.id : null;
    const snipText = typeof snippetToDelete === "object" ? snippetToDelete.text : snippetToDelete;

    const updated = snippets.filter((s) => (s.id ? s.id !== snipId : s !== snipText));
    setSnippets(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("gemini_chat_snippets", JSON.stringify(updated));
    }

    if (snipId && !snipId.startsWith("temp-")) {
      try {
        await fetch(`/api/snippets/${snipId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete snippet from database", err);
      }
    }
  };

  const handleInsertSnippet = (snippetText) => {
    setInputPrompt((prev) => {
      if (!prev) return snippetText;
      return /\s$/.test(prev) ? `${prev}${snippetText}` : `${prev} ${snippetText}`;
    });
    setShowSnippetsMenu(false);
    setContextMenuPos(null);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const messagesEndRef = useRef(null);
  const latestMessageRef = useRef(null);
  const textareaRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileDevice(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  // Smooth auto-scroll to bottom as new messages and turns arrive
  useEffect(() => {
    if (messages.length === 0) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  // Auto-expand textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputPrompt]);

  const handleKeyDown = (e) => {
    // On desktop, Enter submits form, Shift+Enter makes new line.
    // On mobile touch screen, Enter makes new line, Send button submits form.
    if (!isMobileDevice && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    if (activeChat) {
      setStoryEdit(activeChat.story || "");
      setCharactersEdit(activeChat.sessionCharacters || []);
      if (activeChat.messages && activeChat.messages.length > 0) {
        setMessages(activeChat.messages);
        setFetchingMessages(false);
      } else {
        setFetchingMessages(true);
      }
      fetchChatMessages(activeChat.id);
    } else {
      setMessages([]);
      setFetchingMessages(false);
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
    } finally {
      setFetchingMessages(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Windowing & Performance Optimization for Large Message Histories
  const [visibleCount, setVisibleCount] = useState(50);
  const visibleMessages = useMemo(() => {
    if (messages.length <= visibleCount) return messages;
    return messages.slice(messages.length - visibleCount);
  }, [messages, visibleCount]);

  // Context token calculation & limits
  const MAX_CONTEXT_TOKENS = 256000; // 256,000 tokens max limit
  const { totalTokens, tokensRemaining, usagePercentage, includedMessages } = useMemo(() => {
    const incMsgs = messages.filter((m) => m.includeInContext);
    const tokens = incMsgs.reduce(
      (acc, m) => acc + (m.tokenEstimate || Math.ceil((m.content || "").length / 4)),
      0
    );
    const remaining = Math.max(0, MAX_CONTEXT_TOKENS - tokens);
    const usage = Math.min(100, (tokens / MAX_CONTEXT_TOKENS) * 100);
    return {
      totalTokens: tokens,
      tokensRemaining: remaining,
      usagePercentage: usage,
      includedMessages: incMsgs,
    };
  }, [messages]);

  // Steady typewriter animation helper: Displays character name header immediately, streaming dialogue text afterwards
  const animateTypewriterMessage = (modelMessage) => {
    return new Promise((resolve) => {
      const fullContent = modelMessage.content || "";
      if (!fullContent) {
        resolve();
        return;
      }

      // Detect character tag header prefix (e.g. [Prof. Ananya]: )
      const tagMatch = /(?:^|\n)(?:\[([^\]]+)\]|\*\*([^*]+)\*\*|([A-Z][a-zA-Z0-9_\s]{1,20})):\s*/.exec(fullContent);
      const startOffset = tagMatch && tagMatch.index === 0 ? tagMatch[0].length : 0;

      // Render character tag prefix immediately so avatar badge displays instantly without letter-by-letter typing
      const initialPrefix = fullContent.slice(0, startOffset);
      const emptyMsg = { ...modelMessage, content: initialPrefix };
      setMessages((prev) => [...prev, emptyMsg]);

      let index = startOffset;
      const remainingLength = fullContent.length - startOffset;
      const stepSize = Math.max(1, Math.ceil(remainingLength / 220));
      const intervalMs = 50;

      const timer = setInterval(() => {
        index += stepSize;
        if (index >= fullContent.length) {
          clearInterval(timer);
          setMessages((prev) =>
            prev.map((m) => (m.id === modelMessage.id ? { ...m, content: fullContent } : m))
          );
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(resolve, 400);
        } else {
          const partial = fullContent.slice(0, index);
          setMessages((prev) =>
            prev.map((m) => (m.id === modelMessage.id ? { ...m, content: partial } : m))
          );
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, intervalMs);
    });
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || !activeChat || loading) return;

    const currentPrompt = inputPrompt;
    setInputPrompt("");
    setLoading(true);

    const initialSpeaker = sessionChars.length > 0 ? sessionChars[0].name : "AI";
    setTypingCharacter(initialSpeaker);

    const tempUserMsg = {
      id: "temp-" + Date.now(),
      role: "user",
      content: currentPrompt,
      includeInContext: true,
      tokenEstimate: Math.ceil(currentPrompt.length / 4),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    if (chatMode === "turn") {
      try {
        setTypingCharacter(null);

        // Initial Turn API call with user prompt
        const res = await fetch("/api/feature/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatSessionId: activeChat.id,
            prompt: currentPrompt,
            responseLength,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed turn response");
        }

        // Replace temp user message with actual saved user message
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== tempUserMsg.id)
            .concat(data.userMessage ? [data.userMessage] : [])
        );

        setTypingCharacter(null);

        // Typewriter animation for 1st character response
        if (data.modelMessage) {
          await animateTypewriterMessage(data.modelMessage);
        }

        let currentNextSpeaker = data.nextSpeaker;
        let userTurnFlag = data.isUserTurn;
        let turnCount = 1;
        const MAX_CONSECUTIVE_TURNS = 6;

        // Turn-by-Turn loop: execute subsequent character turns ONLY when another response IS incoming
        while (
          !userTurnFlag &&
          currentNextSpeaker &&
          currentNextSpeaker !== "me" &&
          currentNextSpeaker.toUpperCase() !== "USER" &&
          turnCount < MAX_CONSECUTIVE_TURNS
        ) {
          // Display typing indicator ONLY because another character response IS coming!
          setTypingCharacter(currentNextSpeaker);

          // Small realistic pause before fetch
          await new Promise((r) => setTimeout(r, 400));

          const nextRes = await fetch("/api/feature/turn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chatSessionId: activeChat.id,
              prompt: null,
              responseLength,
            }),
          });

          const nextData = await nextRes.json();
          if (!nextRes.ok) break;

          setTypingCharacter(null);

          // Typewriter animation for next character response
          if (nextData.modelMessage) {
            await animateTypewriterMessage(nextData.modelMessage);
          }

          currentNextSpeaker = nextData.nextSpeaker;
          userTurnFlag = nextData.isUserTurn;
          turnCount++;
        }
      } catch (err) {
        alert("Error in Turn-by-Turn mode: " + err.message);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      } finally {
        setTypingCharacter(null);
        setLoading(false);
      }
    } else {
      // Classic Mode
      try {
        setTypingCharacter(
          sessionChars.length > 0 ? sessionChars.map((c) => c.name).join(" & ") : "AI"
        );

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatSessionId: activeChat.id,
            prompt: currentPrompt,
            responseLength,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        // Replace temp user message with actual saved user message
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== tempUserMsg.id)
            .concat(data.userMessage ? [data.userMessage] : [])
        );

        // Typewriter animation for classic response
        if (data.modelMessage) {
          await animateTypewriterMessage(data.modelMessage);
        }
      } catch (err) {
        alert("Error sending message: " + err.message);
        setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      } finally {
        setTypingCharacter(null);
        setLoading(false);
      }
    }
  };

  const [togglingContextIds, setTogglingContextIds] = useState(new Set());

  const handleToggleContext = async (messageId, currentFlag) => {
    if (togglingContextIds.has(messageId)) return;

    setTogglingContextIds((prev) => new Set(prev).add(messageId));
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
    } finally {
      setTogglingContextIds((prev) => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    }
  };

  const [optimizingFieldEdit, setOptimizingFieldEdit] = useState(null);

  const handleOptimizeTextEdit = async (target, text, type = "persona") => {
    if (!text || !text.trim()) return;
    setOptimizingFieldEdit(target);

    try {
      const res = await fetch("/api/characters/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      const data = await res.json();
      if (res.ok && data.optimizedText) {
        if (target === "story") {
          setStoryEdit(data.optimizedText);
        } else {
          handleCharacterEditChange(target, "persona", data.optimizedText);
        }
      } else {
        alert("Failed to optimize text: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error optimizing text: " + err.message);
    } finally {
      setOptimizingFieldEdit(null);
    }
  };

  const handleAddCharacterEdit = () => {
    setCharactersEdit((prev) => [
      ...prev,
      {
        id: "new-" + Date.now(),
        name: "",
        persona: "",
      },
    ]);
  };

  const handleRemoveCharacterEdit = (id) => {
    if (charactersEdit.length <= 1) {
      alert("At least one character is required for the roleplay session.");
      return;
    }
    setCharactersEdit((prev) => prev.filter((c) => (c.id || c.name) !== id));
  };

  const handleCharacterEditChange = (id, field, value) => {
    setCharactersEdit((prev) =>
      prev.map((c) => ((c.id || c.name) === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSaveStoryAndCharacters = async () => {
    const activeCharacters = (charactersEdit || [])
      .map((c) => ({ name: (c.name || "").trim(), persona: (c.persona || "").trim() }))
      .filter((c) => c.name !== "" && c.persona !== "");

    if (activeCharacters.length === 0) {
      alert("Please fill in at least one character name and persona.");
      return;
    }

    try {
      const res = await fetch(`/api/chats/${activeChat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: storyEdit.trim(),
          characters: activeCharacters,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateChat(data.chatSession);
        setShowStoryModal(false);
      } else {
        alert("Failed to update session details");
      }
    } catch (err) {
      alert("Failed to update session details: " + err.message);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-transparent relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
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

        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Where should we start?
        </h2>
        <p className="text-neutral-400 max-w-md text-sm mb-6">
          Create a multi-character roleplay session to chat with multiple AI personas in a single response.
        </p>

        <button
          onClick={onOpenNewModal}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-95 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Character Chat</span>
        </button>
      </div>
    );
  }

  const sessionChars = activeChat.sessionCharacters || charactersEdit || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-neutral-100 overflow-hidden relative overscroll-none">

      {/* Top Multi-Character Session Bar */}
      <div className="h-14 border-b border-neutral-800/80 px-3 md:px-6 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md z-10 shrink-0 touch-none select-none overscroll-none">
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

              <Tooltip content="Edit Scenario & Personas" position="bottom" badgeIcon="📝">
                <button
                  onClick={() => setShowStoryModal(true)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>

            <p className="text-[11px] md:text-xs text-neutral-400 line-clamp-1 max-w-[140px] sm:max-w-md">
              {activeChat.story || "Interactive roleplay scenario."}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
          {/* Mode Switcher Selector */}
          <div className="hidden md:flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-0.5 text-xs shadow-inner">
            <Tooltip content="Gemini decides speaker turns dynamically" position="bottom" badgeIcon="🎭">
              <button
                onClick={() => handleSetChatMode("turn")}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${chatMode === "turn"
                  ? "bg-purple-950/80 border border-purple-600/80 text-purple-300 shadow-sm font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                <span>🎭 Dynamic Turn</span>
              </button>
            </Tooltip>

            <Tooltip content="Generates all character responses in 1 block" position="bottom" badgeIcon="⚡">
              <button
                onClick={() => handleSetChatMode("classic")}
                className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${chatMode === "classic"
                  ? "bg-blue-950/80 border border-blue-600/80 text-blue-300 shadow-sm font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <Zap className="w-3 h-3 text-blue-400 shrink-0" />
                <span>⚡ Classic</span>
              </button>
            </Tooltip>
          </div>

          {/* Desktop Response Length Pill Selector */}
          <div className="hidden sm:flex items-center bg-neutral-900 border border-neutral-800 rounded-full p-0.5 text-xs shadow-inner">
            <Tooltip content="Strictly 1 short sentence per character" position="bottom" badgeIcon="⚡">
              <button
                onClick={() => handleSetResponseLength("veryshort")}
                className={`px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${responseLength === "veryshort"
                  ? "bg-red-950/80 border border-red-600/80 text-red-300 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <Zap className="w-3 h-3 text-red-400 shrink-0" />
                <span>V.Short</span>
              </button>
            </Tooltip>

            <Tooltip content="Concise 1-2 sentences per character" position="bottom" badgeIcon="⚡">
              <button
                onClick={() => handleSetResponseLength("short")}
                className={`px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${responseLength === "short"
                  ? "bg-amber-950/80 border border-amber-600/80 text-amber-300 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Short</span>
              </button>
            </Tooltip>

            <Tooltip content="Balanced natural roleplay length" position="bottom" badgeIcon="💬">
              <button
                onClick={() => handleSetResponseLength("normal")}
                className={`px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${responseLength === "normal"
                  ? "bg-blue-950/80 border border-blue-600/80 text-blue-300 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <span>Normal</span>
              </button>
            </Tooltip>

            <Tooltip content="Immersive rich dialogue & actions" position="bottom" badgeIcon="📖">
              <button
                onClick={() => handleSetResponseLength("detailed")}
                className={`px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-medium transition-all cursor-pointer ${responseLength === "detailed"
                  ? "bg-purple-950/80 border border-purple-600/80 text-purple-300 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                <BookOpen className="w-3 h-3 text-purple-400 shrink-0" />
                <span>Detailed</span>
              </button>
            </Tooltip>
          </div>

          {/* Context Window Status Gauge */}
          <Tooltip content="Token Capacity & Memory Status" position="bottom" badgeIcon="🧠">
            <button
              onClick={() => setShowContextInfo(!showContextInfo)}
              className={`text-xs px-2 md:px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-all ${showContextInfo
                ? "bg-blue-950/60 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
            >
              <ContextCircularGauge percentage={usagePercentage} size={20} strokeWidth={2.5} />
              <span className="hidden sm:inline font-medium">Context:</span>
              <span className="font-semibold text-white text-[11px] md:text-xs">~{totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens}t</span>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                {((100 - usagePercentage)).toFixed(0)}% free
              </span>
            </button>
          </Tooltip>

          {/* Desktop Delete Button */}
          <Tooltip content="Delete Chat Session" position="bottom" badgeIcon="🗑️">
            <button
              onClick={() => onDeleteChat(activeChat.id)}
              className="hidden sm:flex p-1.5 md:p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>


          {/* Mobile 3-Dots Options Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-1.5 rounded-xl border transition-colors ${showMobileMenu
                ? "bg-neutral-800 border-neutral-700 text-white"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              title="More Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Mobile Options Modal / Floating Sheet with Fixed Viewport Positioning */}
            {showMobileMenu && (
              <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-end p-3 pt-14 animate-in fade-in duration-150"
                onClick={() => setShowMobileMenu(false)}
              >
                <div
                  className="w-72 max-w-[calc(100vw-24px)] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-semibold text-white">
                    <span>Chat Session Options</span>
                    <button
                      type="button"
                      onClick={() => setShowMobileMenu(false)}
                      className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Response Mode Selector */}
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                      Response Style Mode
                    </span>
                    <div className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          handleSetChatMode("turn");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${chatMode === "turn"
                          ? "bg-purple-950/90 text-purple-300 border border-purple-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>🎭 Dynamic Turn</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSetChatMode("classic");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-2 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${chatMode === "classic"
                          ? "bg-blue-950/90 text-blue-300 border border-blue-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <Zap className="w-3 h-3 text-blue-400 shrink-0" />
                        <span>⚡ Classic</span>
                      </button>
                    </div>
                  </div>

                  {/* Response Length Selector */}
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                      Response Length
                    </span>
                    <div className="grid grid-cols-4 gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          handleSetResponseLength("veryshort");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-0.5 transition-all ${responseLength === "veryshort"
                          ? "bg-red-950/90 text-red-300 border border-red-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <Zap className="w-3 h-3 text-red-400 shrink-0" />
                        <span>V.Short</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSetResponseLength("short");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-0.5 transition-all ${responseLength === "short"
                          ? "bg-amber-950/90 text-amber-300 border border-amber-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Short</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSetResponseLength("normal");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-all ${responseLength === "normal"
                          ? "bg-blue-950/90 text-blue-300 border border-blue-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <span>Normal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSetResponseLength("detailed");
                          setShowMobileMenu(false);
                        }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-0.5 transition-all ${responseLength === "detailed"
                          ? "bg-purple-950/90 text-purple-300 border border-purple-600/80 shadow"
                          : "text-neutral-400 hover:text-white"
                          }`}
                      >
                        <BookOpen className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </div>

                  {/* Delete Session Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onDeleteChat(activeChat.id);
                    }}
                    className="w-full mt-1 p-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center gap-2 transition-colors text-left"
                  >
                    <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Delete Chat Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Window Detailed Circular Gauge & Dashboard Banner */}
      {showContextInfo && (
        <div className="bg-neutral-900/95 border-b border-neutral-800 p-4 px-4 md:px-6 text-xs text-neutral-300 animate-in slide-in-from-top-2 backdrop-blur-md z-20">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                <span className="font-semibold text-white text-sm">
                  Gemini Context Capacity ({activeChat.selectedModel || "gemini-3.5-flash-lite"})
                </span>
              </div>
              <button
                onClick={() => setShowContextInfo(false)}
                className="text-neutral-500 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Circular Ring Hero + Metrics Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/80 border border-neutral-800 p-3.5 rounded-2xl">
              {/* Main Circular Progress Ring */}
              <div className="flex items-center gap-3 px-2 border-b sm:border-b-0 sm:border-r border-neutral-800 pb-3 sm:pb-0 sm:pr-6 shrink-0">
                <ContextCircularGauge
                  percentage={usagePercentage}
                  size={72}
                  strokeWidth={6}
                  label={
                    <>
                      <span className="text-xs font-bold text-white font-mono leading-none">
                        {((100 - usagePercentage)).toFixed(0)}%
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-400 uppercase tracking-tighter mt-0.5">
                        Free
                      </span>
                    </>
                  }
                />
                <div>
                  <span className="text-xs font-bold text-white block">Context Ring Gauge</span>
                  <span className="text-[11px] text-neutral-400 block">
                    {usagePercentage < 0.01 && totalTokens > 0 ? "< 0.01%" : `${usagePercentage.toFixed(2)}%`} used
                  </span>
                </div>
              </div>

              {/* Context Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 w-full">
                <div className="bg-neutral-900 border border-neutral-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Used Context</span>
                  <span className="text-xs font-bold text-blue-400">~{totalTokens.toLocaleString()} t</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Remaining Space</span>
                  <span className="text-xs font-bold text-emerald-400">~{tokensRemaining.toLocaleString()} t</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Max Limit</span>
                  <span className="text-xs font-bold text-purple-400">256,000 t</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-800/80 p-2.5 rounded-xl">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Active History</span>
                  <span className="text-xs font-bold text-neutral-200">{includedMessages.length} / {messages.length} msgs</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              💡 <strong>Context window:</strong> Gemini Flash Lite supports <strong>256,000 tokens</strong> (~256k tokens). Every message with an active eye icon (<Eye className="w-3.5 h-3.5 inline text-blue-400" />) is fed into prompt memory. Click the eye icon on any older message to exclude it and free up memory space.
            </p>
          </div>
        </div>
      )}

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 touch-pan-y overscroll-contain">
        {fetchingMessages && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center my-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
            <span className="text-xs font-semibold text-neutral-400">Loading session messages...</span>
          </div>
        ) : messages.length === 0 ? (
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
          <>
            {messages.length > visibleCount && (
              <div className="flex justify-center my-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 50)}
                  className="text-xs font-semibold px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-blue-400 hover:text-white hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  📜 Load earlier messages ({messages.length - visibleCount} hidden)
                </button>
              </div>
            )}

            {visibleMessages.map((msg, index) => {
              const isLatestMsg = index === visibleMessages.length - 1;
              return (
                <ChatMessageItem
                  key={msg.id}
                  msg={msg}
                  isLatestMsg={isLatestMsg}
                  latestMessageRef={latestMessageRef}
                  sessionChars={sessionChars}
                  onToggleContext={handleToggleContext}
                  isToggling={togglingContextIds.has(msg.id)}
                />
              );
            })}
          </>
        )}

        {loading && typingCharacter && (
          <div className="flex gap-4 max-w-3xl mx-auto justify-start animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="p-3.5 px-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-neutral-300 text-sm flex items-center gap-3 shadow-lg rounded-tl-xs">
              {/* Bouncing 3-Dot Typing Animation */}
              <div className="flex items-center gap-1.5 px-1 py-1">
                <span
                  className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>

              <span className="text-xs text-purple-300 font-bold tracking-wide font-mono">
                {typingCharacter === "Thinking who speaks..." ? "Selecting next speaker..." : `${typingCharacter} is typing...`}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Input Capsule Bar */}
      <div className="p-3 md:px-8 max-w-4xl mx-auto w-full z-10">
        <form
          onSubmit={handleSendMessage}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSnippetsMenu(true);
          }}
          className="relative bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-2 px-3.5 shadow-2xl flex items-end gap-2.5 focus-within:border-neutral-700 transition-all"
        >
          {/* Quick Snippets & Instant Paste Button + Popover Menu */}
          <div ref={snippetsMenuRef} className="relative shrink-0 mb-1">
            <button
              type="button"
              onClick={() => {
                setContextMenuPos(null);
                setShowSnippetsMenu(!showSnippetsMenu);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${showSnippetsMenu
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 rotate-45"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              title="Instant Paste Snippets & Menu (Right-click anywhere on screen to open)"
            >
              <Plus className="w-5 h-5 transition-transform" />
            </button>

            {/* Quick Snippets & Presets Popover Menu */}
            {showSnippetsMenu && (
              <div
                style={
                  contextMenuPos
                    ? {
                      position: "fixed",
                      left: `${contextMenuPos.x}px`,
                      top: `${contextMenuPos.y}px`,
                    }
                    : undefined
                }
                className={`${contextMenuPos
                    ? "z-[99999] shadow-2xl animate-in zoom-in-95 fade-in duration-150"
                    : "absolute bottom-12 left-0 z-50 animate-in slide-in-from-bottom-2 fade-in duration-150"
                  } w-80 sm:w-96 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-4 max-w-[calc(100vw-32px)] ring-1 ring-white/10`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800 mb-3">
                  <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
                    <Bookmark className="w-4 h-4 text-blue-400" />
                    <span>Instant Paste & Actions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSnippetsMenu(false);
                      setContextMenuPos(null);
                    }}
                    className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Create New Roleplay Chat Option */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSnippetsMenu(false);
                    onOpenNewModal();
                  }}
                  className="w-full mb-3 p-2.5 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/60 text-blue-200 text-sm font-semibold flex items-center gap-2 transition-colors text-left"
                >
                  <Plus className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Create New Chat Session</span>
                </button>

                {/* Quick Character Tags (if available) */}
                {sessionChars.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                      Quick Character Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sessionChars.map((char) => (
                        <button
                          key={char.id || char.name}
                          type="button"
                          onClick={() => handleInsertSnippet(`[${char.name}]: `)}
                          className="text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700/80 text-blue-300 font-semibold hover:border-blue-500 hover:text-white transition-all active:scale-95 flex items-center gap-1"
                          title={`Insert [${char.name}]: tag`}
                        >
                          [{char.name}]
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Snippets List */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">
                      Reusable Phrases ({snippets.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddSnippetInput(!showAddSnippetInput)}
                      className="text-xs text-blue-400 hover:underline font-semibold"
                    >
                      {showAddSnippetInput ? "Cancel" : "+ Add Custom"}
                    </button>
                  </div>

                  {/* Add Custom Snippet Inline Control */}
                  {showAddSnippetInput && (
                    <div className="flex items-center gap-2 my-2 p-1.5 bg-neutral-950 rounded-xl border border-neutral-700/80 w-full">
                      <input
                        type="text"
                        placeholder="Type phrase or name..."
                        value={newSnippetInput}
                        onChange={(e) => setNewSnippetInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddSnippet(e);
                          }
                        }}
                        className="flex-1 min-w-0 bg-transparent py-1 px-2 text-sm text-white placeholder-neutral-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddSnippet}
                        disabled={!newSnippetInput.trim()}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-40"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {snippets.length === 0 && !showAddSnippetInput ? (
                    <p className="text-xs text-neutral-500 italic py-2 text-center">
                      No custom phrases added yet. Click <strong>+ Add Custom</strong> to save phrases or names!
                    </p>
                  ) : (
                    snippets.map((snip, index) => {
                      const text = typeof snip === "object" ? snip.text : snip;
                      const key = typeof snip === "object" ? (snip.id || index) : index;
                      return (
                        <div
                          key={key}
                          onClick={() => handleInsertSnippet(text)}
                          className="group flex items-center justify-between p-2.5 px-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 cursor-pointer transition-colors text-sm text-neutral-200"
                        >
                          <span className="truncate pr-2 font-medium">{text}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteSnippet(snip, e);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
                            title="Delete phrase"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowSnippetsMenu(true);
            }}
            placeholder={`Speak to ${sessionChars.map((c) => c.name).join(", ")}...`}
            className="flex-1 bg-transparent text-base sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none max-h-40 min-h-[38px] py-2 leading-relaxed"
            disabled={loading}
          />

          <div className="flex items-center gap-1 shrink-0 mb-1">
            <Tooltip content="Speech Voice Input" position="top" badgeIcon="🎙️">
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>
            </Tooltip>

            <Tooltip content="Send Message (Enter)" position="top" badgeIcon="🚀">
              <button
                type="submit"
                disabled={!inputPrompt.trim() || loading}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>

        </form>
        <p className="text-[11px] text-center text-neutral-500 mt-2">
          {isMobileDevice ? (
            <span>Tap <strong>Send</strong> button to post message. <strong>Return</strong> key creates a new line.</span>
          ) : (
            <span>
              Press <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-400 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-400 font-mono text-[10px]">Shift + Enter</kbd> for new line. Right-click or press <kbd className="px-1 py-0.5 bg-neutral-800 rounded text-neutral-400 font-mono text-[10px]">+</kbd> for quick actions.
            </span>
          )}
        </p>
      </div>

      {/* Edit Story & Characters Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white text-base">Edit Scenario Story & Characters</h3>
              </div>
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Story Scenario Setting */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Story / Scenario Setting Background
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOptimizeTextEdit("story", storyEdit, "story")}
                    disabled={!storyEdit?.trim() || optimizingFieldEdit === "story"}
                    className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 px-2 py-0.5 rounded-lg transition-all disabled:opacity-40"
                    title="Improve spelling, grammar & enhance story setting with Gemini"
                  >
                    {optimizingFieldEdit === "story" ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                        <span>Improving...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>✨ Improve with Gemini</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={storyEdit}
                  onChange={(e) => setStoryEdit(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none transition-colors"
                  placeholder="Describe scenario setting or world context..."
                />
              </div>

              {/* Edit Session Characters */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Session Characters ({charactersEdit.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCharacterEdit}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Character</span>
                  </button>
                </div>

                {charactersEdit.map((char, index) => {
                  const charKey = char.id || char.name || index;
                  return (
                    <div
                      key={charKey}
                      className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-4 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-300">
                          Character #{index + 1}
                        </span>
                        {charactersEdit.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCharacterEdit(charKey)}
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
                            value={char.name || ""}
                            onChange={(e) =>
                              handleCharacterEditChange(charKey, "name", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-medium text-neutral-400">
                              Character Persona & Speaking Style
                            </label>
                            <button
                              type="button"
                              onClick={() => handleOptimizeTextEdit(charKey, char.persona, "persona")}
                              disabled={!char.persona?.trim() || optimizingFieldEdit === charKey}
                              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 px-2 py-0.5 rounded-lg transition-all disabled:opacity-40"
                              title="Improve spelling, grammar & expand persona with Gemini"
                            >
                              {optimizingFieldEdit === charKey ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                                  <span>Improving...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 text-purple-400" />
                                  <span>✨ Improve with Gemini</span>
                                </>
                              )}
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            required
                            placeholder="e.g. Smart, observational detective who speaks formally."
                            value={char.persona || ""}
                            onChange={(e) =>
                              handleCharacterEditChange(charKey, "persona", e.target.value)
                            }
                            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800 shrink-0">
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStoryAndCharacters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
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
