import prisma from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import HomeClient from "@/components/HomeClient";

// 60-second Incremental Static Regeneration (ISR) for super-fast SSR load + top-tier SEO
export const revalidate = 60;

export const metadata = {
  title: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
  description:
    "NextAiChat is the premier AI Roleplay platform designed for interactive study simulations, exam prep tutors, language practice, and multi-character storytelling with dynamic speaker turns.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let blogs = [];
  let characters = [];
  let pageStats = {
    totalChats: 0,
    totalCharacters: 0,
    totalMessages: 0,
    totalUsers: 0,
  };

  try {
    const [blogRes, charRes, sessionGroupRes, sessionCountRes, messageCountRes, userCountRes, charCountRes, charSumRes] =
      await Promise.allSettled([
        prisma.blogPost.findMany({
          where: { published: true },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            category: true,
            readTime: true,
            createdAt: true,
          },
        }),
        prisma.discoverCharacter.findMany({
          where: { isPublic: true },
          orderBy: { chatsCount: "desc" },
          select: {
            id: true,
            name: true,
            tagline: true,
            category: true,
            avatar: true,
            chatsCount: true,
            rating: true,
            story: true,
            badge: true,
            filterGroup: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.chatSession.groupBy({
          by: ["discoverCharacterId"],
          _count: { id: true },
        }),
        prisma.chatSession.count(),
        prisma.chatMessage.count(),
        prisma.user.count(),
        prisma.discoverCharacter.count({ where: { isPublic: true } }),
        prisma.discoverCharacter.aggregate({
          _sum: { chatsCount: true },
        }),
      ]);

    if (blogRes.status === "fulfilled" && blogRes.value) {
      blogs = blogRes.value.map((post) => ({
        ...post,
        createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
      }));
    }

    if (charRes.status === "fulfilled" && charRes.value) {
      const rawChars = charRes.value;
      const sessionCountMap = {};

      if (sessionGroupRes.status === "fulfilled" && Array.isArray(sessionGroupRes.value)) {
        sessionGroupRes.value.forEach((item) => {
          if (item.discoverCharacterId) {
            sessionCountMap[item.discoverCharacterId] = item._count.id;
          }
        });
      }

      characters = rawChars.map((c) => ({
        ...c,
        chatsCount: sessionCountMap[c.id] !== undefined ? sessionCountMap[c.id] : c.chatsCount || 0,
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : new Date().toISOString(),
      }));
    }

    const sessionCount = sessionCountRes.status === "fulfilled" ? sessionCountRes.value : 0;
    const messageCount = messageCountRes.status === "fulfilled" ? messageCountRes.value : 0;
    const userCount = userCountRes.status === "fulfilled" ? userCountRes.value : 0;
    const charCount = charCountRes.status === "fulfilled" ? charCountRes.value : characters.length;
    const baseChatsSum =
      charSumRes.status === "fulfilled" && charSumRes.value?._sum?.chatsCount
        ? charSumRes.value._sum.chatsCount
        : 0;

    pageStats = {
      totalChats: sessionCount > 0 ? sessionCount : baseChatsSum,
      totalCharacters: charCount,
      totalMessages: messageCount,
      totalUsers: userCount,
    };
  } catch (e) {
    console.error("Home page parallel fetch error:", e);
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is NextAiChat?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat is an advanced AI roleplay platform engineered specifically for interactive study simulations, exam prep tutoring, foreign language practice, and multi-character storytelling with automated turn management.",
        },
      },
      {
        "@type": "Question",
        name: "How does NextAiChat compare to Character.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat features a Dynamic Speaker Turn Engine powered by Advanced AI, zero latency, dedicated study personas, private sessions, custom snippet libraries, and 1-click memory inclusion toggles.",
        },
      },
      {
        "@type": "Question",
        name: "Can I prep for exams or practice languages here?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! NextAiChat includes pre-configured AI tutors for oral exam simulations (Physics, Chemistry, Law), IELTS/TOEFL speaking test evaluators, and multi-speaker debate rooms.",
        },
      },
      {
        "@type": "Question",
        name: "Are my chat sessions private and secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. All chat sessions are completely private and stored securely. Your roleplay data is never used to train public models without permission.",
        },
      },
    ],
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online";

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient blogs={blogs} characters={characters} stats={pageStats} appUrl={appUrl} />
    </>
  );
}
