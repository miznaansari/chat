import prisma from "@/lib/prisma";

export default async function RequireAdmin(req) {
  try {
    let token = null;

    // Check Authorization Header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // Check Cookies
    if (!token && req.cookies) {
      const cookieObj = req.cookies.get("admin_session_token");
      if (cookieObj) {
        token = cookieObj.value;
      }
    }

    if (!token) return null;

    // Find active AdminSession
    const session = await prisma.adminSession.findFirst({
      where: {
        token,
        isExpire: false,
      },
      include: {
        admin: true,
      },
    });

    if (!session || !session.admin) return null;

    return session.admin;
  } catch (error) {
    console.error("RequireAdmin Auth Error:", error);
    return null;
  }
}
