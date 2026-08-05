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
  ChevronDown,
  MessageSquare,
  CornerDownLeft,
  CheckSquare,
  AlertTriangle,
  UserCheck,
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
    <div className="my-2.5 p-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-amber-950/60 to-neutral-900 border border-purple-500/40 text-amber-200/90 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 animate-in fade-in duration-200 group hover:border-purple-400/60 transition-all">
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </div>
        <span className="font-semibold text-purple-300 not-italic font-sans uppercase tracking-wider text-[10px] bg-purple-950/90 px-2 py-0.5 rounded-md border border-purple-700/60 shadow-xs">
          🎬 Story Scene Hook
        </span>
      </div>
      <div className="text-xs sm:text-sm font-serif italic tracking-wide leading-relaxed pl-0.5 sm:pl-0">
        "{cleanText}"
      </div>
    </div>
  );
});

// Helper to render Character.ai Standard Roleplay format (Thought, Action, Dialogue)
function renderContentWithThoughts(children) {
  if (typeof children === "string") {
    if (!children.includes("(")) return children;

    // Match order: 1. Explicit (thought: '...') 2. Parenthetical (action/thought)
    const regex = /\(\s*thought\s*:\s*['"]?([^'")\n]{2,})['"]?\s*\)|\(([^)\n]{2,})\)/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(children)) !== null) {
      if (match.index > lastIndex) {
        parts.push(children.substring(lastIndex, match.index));
      }

      const explicitThoughtText = match[1];
      const parentheticalText = match[2];

      if (explicitThoughtText !== undefined) {
        // 💭 THOUGHT CARD (thought: '...')
        const innerContent = explicitThoughtText.trim();
        parts.push(
          <span
            key={match.index}
            className="my-1.5 p-3 rounded-2xl bg-purple-950/90 border border-purple-700/60 text-purple-200 font-serif italic text-xs sm:text-sm shadow-lg backdrop-blur-md flex flex-col items-start gap-1.5 w-full sm:w-auto sm:inline-flex"
            title="Character Inner Thought / Reflection"
          >
            <span className="not-italic font-sans text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-900/90 px-2 py-0.5 rounded-md border border-purple-700/60 inline-flex items-center gap-1 shadow-xs shrink-0">
              <span>💭</span>
              <span>THOUGHT</span>
            </span>
            <span className="leading-relaxed font-serif">"{innerContent}"</span>
          </span>
        );
      } else if (parentheticalText !== undefined) {
        const innerContent = parentheticalText.trim();
        const wordCount = innerContent.split(/\s+/).filter(Boolean).length;

        // Check if explicitly contains thought prefix or reflection
        const isThought = /^thought\s*:/i.test(innerContent);

        if (isThought) {
          const cleanThought = innerContent.replace(/^thought\s*:\s*/i, "").replace(/^['"]|['"]$/g, "").trim();
          parts.push(
            <span
              key={match.index}
              className="my-1.5 p-3 rounded-2xl bg-purple-950/90 border border-purple-700/60 text-purple-200 font-serif italic text-xs sm:text-sm shadow-lg backdrop-blur-md flex flex-col items-start gap-1.5 w-full sm:w-auto sm:inline-flex"
              title="Character Inner Thought / Reflection"
            >
              <span className="not-italic font-sans text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-900/90 px-2 py-0.5 rounded-md border border-purple-700/60 inline-flex items-center gap-1 shadow-xs shrink-0">
                <span>💭</span>
                <span>THOUGHT</span>
              </span>
              <span className="leading-relaxed font-serif">"{cleanThought}"</span>
            </span>
          );
        } else if (wordCount >= 2) {
          // Check if parenthetical content describes explicit physical action / movement
          const isAction = /\b(walks|smiles|laughs|nods|points|leans|looks|sighs|whispers|turns|stands|sits|jeb|haath|kaan|sargoshi|kadam|apne|apni|hua|hue|huye|nikalta|nikalti|paas|karita|dekhti|dekhta|muskurate|kehte|dekhne|pakadte|chute|baithte|chalte|action)\b/i.test(
            innerContent
          );

          if (isAction) {
            // 🎭 CHARACTER ACTION / MOVEMENT CARD (...)
            parts.push(
              <span
                key={match.index}
                className="my-1.5 p-2.5 px-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 font-sans text-xs sm:text-sm shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 my-1 w-full sm:w-auto"
                title="Character Action & Movement"
              >
                <span className="not-italic font-sans text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/90 px-1.5 py-0.5 rounded-md border border-emerald-500/40 shrink-0">
                  🎭 ACTION
                </span>
                <span className="italic text-emerald-100 font-normal leading-relaxed">
                  {innerContent}
                </span>
              </span>
            );
          } else {
            parts.push(`(${innerContent})`);
          }
        } else {
          parts.push(`(${innerContent})`);
        }
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
              ) || /^\s*\([^)]+\)\s*$/.test(trimmed);

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

const ChatMessageItem = memo(function ChatMessageItem({
  msg,
  isLatestMsg,
  latestMessageRef,
  sessionChars,
  onToggleContext,
  isToggling,
  onRequestDelete,
  isBatchMode,
  isSelected,
  onToggleSelect,
  onLongPressSelect,
}) {
  const isUser = msg.role === "user";
  const touchTimerRef = useRef(null);

  const charBlocks = useMemo(
    () => (!isUser ? parseCharacterSpeechBlocks(msg.content) : []),
    [isUser, msg.content]
  );

  const handleTouchStart = () => {
    touchTimerRef.current = setTimeout(() => {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        try {
          window.navigator.vibrate(40);
        } catch (e) {}
      }
      if (onLongPressSelect) {
        onLongPressSelect(msg.id);
      }
    }, 450);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleTouchMove = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  return (
    <div
      ref={isLatestMsg ? latestMessageRef : null}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={isBatchMode ? () => onToggleSelect(msg.id) : undefined}
      className={`flex gap-3 max-w-3xl mx-auto group transition-all duration-150 rounded-2xl p-1.5 ${
        isUser ? "justify-end" : "justify-start"
      } ${
        isBatchMode ? "cursor-pointer hover:bg-neutral-900/60 select-none" : ""
      } ${
        isSelected
          ? "bg-purple-950/40 border-2 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
          : "border-2 border-transparent"
      }`}
    >
      {isBatchMode && (
        <div className="flex items-center justify-center shrink-0 pt-2 px-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(msg.id)}
            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
          />
        </div>
      )}

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

          <div className="flex items-center gap-1.5">
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

            <button
              onClick={() => onRequestDelete(msg)}
              className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer"
              title="Delete Message"
            >
              <Trash2 className="w-3.5 h-3.5" />
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
  const [isQueuedNotice, setIsQueuedNotice] = useState(false);
  const [dismissPersonaWarning, setDismissPersonaWarning] = useState(false);

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
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);
  const lengthDropdownRef = useRef(null);
  const [showMobileModelDropdown, setShowMobileModelDropdown] = useState(false);
  const mobileModelDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showLengthDropdown &&
        lengthDropdownRef.current &&
        !lengthDropdownRef.current.contains(e.target)
      ) {
        setShowLengthDropdown(false);
      }
      if (
        showMobileModelDropdown &&
        mobileModelDropdownRef.current &&
        !mobileModelDropdownRef.current.contains(e.target)
      ) {
        setShowMobileModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLengthDropdown, showMobileModelDropdown]);

  const handleModelChangeInChat = async (modelId) => {
    if (!activeChat?.id) return;
    try {
      const res = await fetch(`/api/chats/${activeChat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedModel: modelId }),
      });
      const data = await res.json();
      if (res.ok && data.chatSession && onUpdateChat) {
        onUpdateChat(data.chatSession);
      }
    } catch (e) {
      console.error("Failed to update selected model:", e);
    }
  };

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

  const handlePresetAction = (actionType) => {
    let presetText = "";
    if (actionType === "story") {
      presetText = "(Ab dekhte hai aage kahani mein kya exciting turn aata hai...)";
    } else if (actionType === "drama") {
      presetText = "(Achanak scene mein ek bada aur dramatic twist aata hai!)";
    } else if (actionType === "continue") {
      presetText = "Aage kya hota hai? Apni baatein continue karo.";
    } else if (actionType === "group") {
      presetText = "Aap sab aapas mein is baat par charcha karo aur apna apna point of view rakho.";
    }

    if (presetText) {
      handleInsertSnippet(presetText);
    }
  };

  const messagesEndRef = useRef(null);
  const latestMessageRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);
  const userScrolledUp = useRef(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileDevice(window.matchMedia("(pointer: coarse)").matches);
    }
  }, []);

  const handleContainerScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    userScrolledUp.current = !isNearBottom;
    setShowScrollBottomBtn(!isNearBottom);
  };

  const scrollToBottom = (behavior = "smooth") => {
    userScrolledUp.current = false;
    setShowScrollBottomBtn(false);
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll to bottom when new messages arrive or when a character starts typing
  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    if (!userScrolledUp.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages.length, loading, typingCharacter]);

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
      // Relaxed, comfortable typewriter streaming pace
      const stepSize = Math.max(1, Math.ceil(remainingLength / 350));
      const intervalMs = 65;

      const timer = setInterval(() => {
        index += stepSize;
        if (index >= fullContent.length) {
          clearInterval(timer);
          setMessages((prev) =>
            prev.map((m) => (m.id === modelMessage.id ? { ...m, content: fullContent } : m))
          );
          if (!userScrolledUp.current && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
          setTimeout(resolve, 150);
        } else {
          const partial = fullContent.slice(0, index);
          setMessages((prev) =>
            prev.map((m) => (m.id === modelMessage.id ? { ...m, content: partial } : m))
          );
          if (!userScrolledUp.current && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
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
        const initialSpeaker = sessionChars.length > 0 ? sessionChars[0].name : "AI";
        setTypingCharacter(initialSpeaker);

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

        // Update high demand & queued status strictly based on server rate queue state
        const serverHighDemand = Boolean(data.isHighDemand || data.wasQueued || res.headers.get("X-High-Demand") === "true");
        const serverQueued = Boolean(data.wasQueued || res.headers.get("X-Queued") === "true");

        setIsQueuedNotice(serverQueued);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ai-high-demand", { detail: { active: serverHighDemand } }));
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed turn response");
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ai-usage-updated"));
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

          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("ai-usage-updated"));
          }

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
        setIsQueuedNotice(false);
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

        // Update high demand & queued status strictly based on server rate queue state
        const serverHighDemand = Boolean(data.isHighDemand || data.wasQueued || res.headers.get("X-High-Demand") === "true");
        const serverQueued = Boolean(data.wasQueued || res.headers.get("X-Queued") === "true");

        setIsQueuedNotice(serverQueued);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ai-high-demand", { detail: { active: serverHighDemand } }));
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to send message");
        }

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ai-usage-updated"));
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
        setIsQueuedNotice(false);
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

  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeletingMessage, setIsDeletingMessage] = useState(false);

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete || !activeChat) return;
    const targetId = messageToDelete.id;
    setIsDeletingMessage(true);

    // Optimistically remove message from state
    setMessages((prev) => prev.filter((m) => m.id !== targetId));

    try {
      const res = await fetch(`/api/chats/${activeChat.id}/messages/${targetId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete message from database");
      }
    } catch (err) {
      console.error("Delete message error", err);
      alert("Failed to delete message: " + err.message);
      fetchChatMessages(activeChat.id);
    } finally {
      setIsDeletingMessage(false);
      setMessageToDelete(null);
    }
  };

  const [isBatchSelectMessages, setIsBatchSelectMessages] = useState(false);
  const [selectedMsgIds, setSelectedMsgIds] = useState(new Set());
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);

  const toggleSelectMessage = (msgId) => {
    setSelectedMsgIds((prev) => {
      const next = new Set(prev);
      if (next.has(msgId)) {
        next.delete(msgId);
      } else {
        next.add(msgId);
      }
      return next;
    });
  };

  const toggleSelectAllMessages = () => {
    if (selectedMsgIds.size === messages.length) {
      setSelectedMsgIds(new Set());
    } else {
      setSelectedMsgIds(new Set(messages.map((m) => m.id)));
    }
  };

  const handleConfirmBatchDeleteMessages = async () => {
    if (selectedMsgIds.size === 0 || !activeChat) return;
    const idsToDelete = Array.from(selectedMsgIds);
    setIsDeletingMessage(true);

    // Optimistically update UI
    setMessages((prev) => prev.filter((m) => !selectedMsgIds.has(m.id)));

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/chats/${activeChat.id}/messages/${id}`, {
            method: "DELETE",
          })
        )
      );
    } catch (err) {
      console.error("Batch delete messages error", err);
      alert("Failed to delete messages: " + err.message);
      fetchChatMessages(activeChat.id);
    } finally {
      setIsDeletingMessage(false);
      setShowBatchDeleteModal(false);
      setSelectedMsgIds(new Set());
      setIsBatchSelectMessages(false);
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
      }
    } catch (err) {
      alert("Failed to update session details: " + err.message);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-transparent relative overflow-hidden my-auto select-none">
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

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 text-center">
          Where should we start?
        </h2>
        <p className="text-neutral-400 max-w-md text-sm mb-6 text-center">
          Create a multi-character roleplay session to chat with multiple AI personas in a single response.
        </p>

        <button
          onClick={onOpenNewModal}
          className="mx-auto px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Character Chat</span>
        </button>
      </div>
    );
  }

  const sessionChars = activeChat.sessionCharacters || charactersEdit || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent text-neutral-100 overflow-hidden relative">

      {/* Top Multi-Character Session Bar (Solid Fixed Header) */}
      <div className="solid-fixed-header h-14 border-b border-neutral-800 px-3 md:px-6 flex items-center justify-between bg-neutral-950 select-none shadow-md">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 items-center justify-center text-blue-400 font-bold text-xs shrink-0">
            <Users className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="font-semibold text-xs md:text-sm text-white truncate max-w-[140px] sm:max-w-xs">
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
          {/* Mobile Model Selector (Visible only on Mobile < sm) */}
          <div ref={mobileModelDropdownRef} className="relative sm:hidden">
            <Tooltip content="Select AI Model" position="bottom" badgeIcon="✨">
              <button
                type="button"
                onClick={() => setShowMobileModelDropdown(!showMobileModelDropdown)}
                className="px-2 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-200 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-blue-400 shrink-0 animate-pulse" />
                <span className="truncate max-w-[80px]">
                  {activeChat?.selectedModel === "gemini-3.1-flash-lite" ? "3.1 Flash" : "3.5 Flash"}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
              </button>
            </Tooltip>

            {/* Dropdown Menu */}
            {showMobileModelDropdown && (
              <div className="absolute right-0 top-8 z-50 w-52 bg-neutral-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2 shadow-2xl ring-1 ring-white/10 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase text-purple-400 font-bold border-b border-neutral-800 mb-1">
                  Select AI Model
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleModelChangeInChat("gemini-3.5-flash-lite");
                    setShowMobileModelDropdown(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeChat?.selectedModel === "gemini-3.5-flash-lite" || !activeChat?.selectedModel
                      ? "bg-purple-950/80 border border-purple-800/80 text-purple-300 font-semibold"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>3.5 Flash Lite</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 ml-5">Recommended • Fast</span>
                  </div>
                  {(activeChat?.selectedModel === "gemini-3.5-flash-lite" || !activeChat?.selectedModel) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleModelChangeInChat("gemini-3.1-flash-lite");
                    setShowMobileModelDropdown(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    activeChat?.selectedModel === "gemini-3.1-flash-lite"
                      ? "bg-purple-950/80 border border-purple-800/80 text-purple-300 font-semibold"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>3.1 Flash Lite</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 ml-5">Legacy Engine</span>
                  </div>
                  {activeChat?.selectedModel === "gemini-3.1-flash-lite" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  )}
                </button>
              </div>
            )}
          </div>

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

          {/* Response Length Dropdown Selector (Hidden on mobile < md, visible on md+) */}
          <div ref={lengthDropdownRef} className="relative hidden md:block">
            <Tooltip content="Select AI Response Length" position="bottom" badgeIcon="💬">
              <button
                type="button"
                onClick={() => setShowLengthDropdown(!showLengthDropdown)}
                className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 capitalize"
              >
                <span className="text-purple-400">
                  {responseLength === "veryshort" ? "⚡" : responseLength === "short" ? "⚡" : responseLength === "normal" ? "💬" : "📖"}
                </span>
                <span>
                  {responseLength === "veryshort" ? "V.Short" : responseLength === "short" ? "Short" : responseLength === "normal" ? "Normal" : "Detailed"}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>
            </Tooltip>

            {/* Dropdown Menu */}
            {showLengthDropdown && (
              <div className="absolute right-0 top-9 z-50 w-44 bg-neutral-900/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/10 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-xs">
                {[
                  { id: "veryshort", label: "V.Short", desc: "1 short sentence", icon: "⚡" },
                  { id: "short", label: "Short", desc: "1-2 sentences", icon: "⚡" },
                  { id: "normal", label: "Normal", desc: "Balanced length", icon: "💬" },
                  { id: "detailed", label: "Detailed", desc: "Rich scene & actions", icon: "📖" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      handleSetResponseLength(item.id);
                      setShowLengthDropdown(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-colors cursor-pointer ${responseLength === item.id
                        ? "bg-purple-950/80 border border-purple-800/80 text-purple-300 font-semibold"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {responseLength === item.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </button>
                ))}
              </div>
            )}
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

          {/* Select Messages Batch Button (Desktop Only - Mobile uses Long Press) */}
          {messages.length > 0 && (
            <Tooltip content="Select multiple messages for fast bulk deletion" position="bottom" badgeIcon="☑️">
              <button
                onClick={() => {
                  setIsBatchSelectMessages(!isBatchSelectMessages);
                  setSelectedMsgIds(new Set());
                }}
                className={`hidden sm:flex px-2.5 py-1 rounded-full items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer ${isBatchSelectMessages
                  ? "bg-purple-600 text-white border border-purple-400 shadow-md"
                  : "bg-neutral-900 border border-neutral-800 text-purple-300 hover:text-white hover:bg-neutral-800"
                  }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{isBatchSelectMessages ? "Done" : "Select Messages"}</span>
              </button>
            </Tooltip>
          )}

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
      <div
        ref={chatContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 strict-scroll-stream min-h-0 p-4 md:p-8 space-y-6 relative"
      >
        {fetchingMessages && messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center my-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
            <span className="text-xs font-semibold text-neutral-400">Loading session messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="min-h-[55vh] flex flex-col items-center justify-center text-center my-auto py-6 select-none">
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
            <h1 className="text-3xl font-extrabold text-white mb-2 text-center">
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
            {/* Batch Messages Floating Action Bar */}
            {isBatchSelectMessages && (
              <div className="sticky top-2 z-30 max-w-3xl mx-auto my-2 p-2 px-3 sm:px-4 rounded-2xl bg-purple-950/95 border border-purple-700/80 backdrop-blur-md shadow-2xl flex items-center justify-between gap-1.5 sm:gap-3 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={toggleSelectAllMessages}
                    className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="hidden sm:inline">
                      {selectedMsgIds.size === messages.length ? "Deselect All" : "Select All"}
                    </span>
                    <span className="sm:hidden">
                      {selectedMsgIds.size === messages.length ? "None" : "All"}
                    </span>
                  </button>
                  <span className="text-[11px] text-purple-300/80 font-mono shrink-0">
                    <span className="hidden sm:inline">({selectedMsgIds.size} of {messages.length} selected)</span>
                    <span className="sm:hidden">({selectedMsgIds.size})</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={selectedMsgIds.size === 0}
                    onClick={() => setShowBatchDeleteModal(true)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">Delete Selected ({selectedMsgIds.size})</span>
                    <span className="sm:hidden">Delete ({selectedMsgIds.size})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBatchSelectMessages(false);
                      setSelectedMsgIds(new Set());
                    }}
                    className="px-2 sm:px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <span className="hidden sm:inline">Cancel</span>
                    <span className="sm:hidden">✕</span>
                  </button>
                </div>
              </div>
            )}

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
                  onRequestDelete={(m) => setMessageToDelete(m)}
                  isBatchMode={isBatchSelectMessages}
                  isSelected={selectedMsgIds.has(msg.id)}
                  onToggleSelect={toggleSelectMessage}
                  onLongPressSelect={(msgId) => {
                    setIsBatchSelectMessages(true);
                    setSelectedMsgIds((prev) => {
                      const next = new Set(prev);
                      next.add(msgId);
                      return next;
                    });
                  }}
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

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-purple-300 font-bold tracking-wide font-mono">
                  {typingCharacter === "Thinking who speaks..." ? "Selecting next speaker..." : `${typingCharacter} is typing...`}
                </span>
                {isQueuedNotice && (
                  <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1 animate-pulse">
                    <span>⏳</span>
                    <span>Wait a min due to high demand your request is in queue...</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button */}
      {showScrollBottomBtn && (
        <div className="flex justify-center -mb-2 z-20">
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700 text-neutral-300 text-xs font-semibold hover:text-white hover:bg-neutral-800 shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Scroll to bottom</span>
          </button>
        </div>
      )}

      {/* Solid Fixed Bottom Input Capsule Bar Container */}
      <div className="solid-fixed-footer border-t border-neutral-800/80 p-3 md:px-8 w-full bg-neutral-950">
        <div className="max-w-4xl mx-auto w-full">
          <div
            className="relative bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-2 px-3.5 shadow-2xl flex items-end gap-2.5 focus-within:border-neutral-700 transition-all"
          >
            {/* Quick Snippets & Instant Paste Button + Popover Menu */}
            <div ref={snippetsMenuRef} className="relative shrink-0 self-center">
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
                title="Instant Paste Snippets & Menu"
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
                      className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preset Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handlePresetAction("story")}
                      className="flex items-center gap-2 p-2 rounded-xl bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/60 text-purple-300 text-xs font-semibold transition-all text-left"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Auto Story Prompt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetAction("drama")}
                      className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold transition-all text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Dramatic Twist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetAction("continue")}
                      className="flex items-center gap-2 p-2 rounded-xl bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/60 text-blue-300 text-xs font-semibold transition-all text-left"
                    >
                      <CornerDownLeft className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Continue Scene</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetAction("group")}
                      className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold transition-all text-left"
                    >
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Group Debate</span>
                    </button>
                  </div>

                  {/* Quick Character Speaker Chips */}
                  {sessionChars && sessionChars.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                        Speaker Tag Chips
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionChars.map((char) => {
                          const styleClass = getCharStyle(char.name);
                          return (
                            <button
                              key={char.id || char.name}
                              type="button"
                              onClick={() => handleInsertSnippet(`[${char.name}]: `)}
                              className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 capitalize ${styleClass}`}
                              title={`Insert [${char.name}]: into prompt`}
                            >
                              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                              <span>{char.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Snippets Header */}
                  <div className="flex items-center justify-between py-1 mb-2">
                    <span className="text-xs font-semibold text-neutral-400">My Saved Phrases</span>
                    <button
                      type="button"
                      onClick={() => setShowAddSnippetInput(!showAddSnippetInput)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showAddSnippetInput ? "Cancel" : "Add Custom"}</span>
                    </button>
                  </div>

                  {/* Snippets List Scroll Container */}
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {/* Add Custom Snippet Inline Control */}
                    {showAddSnippetInput && (
                      <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl mb-2">
                        <input
                          type="text"
                          tabIndex={-1}
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
              placeholder={`Speak to ${sessionChars.map((c) => c.name).join(", ")}...`}
              className="flex-1 bg-transparent text-base sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none max-h-40 min-h-[42px] py-2 leading-relaxed touch-manipulation cursor-text"
              enterKeyHint="send"
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
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!inputPrompt.trim() || loading}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

          </div>
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

      {/* Delete Message Confirmation Modal Dialog */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-1">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Message?</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to delete this message? This action will permanently remove it from your chat history and database.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingMessage}
                onClick={handleConfirmDeleteMessage}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50"
              >
                {isDeletingMessage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Batch Messages Delete Confirmation Modal */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-1">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete {selectedMsgIds.size} Messages?</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Are you sure you want to delete these {selectedMsgIds.size} selected messages? They will be permanently removed from your chat history and database.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingMessage}
                onClick={handleConfirmBatchDeleteMessages}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer disabled:opacity-50"
              >
                {isDeletingMessage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Delete Selected</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
