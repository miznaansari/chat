const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding blog posts into dev.db...");

  await prisma.blogPost.createMany({
    data: [
      {
        title: "How to Use NextAiChat Roleplay for Exam Prep and Educational Tutors",
        slug: "ai-roleplay-exam-prep-tutors",
        excerpt: "Learn how students are utilizing NextAiChat's multi-character AI roleplay personas to practice complex subject concepts, conduct mock oral exams, and study faster.",
        content: `
# Mastering Exam Prep with AI Roleplay

Studying for exams doesn't have to mean staring at static textbook pages for hours. With **NextAiChat**, you can create interactive AI tutors and roleplay subject scenarios that turn active recall into an engaging conversation.

## 1. Practice Oral Board & Viva Questions
Simulate an oral examination with an AI professor persona that asks probing questions based on your syllabus.

## 2. Foreign Language Immersion
Switch between English and Hinglish seamlessly to practice conversational vocabulary without fear of judgment.

## 3. Dynamic Multi-Turn Discussions
NextAiChat's dynamic turn engine allows multiple subject personas (e.g. a Physics tutor and a Math mentor) to collaborate in a single room!
        `,
        category: "Study & Education",
        author: "NextAiChat Education Team",
        views: 142,
        published: true,
      },
      {
        title: "NextAiChat vs Character.ai: Why Dynamic Turn Engines Matter",
        slug: "nextaichat-vs-character-ai-dynamic-turns",
        excerpt: "Discover why rigid turn-taking in traditional AI roleplay platforms hinders multi-character storytelling and how NextAiChat's Gemini engine solves it.",
        content: `
# Why NextAiChat is Built Different

When engaging in multi-character roleplay, waiting for manual prompt selections slows down the storytelling momentum.

## The Character.ai Limitation
In traditional systems, users must manually direct who speaks next or cycle through static response buttons.

## The NextAiChat Solution
NextAiChat's **Dynamic Speaker Turn Engine** uses contextual AI analysis to automatically identify which persona should speak next based on conversation context.

### Key Benefits:
- **Zero Latency**: Powered by Gemini Flash Lite models.
- **Privacy First**: Encrypted sessions without public log scraping.
- **Custom Snippets**: Store your favorite roleplay prompts for quick reuse.
        `,
        category: "Guides",
        author: "NextAiChat Tech Team",
        views: 289,
        published: true,
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
