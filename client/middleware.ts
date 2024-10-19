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

import { NextRequest } from "next/server";
import { updateSession } from "./lib";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
