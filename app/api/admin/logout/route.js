import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireAdmin from "@/lib/RequireAdmin";

export async function POST(req) {
  try {
    const admin = await RequireAdmin(req);
    if (admin) {
      const cookieObj = req.cookies.get("admin_session_token");
      if (cookieObj?.value) {
        await prisma.adminSession.updateMany({
          where: { token: cookieObj.value },
          data: { isExpire: true },
        });
      }
    }

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("admin_session_token");
    return response;
  } catch (error) {
    console.error("Admin Logout Error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
