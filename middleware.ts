import NextAuth from "next-auth";

import authConfig from "@/auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  publicRoutePatterns,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUploadThingRoute = nextUrl.pathname.startsWith("/api/uploadthing");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname) ||
    publicRoutePatterns.some(pattern => nextUrl.pathname.startsWith(pattern));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow UploadThing routes to pass through
  if (isUploadThingRoute) {
    return;
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }
  return;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
}