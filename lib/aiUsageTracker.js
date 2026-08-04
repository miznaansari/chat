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

/**
 * Checks if the user has reached their daily Gemini API call limit.
 * @param {string} userId - ID of the authenticated user
 * @param {number} [userDailyLimit=100] - Optional user daily limit override
 * @returns {Promise<{ allowed: boolean, count: number, limit: number }>}
 */
export async function checkAiUsageLimit(userId, userDailyLimit = 100) {
  if (!userId) return { allowed: true, count: 0, limit: userDailyLimit || 100 };

  const limit = userDailyLimit && userDailyLimit > 0 ? userDailyLimit : 100;
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    const record = await prisma.aiUsage.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const count = record ? record.count : 0;
    return {
      allowed: count < limit,
      count,
      limit,
    };
  } catch (err) {
    console.error("AI Usage Limit Check Error:", err?.message || err);
    // On DB error, allow request to avoid blocking user unexpectedly
    return { allowed: true, count: 0, limit };
  }
}

