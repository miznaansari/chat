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
  try {
    blogs = await prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Home page blog fetch error:", e);
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

  const samplePersonas = [
    {
      name: "Quantum Physics Tutor",
      role: "Study & Prep",
      tag: "Education",
      desc: "Simulates oral physics exams & solves equations step-by-step.",
      badgeColor: "bg-purple-950/80 border-purple-700/60 text-purple-300",
      avatar: "⚛️",
    },
    {
      name: "IELTS Speaking Coach",
      role: "Language Practice",
      tag: "Productivity",
      desc: "Live Band 9 speaking test simulation with feedback.",
      badgeColor: "bg-cyan-950/80 border-cyan-700/60 text-cyan-300",
      avatar: "🗣️",
    },
    {
      name: "Cyberpunk RPG Director",
      role: "Multi-Persona Story",
      tag: "Entertainment",
      desc: "Drives branch story worlds with multi-character dialogues.",
      badgeColor: "bg-pink-950/80 border-pink-700/60 text-pink-300",
      avatar: "⚡",
    },
    {
      name: "Full-Stack Code Mentor",
      role: "Coding & AI",
      tag: "Developer",
      desc: "Debugs complex code & conducts technical mock interviews.",
      badgeColor: "bg-emerald-950/80 border-emerald-700/60 text-emerald-300",
      avatar: "💻",
    },
  ];

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.nextaichat.online";

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient blogs={blogs} samplePersonas={samplePersonas} appUrl={appUrl} />
    </>
  );
}
