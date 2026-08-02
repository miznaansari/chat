"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translateTooltip } from "@/lib/translations";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  changeLanguage: async () => {},
  user: null,
  setUser: () => {},
  showOnboardingModal: false,
  setShowOnboardingModal: () => {},
  translate: (text) => text,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Initialize from localStorage and fetch auth user on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("app_language");
    if (savedLang && ["en", "hinglish"].includes(savedLang)) {
      setLanguage(savedLang);
    }

    async function checkUserAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            if (data.user.language) {
              setLanguage(data.user.language);
              localStorage.setItem("app_language", data.user.language);
            }
            // Check if first-time login onboarding is needed
            if (data.user.hasChosenLanguage === false) {
              setShowOnboardingModal(true);
            }
          }
        }
      } catch (err) {
        console.error("LanguageContext user fetch error:", err);
      }
    }

    checkUserAuth();
  }, []);

  const changeLanguage = async (newLang) => {
    if (!["en", "hinglish"].includes(newLang)) return;
    
    // Immediate optimistic local state update
    setLanguage(newLang);
    localStorage.setItem("app_language", newLang);
    setShowOnboardingModal(false);

    if (user) {
      setUser((prev) => (prev ? { ...prev, language: newLang, hasChosenLanguage: true } : null));
      try {
        await fetch("/api/user/language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: newLang }),
        });
      } catch (err) {
        console.error("Failed to persist language in DB:", err);
      }
    }
  };

  const translate = (text) => translateTooltip(text, language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        changeLanguage,
        user,
        setUser,
        showOnboardingModal,
        setShowOnboardingModal,
        translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
