/**
 * Global Tooltip & UI Translation Dictionary (English <-> Hinglish)
 */
export const translations = {
  // Sidebar & Header Tooltips
  "Toggle Drawer Menu": "Sidebar menu kholo/band karo",
  "New Chat Session": "Nayi chat shuru karo",
  "Create Multi-Character Session": "Nayi multi-character roleplay session banao",
  "Sign Out Account": "Account se log out karo",
  "Settings & Account": "Settings aur password badlo",

  // Chat Header Tooltips
  "Edit Scenario & Personas": "Scenario aur character persona edit karo",
  "Gemini decides speaker turns dynamically": "Gemini khud decide karega kab kaun bolega",
  "Generates all character responses in 1 block": "Sabhi characters ka response ek saath aayega",
  "Strictly 1 short sentence per character": "Har character ka sirf 1 chhota sentence",
  "Concise 1-2 sentences per character": "Har character ke 1-2 chhote sentences",
  "Balanced natural roleplay length": "Normal aur natural roleplay dialogue",
  "Immersive rich dialogue & actions": "Detail me lambe dialogues aur actions",
  "Token Capacity & Memory Status": "Memory capacity aur token usage dekho",
  "Delete Chat Session": "Ye chat session delete karo",

  // Chat Input Tooltips
  "Speech Voice Input": "Bol kar message type karo (Voice input)",
  "Send Message (Enter)": "Message bhejo (Enter dabayein)",
};

/**
 * Translates a tooltip or UI text to the active target language.
 * Falls back to the original text if language is 'en' or translation is missing.
 */
export function translateTooltip(text, lang = "en") {
  if (!text || lang === "en") return text;
  if (lang === "hinglish" && translations[text]) {
    return translations[text];
  }
  return text;
}
