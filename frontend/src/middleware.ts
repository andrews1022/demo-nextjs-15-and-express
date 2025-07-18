import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/sesh/session";
import { cookieHelper } from "@/constants/cookies";

// 1. Specify protected and public routes
const protectedRoutes = ["/profile"];
// const publicRoutes = ["/", "/sign-in", "/sign-up"];

export const middleware = async (req: NextRequest) => {
  // 2. Check if the current route is protected or public
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  // const isPublicRoute = publicRoutes.includes(pathname);

  // 3. Decrypt the session from the cookie
  const cookieStore = await cookies();
  const cookie = cookieStore.get(cookieHelper.name)?.value;
  const session = await decrypt(cookie);
  // console.log("session: ", session);

  // 4. Redirects
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // if (isPublicRoute && session?.userId && !req.nextUrl.pathname.startsWith("/profile")) {
  //   return NextResponse.redirect(new URL(`/profile/${session.userId}`, req.nextUrl));
  // }

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
