import { NextResponse } from "next/server";

/**
 * Next.js 16 Proxy for request authentication & route protection.
 */
export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const isProtectedApi = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/");
  const isProtectedPage = pathname === "/" || pathname.startsWith("/chat");

  // Redirect unauthenticated user accessing protected pages to /login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Return 401 for unauthenticated requests to protected API endpoints
  if (isProtectedApi && !token) {
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
