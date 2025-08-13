import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { cookieHelper } from "@/lib/cookieHelper";
import { decryptToken } from "@/lib/jwtUtils";

// 1. Specify protected routes
const protectedRoutes = ["/profile"];

export const middleware = async (req: NextRequest) => {
  // 2. Check if the current route is protected or public
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // 3. Decrypt the session from the cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get(cookieHelper.name)?.value;
  const session = await decryptToken(cookie);

  // 4. Redirects
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
