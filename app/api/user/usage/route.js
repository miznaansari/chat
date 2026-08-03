import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

export async function GET(req) {
  try {
    const user = await RequireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayDateStr = new Date().toISOString().split("T")[0];

    // Fetch all AI usage records for this user ordered by date descending
    const usageRecords = await prisma.aiUsage.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const todayRecord = usageRecords.find((r) => r.date === todayDateStr);
    const todayCount = todayRecord ? todayRecord.count : 0;

    const totalCount = usageRecords.reduce((acc, r) => acc + r.count, 0);

    // Calculate last 7 days and last 30 days totals
    const now = new Date();
    const d7Date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const d30Date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const history7DaysCount = usageRecords
      .filter((r) => r.date >= d7Date)
      .reduce((acc, r) => acc + r.count, 0);

    const history30DaysCount = usageRecords
      .filter((r) => r.date >= d30Date)
      .reduce((acc, r) => acc + r.count, 0);

    return NextResponse.json({
      today: todayDateStr,
      todayCount,
      totalCount,
      history7DaysCount,
      history30DaysCount,
      history: usageRecords,
    });
  } catch (error) {
    console.error("Fetch AI Usage Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI usage stats" },
      { status: 500 }
    );
  }
}
