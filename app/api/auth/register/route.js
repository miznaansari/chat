import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/jwt";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { name, password, email } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Check if email already exists
    if (email && email.trim() !== "") {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email address is already in use" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cleanEmail = email && email.trim() !== "" ? email.trim().toLowerCase() : null;

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email: cleanEmail,
      },
    });

    // Create signed JWT token
    const token = await createAuthToken({ userId: user.id, name: user.name });

    await prisma.userSession.create({
      data: {
        userId: user.id,
        token,
        isExpire: false,
      },
    });

    // Send verification email if email is provided
    if (cleanEmail) {
      sendVerificationEmail({
        toEmail: cleanEmail,
        name: user.name,
        token,
      }).catch((err) => console.error("Async verification email error:", err));
    }

    const isHttps =
      req.headers.get("x-forwarded-proto") === "https" ||
      req.nextUrl?.protocol === "https:";

    const response = NextResponse.json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language || "en",
        hasChosenLanguage: user.hasChosenLanguage || false,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
