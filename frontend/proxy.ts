import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Runs on the Vercel Edge before any page renders.
// If the user hits /profile with no token cookie, redirect them to /login
// instantly — no React hydration, no RTK Query race, no flash.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the destination so we can send them back after login later
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Only protect the profile route
  matcher: ["/profile"],
};
