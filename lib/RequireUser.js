import { cookies } from "next/headers";
import prisma from "./prisma";

/**
 * Validates active user session from cookies or headers.
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

    // Fetch active session from database
    const session = await prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });

    if (!session || session.isExpire || !session.user) {
      try {
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");
      } catch (e) {
        // Ignore errors in contexts where cookies are read-only
      }
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("RequireUser Auth Error:", error);
    return null;
  }
}

export default RequireUser;
