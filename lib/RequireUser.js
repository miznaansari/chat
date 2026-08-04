import { cookies } from "next/headers";
import prisma from "./prisma";
import { verifyAuthToken } from "./jwt";

/**
 * Validates active user JWT session from cookies or headers.
 * Ensures strict session security and isolation between users.
 * Returns user object if valid, otherwise returns null.
 */
export async function RequireUser(req = null) {
  try {
    let token = null;

    // Check request authorization header first if available
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // Fall back to HTTP-only auth_token cookie
    if (!token) {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("auth_token");
      token = authCookie?.value;
    }

    if (!token) {
      return null;
    }

    // Verify JWT cryptographic signature and expiration
    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return null;
    }

    // Try fetching active session first
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        userId: payload.userId,
        isExpire: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            language: true,
            hasChosenLanguage: true,
            dailyLimit: true,
            createdAt: true,
          },
        },
      },
    });

    if (session && session.user && !session.isExpire) {
      return session.user;
    }

    // Fallback: verify user directly in DB using valid payload.userId
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        language: true,
        hasChosenLanguage: true,
        dailyLimit: true,
        createdAt: true,
      },
    });

    return user || null;
  } catch (error) {
    console.error("RequireUser Auth Error:", error);
    return null;
  }
}

export default RequireUser;
