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
      name: "Prof. Ananya / Sarah",
      role: "Subject & Exam Prep Tutor",
      tag: "Exam Prep",
      desc: "Simulates oral exams, tests knowledge with mock questions & explains any subject step-by-step.",
      badgeColor: "bg-purple-950/90 border border-purple-700/60 text-purple-300",
      avatar: "⚛️",
    },
    {
      name: "Dr. Vikram / Marcus",
      role: "Science & Math Master",
      tag: "Problem Solver",
      desc: "Master complex formulas, competitive exam strategies, and conceptual problem-solving step-by-step.",
      badgeColor: "bg-blue-950/90 border border-blue-700/60 text-blue-300",
      avatar: "🧮",
    },
    {
      name: "Coach Priya / Emma",
      role: "English Speaking & Fluency",
      tag: "Spoken English",
      desc: "Practice conversational English, gentle grammar corrections in parentheses & build speaking confidence.",
      badgeColor: "bg-cyan-950/90 border border-cyan-700/60 text-cyan-300",
      avatar: "🗣️",
    },
    {
      name: "Coach Rohan / Alex",
      role: "Fluency & Pronunciation Coach",
      tag: "Interview Prep",
      desc: "Improve interview speaking skills, professional English vocabulary & accent confidence.",
      badgeColor: "bg-emerald-950/90 border border-emerald-700/60 text-emerald-300",
      avatar: "💼",
    },
    {
      name: "Mentor Diya / Maya",
      role: "Calm Wellness & Anti-Depression",
      tag: "Mental Wellness",
      desc: "A compassionate, quiet space to share stress, manage anxiety, work through depression & find peace of mind.",
      badgeColor: "bg-amber-950/90 border border-amber-700/60 text-amber-300",
      avatar: "🧘",
    },
    {
      name: "Mentor Kabir / Julian",
      role: "Mindset & Stress Relief",
      tag: "Habit & Reset",
      desc: "Overcome burnout, stay focused, reframe low moods, and build positive resilient habits.",
      badgeColor: "bg-rose-950/90 border border-rose-700/60 text-rose-300",
      avatar: "⚡",
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
