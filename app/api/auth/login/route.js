import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "crypto";

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

    // Invalidate existing sessions for security
    await prisma.userSession.updateMany({
      where: { userId: user.id },
      data: { isExpire: true },
    });

    // Create new session token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        isExpire: false,
      },
    });

    const response = NextResponse.json({
      message: "Logged in successfully",
      user: { id: user.id, name: user.name },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
