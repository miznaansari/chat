import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";
import { getRateQueueStatus } from "@/lib/aiRateQueue";

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export async function GET(req) {
  try {
    const admin = await RequireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 401 });
    }

    const rateQueueStatus = getRateQueueStatus();
    const processUptimeSeconds = process.uptime();

    // Fetch last 60 minutes of metrics from DB
    const recentMetrics = await prisma.systemMetric.findMany({
      take: 60,
      orderBy: { createdAt: "desc" },
    });

    const memoryUsage = process.memoryUsage();

    return NextResponse.json({
      status: rateQueueStatus.isHighDemand ? "high_demand" : "healthy",
      uptimeSeconds: processUptimeSeconds,
      formattedUptime: formatUptime(processUptimeSeconds),
      serverTimestamp: new Date().toISOString(),
      rateQueue: rateQueueStatus,
      memory: {
        rssMb: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
        heapTotalMb: (memoryUsage.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMb: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2),
      },
      recentMetrics: recentMetrics.reverse(), // Ascending order for charts & tables
    });
  } catch (error) {
    console.error("Admin Health API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch health metrics" },
      { status: 500 }
    );
  }
}
