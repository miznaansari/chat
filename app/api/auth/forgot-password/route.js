import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/jwt";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address." },
        { status: 404 }
      );
    }

    // Create signed token specifically for password reset
    const token = await createAuthToken(
      { userId: user.id, name: user.name, purpose: "password-reset" },
      "24h"
    );

    // Save token in UserSession table
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        isExpire: false,
      },
    });

    // Dispatch email
    const sent = await sendPasswordResetEmail({
      toEmail: user.email,
      name: user.name,
      token,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password reset link sent successfully to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
