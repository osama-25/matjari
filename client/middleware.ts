// import { NextRequest, NextResponse } from "next/server";
// import { updateSession, getSession } from "./lib";

// // Define a list of protected routes
// const protectedRoutes = ["/admin", "/profile"];

// export async function middleware(request: NextRequest) {
//   // Get the session and authentication token cookies
//   const sessionCookie = request.cookies.get("sessionUpdated");
//   const authToken = request.cookies.get("Front-end session"); // Ensure you're using the correct cookie name from your lib

//   // Check if the route is protected
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );

//   // If it's a protected route and no authToken is found, redirect to login
//   if (isProtectedRoute && !authToken) {
//     console.log("User is not authenticated, redirecting to login...");
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Validate the session for protected routes
//   if (isProtectedRoute && authToken) {
//     // Attempt to retrieve the session from the cookie
//     try {
//       const session = await getSession(); // Decrypt and verify session from lib
//       if (!session) {
//         console.log("Session is invalid, redirecting to login...");
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     } catch (error) {
//       console.error("Error verifying session:", error);
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   // If session update hasn't been called, update it
//   if (!sessionCookie) {
//   console.log("Updating session for the first time...");


  
//     const response = await updateSession(request); // Use your updateSession function from lib
    
//     // Mark the session as updated to avoid redundant updates
//     response.cookies.set("sessionUpdated", "true", {
//       path: "/",
//       httpOnly: true,
//       maxAge: 1800, // 30 minutes to align with the session expiry time
//     });

//     return response;
//   }

//   // If the session is already updated, proceed
//   console.log("Session already updated, proceeding...");
//   return NextResponse.next();
// }
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { updateSession } from "./lib";

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "ar"], // Define supported locales
  defaultLocale: "en",   // Define the default locale
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|Resources).*)"], // Ensure images and static assets are excluded
};

export async function middleware(request: NextRequest) {
  // Run the next-intl middleware first
  const intlResponse = intlMiddleware(request);

  // If the intl middleware modifies the response, return it directly
  if (intlResponse) {
    return intlResponse;
  }

  // Otherwise, execute your custom logic
  return await updateSession(request);
}

