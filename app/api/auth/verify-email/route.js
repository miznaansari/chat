import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 401 }
      );
    }

    // Verify session exists in UserSession table
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        userId: payload.userId,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Verification token not found or invalid" },
        { status: 400 }
      );
    }

    // Update user email status to verified
    await prisma.user.update({
      where: { id: payload.userId },
      data: { emailVerified: true },
    });

    return NextResponse.json({
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
