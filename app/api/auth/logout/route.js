import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import RequireUser from "@/lib/RequireUser";

export async function POST(req) {
  try {
    const user = await RequireUser(req);
    if (user) {
      // Expire user sessions
      await prisma.userSession.updateMany({
        where: { userId: user.id },
        data: { isExpire: true },
      });
    }

    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
