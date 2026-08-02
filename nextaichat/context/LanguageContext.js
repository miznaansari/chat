"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translate } from "@/lib/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("nextaichat_lang");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hinglish" : "en";
    setLanguage(newLang);
    localStorage.setItem("nextaichat_lang", newLang);
  };

  const t = (text) => translate(text, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (text) => text,
    };
  }
  return context;
}
