import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
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
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
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
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
