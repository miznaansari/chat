import prisma from "@/lib/prisma";
import JsonLd from "@/components/JsonLd";
import HomeClient from "@/components/HomeClient";

export const revalidate = 0;

export const metadata = {
  title: "NextAiChat - AI Roleplay Platform for Study & Entertainment",
  description:
    "NextAiChat is the premier AI Roleplay platform designed for interactive study simulations, exam prep tutors, language practice, and multi-character storytelling.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let blogs = [];
  let characters = [];

  try {
    blogs = await prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Home page blog fetch error:", e);
  }

  try {
    const rawChars = await prisma.discoverCharacter.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
    });
    
    // Serialize Prisma objects safely for Client Component
    characters = rawChars.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  } catch (e) {
    console.error("Home page character fetch error:", e);
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
          text: "NextAiChat is an advanced AI roleplay platform built for study simulations, tutors, language practice, and multi-character entertainment.",
        },
      },
      {
        "@type": "Question",
        name: "How does NextAiChat compare to Character.ai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "NextAiChat features a Dynamic Speaker Turn Engine powered by Gemini AI, zero latency, dedicated study personas, private encrypted sessions, and custom snippet libraries.",
        },
      },
    ],
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online";

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient blogs={blogs} characters={characters} appUrl={appUrl} />
    </>
  );
}
