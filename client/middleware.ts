import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "./lib";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "ar"], // Define supported locales
  defaultLocale: "en",   // Define the default locale
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|Resources).*)"], // Ensure images and static assets are excluded
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run intlMiddleware but do not return immediately
  const intlResponse = intlMiddleware(request);

  // Check for protected routes
  const baseProtectedRoutes = ["/admin", "/profile", "/add_listing" , "/chats", "/favourites"];
  const locales = ["en", "ar"]; // Add other locales if needed
  let protectedRoutes = baseProtectedRoutes.flatMap((route) =>
    locales.map((locale) => `/${locale}${route}`)
  );

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const frontEndSessionCookie = (await cookies()).get("Front-end session");
    const adminSessionCookie = (await cookies()).get("Admin session");

    if (!frontEndSessionCookie && !adminSessionCookie) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const secretKey = new TextEncoder().encode("TopSecretKey"); // Replace with your actual secret key

    try {
      let sessionData;
      if (adminSessionCookie) {
        // Decode and verify the Admin JWT
        sessionData = await jwtVerify(adminSessionCookie.value, secretKey);

        // Optional: Check for expiration (JWT will throw an error if expired)
        if (sessionData.payload.exp * 1000 < Date.now()) {
          throw new Error("Session expired");
        }

        console.log("Admin session data:", sessionData);

        // Remove admin routes from protected routes
        protectedRoutes = protectedRoutes.filter(route => !route.includes('/admin'));

        // Check if the user is an admin for admin routes - without locale prefix
        if (pathname.includes('/admin') && !sessionData.payload.isAdmin) {
          throw new Error("Access denied. Admins only.");
        }

        // Restrict admin users from accessing non-admin routes
        if (!pathname.includes('/admin')) {
          const adminDashboardUrl = new URL("/en/admin/dashboard", request.url);
          return NextResponse.redirect(adminDashboardUrl);
        }

      } else if (frontEndSessionCookie) {
        // Decode and verify the Front-end JWT
        sessionData = await jwtVerify(frontEndSessionCookie.value, secretKey);

        // Optional: Check for expiration (JWT will throw an error if expired)
        if (sessionData.payload.exp * 1000 < Date.now()) {
          throw new Error("Session expired");
        }

        // Restrict front-end users from accessing admin routes
        if (pathname.includes('/admin')) {
          throw new Error("Access denied. Admins only.");
        }
      }

    } catch (error) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If intlMiddleware generated a response, return it; otherwise, proceed

  return intlResponse || NextResponse.next();
}
