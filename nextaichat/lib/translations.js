/**
 * Global Landing Page UI Translation Dictionary (English <-> Hinglish)
 */
export const landingTranslations = {
  // Navbar
  "Home": "Home",
  "Compare (vs Character.ai)": "vs Character.ai",
  "Blog": "Blog",
  "Launch App": "App Kholo",

  // Hero Section
  "The #1 AI Roleplay Engine • Built Different": "No.1 AI Roleplay Engine • Bilkul Alag",
  "AI Roleplay for": "AI Roleplay for",
  "Study & Stories": "Padhai aur Stories",
  "Zero-latency AI tutors for exam prep, language practice & multi-character storytelling.": "Zero delay AI tutors exam prep, bhasha seekhne aur multi-character kahaniyo ke liye.",
  "Launch App Free": "App Kholo (Free)",

  // Advantage Cards
  "Auto Speaker Engine": "Auto Speaker Engine",
  "AI automatically manages turn-taking & complete speaker thoughts dynamically in multi-character rooms.": "Character tab tak bolega jab tak usko apni baat complete na karni ho. AI auto handle karega next kaun bolega.",
  "Custom Response Length": "Chat Length Control",
  "Set exact response length: Very Short, Short, Normal, or Detailed for fast quizzes vs story immersion.": "Chat response length khud decide kar sakte hain: Very Short, Short, Normal ya Detailed dialogues.",
  "Rephrase & Polish Magic": "Rephrase & Magic Option",
  "Rephrase, polish grammar, or enhance character prompts in 1-click to transform your roleplay experience.": "Reuse & Rephrase option se 1-click me prompts polish karein jo aapka poora chat experience change kar dega.",
  "Multi-Character Rooms": "Multiple Character Handling",
  "Run complex multi-character study groups & RPG dialogue worlds with zero speaker confusion.": "Ek sath multiple characters ko bina kisi speaker confusion ke smooth handle karein.",
  "Smart Context Exclude": "Smart Context Control",
  "1-click to toggle which message is included in active memory. Exclude wrong responses instantly to keep AI memory pristine.": "1-click me decide karein kaun sa message context memory me include hoga. Agar AI galat response de, use 1-click me exclude karke memory clean rakhein.",

  // Showcase Section
  "Experience NextAiChat Workspace": "NextAiChat Live Workspace",
  "Interactive AI tutors, language coaches, and multi-character story rooms powered by Gemini.": "Interactive AI tutors, language coaches aur multi-character story rooms Gemini Flash se powered.",
  "Built for": "Bana hai",
  "Study & Exam Tutors": "Padhai aur Exam Tutors",
  "AI tutors for exam prep, quizzes, formulas & foreign language practice.": "Exam prep, oral quizzes, formulas aur foreign language practice ke liye AI tutors.",
  "Engage multiple active AI personas together in a single dynamic room.": "Ek hi room me ek se zyada AI personas ko ek sath interact karayein.",
  "Smart Turn Engine": "Smart Turn Engine",
  "Gemini AI determines the optimal speaker turn automatically in real time.": "Gemini AI real-time me auto decide karega next kis character ki turn hai.",
  
  // Personas
  "Active": "Popular",
  "Roleplay Personas": "Roleplay Personas",
  "All Personas": "Sabhi Personas",
  "Start Chat": "Chat Shuru Karo",

  // Compare & Blog
  "NextAiChat vs Character.ai": "NextAiChat vs Character.ai",
  "Dynamic turn engine vs manual 1-by-1 prompts.": "Dynamic turn engine vs purana manual 1-by-1 prompt system.",
  "View Comparison": "Comparison Dekho",
  "Latest": "Taza",
  "Guides": "Guides aur Articles",
  "All Articles": "Sabhi Articles",
  "Read": "Padhein",

  // Footer
  "The #1 AI Roleplay Matrix engine designed for study prep, educational tutors, creative worldbuilding, and multi-character storytelling.": "No.1 AI Roleplay Engine jo padhai, exam tutors, creative worldbuilding aur multi-character kahaniyo ke liye design kiya gaya hai.",
  "AI CORE STATUS: NOMINAL": "AI ENGINE: BILKUL MAST",
  "Explore Matrix": "Explore Matrix",
  "Home Matrix": "Home Page",
  "NextAiChat vs Character.ai": "NextAiChat vs Character.ai",
  "Blog Insights & Guides": "Blog Guides",
  "Console & App": "App Console",
  "Launch Roleplay Engine": "Roleplay Engine Launch",
  "Privacy & Protocol": "Privacy & Rules",
  "Privacy Protocol": "Privacy Policy",
  "Terms of Service": "Terms of Service"
};

/**
 * Translates a text string if active language is 'hinglish'
 */
export function translate(text, lang = "en") {
  if (!text || lang === "en") return text;
  if (lang === "hinglish" && landingTranslations[text]) {
    return landingTranslations[text];
  }
  return text;
}
