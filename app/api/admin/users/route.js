import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("q") || "";

    const todayDateStr = new Date().toISOString().split("T")[0];

    // Find users matching search criteria if provided
    const whereCondition = searchQuery.trim()
      ? {
          OR: [
            { name: { contains: searchQuery } },
            { email: { contains: searchQuery } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        authProvider: true,
        dailyLimit: true,
        createdAt: true,
        aiUsages: {
          select: {
            date: true,
            count: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const userList = users.map((u) => {
      const todayUsage = u.aiUsages.find((r) => r.date === todayDateStr);
      const todayCount = todayUsage ? todayUsage.count : 0;
      const totalCount = u.aiUsages.reduce((acc, r) => acc + r.count, 0);
      const limit = u.dailyLimit && u.dailyLimit > 0 ? u.dailyLimit : 100;

      return {
        id: u.id,
        name: u.name,
        email: u.email || "N/A",
        authProvider: u.authProvider,
        dailyLimit: limit,
        todayCount,
        remainingCredits: Math.max(0, limit - todayCount),
        totalCount,
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error("Admin Fetch Users Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user list" },
      { status: 500 }
    );
  }
}
