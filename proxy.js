import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";

/**
 * Next.js 16 Proxy for request authentication & route protection using JWT.
 */
export async function proxy(req) {
  const { pathname } = req.nextUrl;

  let token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  const isProtectedApi =
    pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/");
  const isProtectedPage = pathname === "/" || pathname.startsWith("/chat");

  const payload = token ? await verifyAuthToken(token) : null;
  const isValid = Boolean(payload && payload.userId);

  // Redirect unauthenticated user accessing protected pages to /login
  if (isProtectedPage && !isValid) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Return 401 for unauthenticated requests to protected API endpoints
  if (isProtectedApi && !isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets, images, service worker, manifest, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|sw.js|manifest.json|icon-.*\\.png).*)",
  ],
};
