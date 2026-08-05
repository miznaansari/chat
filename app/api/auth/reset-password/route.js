import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Verify JWT cryptographic signature and expiration
    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    // Check UserSession table for active non-expired session token
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        userId: payload.userId,
        isExpire: false,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Reset token has expired or has already been used." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password in database
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    // Invalidate the reset token session in UserSession
    await prisma.userSession.update({
      where: { id: session.id },
      data: { isExpire: true },
    });

    return NextResponse.json({
      message: "Password changed successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
