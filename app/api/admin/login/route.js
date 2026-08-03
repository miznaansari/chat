import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Generate Session Token
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        token,
      },
    });

    const response = NextResponse.json({
      message: "Admin authenticated successfully",
      admin: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });

    // Set HTTP-only Cookie
    response.cookies.set("admin_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error during admin login" },
      { status: 500 }
    );
  }
}
