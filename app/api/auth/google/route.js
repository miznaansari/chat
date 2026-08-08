import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAuthToken } from "@/lib/jwt";
import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function POST(req) {
  try {
    const { idToken, displayName, photoURL } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Google ID token is required" },
        { status: 400 }
      );
    }

    let payload;
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nextaichat-a0a1c";
      const { payload: verifiedPayload } = await jwtVerify(idToken, JWKS, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });
      payload = verifiedPayload;
    } catch (jwtErr) {
      console.error("Google ID Token validation failed:", jwtErr?.message || jwtErr);
      return NextResponse.json(
        { error: "Invalid or expired Google ID token" },
        { status: 401 }
      );
    }

    const email = payload.email;
    const uid = payload.sub; // Firebase user ID

    if (!email) {
      return NextResponse.json(
        { error: "Email not provided in Google ID token" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userName = (displayName || cleanEmail.split("@")[0] || `user_${Date.now()}`).trim();

    // Match strictly by verified email to prevent name-collision takeover
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Ensure name is unique in DB
      let finalName = userName;
      const nameExists = await prisma.user.findUnique({
        where: { name: finalName },
      });
      if (nameExists) {
        finalName = `${userName}_${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Create new Google User
      const dummyPassword = await bcrypt.hash(uid || Date.now().toString(), 10);
      user = await prisma.user.create({
        data: {
          name: finalName,
          email: cleanEmail,
          password: dummyPassword,
          authProvider: "google",
          hasChosenLanguage: false,
        },
      });
    } else if (user.authProvider !== "google") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { authProvider: "google" },
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
