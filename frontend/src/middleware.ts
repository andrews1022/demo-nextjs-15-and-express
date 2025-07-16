import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  // Get the JWT from the incoming request's cookies
  const hasAuthCookie = request.cookies.has("jwt");

  // The path the user is trying to access
  const path = request.nextUrl.pathname;

  // If the user is on a protected route AND is not authenticated...
  if (path.startsWith("/profile") && !hasAuthCookie) {
    // ...redirect them to the sign-in page
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
};

export const config = {
  // Match only the /profile route and its sub-paths
  // This avoids running the middleware on every single request
  matcher: ["/profile/:path*"],
};
