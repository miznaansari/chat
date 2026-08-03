import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { email, displayName, photoURL, uid } = await req.json();

    if (!email && !uid) {
      return NextResponse.json(
        { error: "Google user authentication failed" },
        { status: 400 }
      );
    }

    const userName = (displayName || email?.split("@")[0] || `user_${Date.now()}`).trim();

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          { name: userName },
        ],
      },
    });

    if (!user) {
      // Create new Google User
      const dummyPassword = await bcrypt.hash(uid || Date.now().toString(), 10);
      user = await prisma.user.create({
        data: {
          name: userName,
          email: email || `${uid}@google.com`,
          password: dummyPassword,
          authProvider: "google",
          hasChosenLanguage: false,
        },
      });
    } else if (!user.email && email) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { email, authProvider: "google" },
      });
    }

    // Create signed JWT token (30 days validity)
    const token = await createAuthToken({ userId: user.id, name: user.name });

    // Track active user session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        isExpire: false,
      },
    });

    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.nextUrl?.protocol === "https:";

    const response = NextResponse.json({
      message: "Google sign-in successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language || "en",
        hasChosenLanguage: user.hasChosenLanguage || false,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Auth API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed Google sign-in" },
      { status: 500 }
    );
  }
}
