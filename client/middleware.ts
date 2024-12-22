// import { NextRequest, NextResponse } from "next/server";
// import createMiddleware from "next-intl/middleware";
// import { updateSession } from "./lib";

// // Create the next-intl middleware
// const intlMiddleware = createMiddleware({
//   locales: ["en", "ar"], // Define supported locales
//   defaultLocale: "en",   // Define the default locale
// });

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|Resources).*)"], // Ensure images and static assets are excluded
// };

// export async function middleware(request: NextRequest) {
//   // Run the next-intl middleware first
//   const intlResponse = intlMiddleware(request);

//   // If the intl middleware modifies the response, return it directly
//   console.log("OUT1");
  
//   if (intlResponse) {
//     return intlResponse;
//   }
//   console.log("OUT2");

//   // Otherwise, execute your custom logic
//   return await updateSession(request);
// }



// import { NextRequest, NextResponse } from "next/server";
// import createMiddleware from "next-intl/middleware";
// import { updateSession } from "./lib";

// // Create the next-intl middleware
// const intlMiddleware = createMiddleware({
//   locales: ["en", "ar"], // Define supported locales
//   defaultLocale: "en",   // Define the default locale
// });

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|Resources).*)"], // Ensure images and static assets are excluded
// };
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Run the next-intl middleware
//   const intlResponse = intlMiddleware(request);
//   if (intlResponse) {
//     return intlResponse;
//   }

//   // Protected routes logic
//   const protectedRoutes = ["/admin", "/dashboard", "/profile"];
//   const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

//   if (isProtected) {
//     const session = await updateSession(request);

//     // const {user} = session;
//     if (!session?.user) {
//       const loginUrl = new URL("/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // Continue with the request
//   return NextResponse.next();
// }

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
  const protectedRoutes = baseProtectedRoutes.flatMap((route) =>
    locales.map((locale) => `/${locale}${route}`)
  );

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));


  console.log(`pathname ${pathname}`);
  console.log(`isProtected ${isProtected}`);
  
  
  
  if (isProtected) {
    
    
    // const session = await updateSession(request);

    const sessionCookie = ((await cookies()).get("Front-end session"));
    
    console.log("session#");
    // console.log(session.value);
    
    if (!sessionCookie || !sessionCookie.value) {
      console.log("No session found or session is invalid.");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

const secretKey = new TextEncoder().encode("TopSecretKey"); // Replace with your actual secret key

    try {
      // Decode and verify the JWT
      const sessionData = await jwtVerify(sessionCookie.value, secretKey );;
      // const sessionData = jwtVerify(sessionCookie.value, SECRET_KEY);
  
      // Optional: Check for expiration (JWT will throw an error if expired)
      if ((await sessionData).payload.exp * 1000 < Date.now()) {
        throw new Error("Session expired");
      }
  
      console.log("Session is valid:", sessionData);
    } catch (error) {
      console.log("Session is invalid or expired:", error.message);
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  
  
  }

  // If intlMiddleware generated a response, return it; otherwise, proceed
  return intlResponse || NextResponse.next();
}
