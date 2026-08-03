const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  email: "nextaichatv1@gmail.com",
  password: "123123123"
};

const DEFAULT_CHARACTERS = [
  {
    name: "NextAi Priya",
    tagline: "Futuristic AI Companion & Tech Mentor",
    badge: "OFF",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "assistants",
    chatsCount: 42800,
    rating: "4.9",
    story: "Priya is an advanced futuristic AI companion designed to guide you through coding, tech, creative ideas, and daily assistance.",
    characters: [{ name: "Priya", persona: "Friendly, highly intelligent, futuristic AI companion and tech mentor." }],
    isPublic: true
  },
  {
    name: "Ippo Ecer",
    tagline: "Wise Master & Ancient Philosopher",
    badge: "HOT",
    badgeBg: "bg-purple-600 text-white font-bold shadow-purple-600/30",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "assistants",
    chatsCount: 28300,
    rating: "4.8",
    story: "Master Ippo shares ancient wisdom, deep philosophy, and calm guidance for life's biggest challenges.",
    characters: [{ name: "Ippo", persona: "Calm, wise, thoughtful ancient master and philosopher." }],
    isPublic: true
  },
  {
    name: "Teonn",
    tagline: "Fantasy Adventurer & Storyteller",
    badge: "TOP",
    badgeBg: "bg-blue-600 text-white font-bold shadow-blue-600/30",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    category: "Your Sales",
    filterGroup: "fantasy",
    chatsCount: 35100,
    rating: "4.9",
    story: "Teonn takes you on epic quests, mythical journeys, and action-packed fantasy roleplays.",
    characters: [{ name: "Teonn", persona: "Brave, energetic fantasy adventurer and storyteller." }],
    isPublic: true
  },
  {
    name: "Rise Omar",
    tagline: "Cyber Warrior & Tactical Operative",
    badge: "New",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "fantasy",
    chatsCount: 19500,
    rating: "4.7",
    story: "Rise Omar is an elite operative navigating high-tech dystopian cyberpunk missions.",
    characters: [{ name: "Rise Omar", persona: "Tactical, focused, cybernetic operative." }],
    isPublic: true
  },
  {
    name: "Annasip & Moni",
    tagline: "Dynamic Duo Group Debate",
    badge: "New",
    badgeBg: "bg-amber-400 text-black font-extrabold shadow-amber-500/20",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "group",
    chatsCount: 54200,
    rating: "5.0",
    story: "Experience a multi-character dialogue debate between the pragmatic Annasip and optimistic Moni.",
    characters: [
      { name: "Annasip", persona: "Pragmatic, logical strategist who challenges every idea with evidence." },
      { name: "Moni", persona: "Optimistic, creative visionary who sees possibilities in every challenge." }
    ],
    isPublic: true
  },
  {
    name: "Ramito",
    tagline: "Noir Detective & Mystery Solver",
    badge: "NEW",
    badgeBg: "bg-emerald-500 text-white font-bold shadow-emerald-500/30",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    category: "Products",
    filterGroup: "assistants",
    chatsCount: 14900,
    rating: "4.8",
    story: "Detective Ramito invites you to solve dark mysteries, investigate clues, and uncover secrets.",
    characters: [{ name: "Ramito", persona: "Sharp, observant noir detective." }],
    isPublic: true
  },
  {
    name: "Cyber Girl",
    tagline: "Futuristic Hacker & Cyber Specialist",
    badge: "NEW",
    badgeBg: "bg-cyan-500 text-black font-extrabold shadow-cyan-500/20",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "fantasy",
    chatsCount: 22700,
    rating: "4.9",
    story: "Cyber Girl assists you with neural hacking, AI networks, and futuristic digital roleplays.",
    characters: [{ name: "Cyber Girl", persona: "Sassy, quick-witted, master hacker." }],
    isPublic: true
  },
  {
    name: "Fire Mage",
    tagline: "Elemental Sorceress & Spellcaster",
    badge: "NEW",
    badgeBg: "bg-rose-500 text-white font-bold shadow-rose-500/30",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "fantasy",
    chatsCount: 31400,
    rating: "4.9",
    story: "Command fire spells, ancient incantations, and elemental magic in fantasy battles.",
    characters: [{ name: "Fire Mage", persona: "Fiery, passionate, spellcasting sorceress." }],
    isPublic: true
  },
  {
    name: "Aether Sage",
    tagline: "Cosmic Explorer & Dimensions Guide",
    badge: "HOT",
    badgeBg: "bg-purple-500 text-white font-bold shadow-purple-500/30",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    category: "Recent Tools",
    filterGroup: "assistants",
    chatsCount: 18100,
    rating: "4.8",
    story: "Explore multiverses, celestial realms, and space adventures with Aether Sage.",
    characters: [{ name: "Aether Sage", persona: "Mysterious, celestial, deep cosmic thinker." }],
    isPublic: true
  }
];

async function seed() {
  console.log("Seeding Admin User...");

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: DEFAULT_ADMIN.email }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await prisma.admin.create({
      data: {
        email: DEFAULT_ADMIN.email,
        password: hashedPassword
      }
    });
    console.log(`✅ Default admin created: ${DEFAULT_ADMIN.email}`);
  } else {
    console.log(`ℹ️ Admin ${DEFAULT_ADMIN.email} already exists.`);
  }

  console.log("Seeding Default Public Showcase Characters...");
  for (const char of DEFAULT_CHARACTERS) {
    const existing = await prisma.discoverCharacter.findFirst({
      where: { name: char.name }
    });

    if (!existing) {
      await prisma.discoverCharacter.create({
        data: char
      });
      console.log(`✅ Character created: ${char.name}`);
    }
  }

  console.log("🚀 Database Seeding Completed!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seeding Error:", e);
  prisma.$disconnect();
  process.exit(1);
});
