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
  "NEXTAICHAT": "NEXTAICHAT",
  "ROLEPLAY": "ROLEPLAY",
  "Unlimited Personas": "Unlimited Personas",
  "CHAT WITH AI BESTIES, STUDY TUTORS & PLAY FUN GAMES ANYTIME!": "AI BESTIES, STUDY TUTORS SE CHAT KARO AUR FUN GAMES KHELO APNE HISAAB SE!",
  "✨ Simple • Fun • Private • Instant": "✨ Aasaan • Mazedar • Private • Instant",
  "START ROLEPLAY NOW": "CHAT SHURU KARO NOW",
  "Explore 34+ Avatars": "34+ Avatars Explore Karo",
  "FEATURED PERSONAS REEL": "POPULAR PERSONAS SHOWCASE",
  "Click any persona card to launch spotlight": "Kisi bhi persona card par click karke dekho",
  "Select →": "Select Karo →",
  "Select &rarr;": "Select Karo &rarr;",
  "✦ ACTIVE": "✦ ACTIVE",
  "✦ ACTIVE SPOTLIGHT": "✦ ACTIVE SPOTLIGHT",

  // WhatWeOffer Section
  "WHAT YOU CAN DO": "AAP KYA KYA KAR SAKTE HAIN",
  "Explore 34+ AI Characters": "34+ AI Characters Explore Karo",
  "AI STUDY TUTORS": "AI STUDY TUTORS",
  "Oral Exam & Physics Prep": "Exam & Physics Ki Taiyari",
  "COLLEGE & SQUADS": "COLLEGE & SQUADS",
  "Group Banter & Gossip": "College Masti & Daily Gossip",
  "ROLEPLAY GAMES": "ROLEPLAY GAMES",
  "Escape Rooms & Quests": "Escape Rooms & Thriller Quests",
  "MENTORS & COACHES": "MENTORS & COACHES",
  "Career & Mindset Guidance": "Career & Job Advice",
  "Launch Module": "Module Kholo",
  "Explore All 34+ Avatars": "Sabhi 34+ Avatars Dekho",

  // ToolkitProcessCta Section
  "WHY YOU'LL LOVE IT": "AAPKO KYUN PASAND AAYEGA",
  "HOW IT WORKS": "KAISE KAAM KARTA HAI",
  "Smart AI": "Smart AI",
  "Instant Chat": "Bina Delay ke Chat",
  "Remembers You": "Baatein Yaad Rakhega",
  "100% Private": "100% Private & Safe",
  "Group Chats": "Group Chat Option",
  "34+ Characters": "34+ Characters",
  "Natural Talking": "Bilkul Real Baat",
  "Always Online": "24/7 Available",
  "PLATFORM STATUS: ONLINE & READY 24/7": "SYSTEM STATUS: ALWAYS ONLINE & READY 24/7",
  "SIMPLE • FAST • PRIVATE": "AASAAN • FAST • PRIVATE",
  "START ROLEPLAY": "CHAT SHURU KARO",
  "LET'S CHAT WITH AI TOGETHER ✦": "AAYO AI SE CHAT KAREIN ✦",
  "GET STARTED FREE": "ABHI FREE ME SHURU KARO",
  "PICK CHARACTER": "CHARACTER CHUNO",
  "SET PREFERENCE": "PREFERENCE SET KARO",
  "START CHATTING": "CHAT SHURU KARO",
  "LEARN & ENJOY": "PADHO AUR MAZE KARO",
  "Pick any character — study tutor, college bestie, or fun game.": "Koi bhi character chuno — study tutor, college bestie ya fun game.",
  "Choose your favorite chat style, language, or topic.": "Apna favorite chat style, bhasha ya topic chuno.",
  "Start talking instantly with zero waiting time.": "Bina kisi waiting time ke turant chat shuru karo.",
  "Solve physics problems, gossip, or play story games.": "Physics problem solve karo, gossip karo ya story games khelo.",

  // InteractiveDemo Section
  "SMART & FRIENDLY AI": "SMART AUR FRIENDLY AI",
  "Smart AI That Learns & Remembers Your Stories.": "Smart AI Jo Aapki Har Baat Yaad Rakhta Hai.",
  "NextAiChat gives you friendly AI companions that remember past chats, explain tough study topics step-by-step, and gossip like real best friends.": "NextAiChat aapko aise AI companions deta hai jo aapki purani baatein yaad rakhte hain, padhai ke tough topics aasaan bhasha me samjhaate hain, aur besties ki tarah gossip karte hain.",
  "Remembers Your Stories & Mood": "Aapke Mood aur Stories Yaad Rakhta Hai",
  "AI characters remember past chats and adapt to how you like to talk.": "AI characters aapki purani chats yaad rakhte hain aur waise hi response dete hain.",
  "Group Chats & Squad Banter": "Group Chats aur Squad Masti",
  "Chat with entire groups at once — campus friends, study squads, or party girls.": "Ek sath poore group se chat karein — campus friends, study buddies ya party squad.",
  "Instant, Super-Fast Replies": "Fast aur Instant Responses",
  "No waiting in long queues. Get immediate responses anytime day or night.": "Bina kisi waiting queue ke turant fast responses paayein kabhi bhi.",
  "100% Private & Safe": "100% Private aur Safe",
  "Your chats are strictly private and stored securely.": "Aapki chats bilkul private aur safe rehti hain.",
  "Try Interactive Demo": "Live Demo Try Karo",

  // QuoteStats Section
  "Talk, learn, and play with AI companions that listen, remember your stories, and chat just like real friends.": "Aise AI companions se baat karein, padhein aur khelne jo aapki baatein sunte hain, yaad rakhte hain aur real dost ki tarah chat karte hain.",
  "NEXTAICHAT ROLEPLAY PLATFORM": "NEXTAICHAT ROLEPLAY PLATFORM",
  "Unique AI Avatars & Games": "Unique AI Avatars & Games",
  "Roleplay Messages Generated": "Total Messages Generated",
  "Total Roleplays Started": "Total Roleplays Started",

  // CalloutBanner Section
  "Together, let's explore unlimited AI personas & stories.": "Aao milkar 34+ AI personas aur stories explore karein.",
  "Join NextAiChat today and get instant access to 34+ pre-configured AI tutors, besties, squads, and interactive games.": "Aaj hi NextAiChat join karein aur instant access paayein AI tutors, besties, squads aur games ka.",
  "Join AI Roleplay Today": "Aaj Hi AI Chat Shuru Karo",
  "Trusted by": "Trusted by"
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
