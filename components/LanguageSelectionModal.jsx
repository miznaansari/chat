"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe, Sparkles, Check } from "lucide-react";

export default function LanguageSelectionModal() {
  const { showOnboardingModal, changeLanguage } = useLanguage();

  if (!showOnboardingModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(147,51,234,0.25)] overflow-hidden">
        {/* Glow accent background effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="relative z-10 text-center space-y-3 mb-6">
          <img
            src="/logo.png"
            alt="NextAiChat Logo"
            className="w-14 h-14 object-contain mx-auto shadow-lg drop-shadow-[0_0_15px_rgba(147,51,234,0.4)] mb-1"
          />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Welcome to NextAiChat! 🎭
          </h2>
          <p className="text-sm text-neutral-300 font-medium leading-relaxed max-w-md mx-auto">
            Aap app kis language mein continue karna chahte hain?
          </p>
          <p className="text-xs text-neutral-400">
            How would you like to use the app interface & tooltips?
          </p>
        </div>

        {/* Options Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Hinglish Option */}
          <button
            onClick={() => changeLanguage("hinglish")}
            className="group relative p-4 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-600/50 hover:border-purple-400 text-left transition-all duration-300 shadow-md hover:shadow-purple-500/20 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🇮🇳</span>
                <Sparkles className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-bold text-white text-base mb-1">
                Hinglish
              </div>
              <div className="text-xs text-purple-200/80 leading-snug">
                Hinglish mein continue karna hai (Tooltips Hinglish mein honge)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-800/40 flex items-center text-xs font-semibold text-purple-300 group-hover:text-white">
              <span>Select Hinglish</span>
              <Check className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* English Option */}
          <button
            onClick={() => changeLanguage("en")}
            className="group relative p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-left transition-all duration-300 shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🇬🇧</span>
                <Sparkles className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="font-bold text-white text-base mb-1">
                English
              </div>
              <div className="text-xs text-neutral-300 leading-snug">
                Continue in English (Standard English tooltips & interface)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center text-xs font-semibold text-neutral-300 group-hover:text-white">
              <span>Select English</span>
              <Check className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>

        {/* Footer info */}
        <p className="relative z-10 text-center text-[11px] text-neutral-400">
          ⚙️ Aap isse baad me <span className="text-neutral-300 font-semibold">Settings</span> se bhi change kar sakte hain.
        </p>
      </div>
    </div>
  );
}
