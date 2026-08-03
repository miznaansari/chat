import prisma from "@/lib/prisma";

/**
 * Tracks daily Gemini API calls per user on a YYYY-MM-DD basis.
 * @param {string} userId - ID of the authenticated user
 */
export async function trackAiUsage(userId) {
  if (!userId) return;

  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    await prisma.aiUsage.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        userId,
        date: today,
        count: 1,
      },
    });
  } catch (err) {
    console.error("AI Usage Tracking Error:", err?.message || err);
  }
}
