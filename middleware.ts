// filepath: /home/phungthaibao/Projects/1506/fevcv/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that require authentication
const protectedRoutes = ["/protected"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token");
  if (
    protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path)) &&
    !token
  ) {
    // Redirect to sign-in page if not authenticated
    const loginUrl = new URL("/api/auth/signin", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"]
};