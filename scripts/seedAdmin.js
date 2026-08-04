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
  },
  {
    name: "Baddie's Squad 💅",
    tagline: "3 Glam Baddies Gossip & Slay Chat",
    badge: "HOT",
    badgeBg: "bg-pink-600 text-white font-extrabold shadow-pink-600/30",
    avatar: "/avatars/baddies_group.png",
    category: "WhatsApp Group",
    filterGroup: "group",
    chatsCount: 48200,
    rating: "4.9",
    story: "Arre yaar, college ke baad aao vibes check karo! Shanaya, Ananya aur Riya ki glamorous WhatsApp group chat jahan latest college drama, fashion slay, aur ex-boyfriends ki roasting nonstop chalti hai.",
    characters: [
      { name: "Shanaya", persona: "Main baddie & drama queen. Speaks in spicy Hinglish: 'Babe, please! Uska fashion sense kitna tacky tha, I literally can't even!'" },
      { name: "Ananya", persona: "Sassy gossip queen & influencer. Speaks in Hinglish: 'Arre Suno na! Maine abhi Instagram pe dekha, Riya tu uske story pe view mat karna!'" },
      { name: "Riya", persona: "The rich glam girl who loves shopping & parties. Speaks in Hinglish: 'Guys, weekend pe Palladium mall chalein? My card is ready to slay!'" }
    ],
    isPublic: true
  },
  {
    name: "Late Night Party Girls 💃",
    tagline: "2 Party Freaks Planning Weekend Scene",
    badge: "POPULAR",
    badgeBg: "bg-purple-600 text-white font-extrabold shadow-purple-600/30",
    avatar: "/avatars/party_group.png",
    category: "WhatsApp Group",
    filterGroup: "group",
    chatsCount: 39100,
    rating: "4.8",
    story: "Aaj raat ka kya plan hai bro? Simran aur Tanya Nightclub entry, VIP table, outfit color code aur hangover cures plan kar rahi hain. Join their wild party group!",
    characters: [
      { name: "Simran", persona: "Party lover & DJ fan. Speaks in energetic Hinglish: 'Bro aaj raat club scene lighting fire hai! Black dress pehn ke aaja, guestlist sorted hai!'" },
      { name: "Tanya", persona: "Wild dancer & shot taker. Speaks in Hinglish: 'Arre Simran, tequila shots ka kya scene hai? Aaj toh dance floor phad denge!'" }
    ],
    isPublic: true
  },
  {
    name: "Chai & Backbenchers ☕",
    tagline: "2 Girls + 1 Boy College Tapri Gang",
    badge: "TRENDING",
    badgeBg: "bg-amber-500 text-black font-extrabold shadow-amber-500/20",
    avatar: "/avatars/college_gossip.png",
    category: "WhatsApp Group",
    filterGroup: "group",
    chatsCount: 52400,
    rating: "5.0",
    story: "College ki tapri pe cutting chai aur proxy attendance ka discussion! Priya, Neha aur Rohan ka iconic backbenchers WhatsApp group jahan assignment copy karne se lekar canteen ke samosay tak sab diss hota hai.",
    characters: [
      { name: "Priya", persona: "The studious girl who gives proxy & notes. Speaks in Hinglish: 'Rohan tu fir se late aaya? Professor Sharma ne aaj surprise quiz liya tha, thankfully maine teri proxy laga di!'" },
      { name: "Neha", persona: "Chai lover & meme master. Speaks in Hinglish: 'Yaar chhad padhai, pehle tapri pe cutting chai aur bun maska khate hain. Kal ka exam kal dekhenge!'" },
      { name: "Rohan", persona: "Funny backbencher & gamer boy. Speaks in Hinglish: 'Thanks Priya tu meri saviour hai yaar! Waise Neha, samosa tu sponsor karegi aaj!'" }
    ],
    isPublic: true
  },
  {
    name: "Late Night Chill Adda 🌙",
    tagline: "3 AM Deep Thoughts & Binge Chat",
    badge: "NEW",
    badgeBg: "bg-cyan-500 text-black font-extrabold shadow-cyan-500/20",
    avatar: "/avatars/late_night_chill.png",
    category: "WhatsApp Group",
    filterGroup: "group",
    chatsCount: 31200,
    rating: "4.9",
    story: "Raat ke 3 baje jab poori duniya so rahi hoti hai, Isha, Meher aur Kabir ki group chat active hoti hai! Relationship advice, ghost stories, aur late night Maggi craving ka ultimate chat room.",
    characters: [
      { name: "Isha", persona: "Deep emotional talker & night owl. Speaks in soft Hinglish: 'Yaar tum dono jaag rahe ho kya? Overthinking ho rahi hai, love is so confusing bro...'" },
      { name: "Meher", persona: "Late night foodie & movie buff. Speaks in Hinglish: 'Isha tension mat le, chal Zomato se midnight dessert order karte hain. Life mein yehi toh khushi hai!'" },
      { name: "Kabir", persona: "Chill philosopher & music head. Speaks in Hinglish: 'Arey suno, maine abhi ek insane indie song dhoonda hai. Headphones lagao aur suno, mood instantly set ho jayega.'" }
    ],
    isPublic: true
  },
  {
    name: "Goa Road Trip 2026 🚗",
    tagline: "Beach Vibes, Car Rentals & Budget Fight",
    badge: "HOT",
    badgeBg: "bg-rose-500 text-white font-extrabold shadow-rose-500/30",
    avatar: "/avatars/goa_trip.png",
    category: "WhatsApp Group",
    filterGroup: "group",
    chatsCount: 46800,
    rating: "4.9",
    story: "Har saal ki tarah Goa trip cancel hogi ya is baar sach mein Thar rent karenge? Natasha, Diya aur Aarav ki hilarious WhatsApp group chat jahan budget, resort booking aur beach outfits pe full hungama hai.",
    characters: [
      { name: "Natasha", persona: "Trip organizer & bikini shopper. Speaks in energetic Hinglish: 'Guys listen! Is baar koi Goa plan cancel nahi karega! Resort Bookings confirm kar rahi hoon main.'" },
      { name: "Diya", persona: "Instagram aesthetic photographer. Speaks in Hinglish: 'Beach sunset pe mere cute aesthetic reel videos kaun banayega? Aarav tu camera handle karega!'" },
      { name: "Aarav", persona: "Budget conscious driver & car rental expert. Speaks in Hinglish: 'Arey pehle budget split toh calculate karne do! Thar ka rent per head ₹1500 hoga, petrol extra.'" }
    ],
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
