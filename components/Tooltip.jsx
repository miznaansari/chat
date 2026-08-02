"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Custom GenZ AI Glassmorphic Tooltip Component
 * Displays a glowing neon glass badge on hover with customizable text and positioning.
 */
export default function Tooltip({
  content,
  children,
  position = "top", // "top" | "bottom" | "left" | "right"
  badgeIcon = "✨",
  delay = 150,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const { translate } = useLanguage();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const translatedContent = translate ? translate(content) : content;

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >

      {children}

      {isVisible && content && (
        <div
          className={`absolute ${positionClasses[position] || positionClasses.top} z-[99999] pointer-events-none animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="bg-neutral-950/90 border border-purple-500/40 rounded-xl px-3 py-1.5 shadow-[0_0_25px_rgba(147,51,234,0.3)] backdrop-blur-xl flex items-center gap-1.5 text-xs text-neutral-100 font-medium tracking-wide whitespace-nowrap">
            {badgeIcon && <span className="text-xs">{badgeIcon}</span>}
            <span>{translatedContent}</span>
          </div>
        </div>
      )}
    </div>
  );
}
