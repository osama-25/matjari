"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "TopSecretKey";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1800 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(
  data: { id: string; fname: string;  lname: string; email: string ; password: string; user_name: string},
  token: string
) {
    // Verify credentials && get the user

    
    const user = { 
        id : data.id , 
        fname : data.fname , 
        lname : data.lname, 
        email : data.email, 
        password : data.password , 
        user_name : data.user_name, 
    };
  
    // Create the session
    const expires = new Date(Date.now() + 1800 * 1000);
    const session = await encrypt({ user, expires });
  
    
    // console.log("session: " + session);
    // console.log(typeof(session));
    // Save the session in a cookie
    
    // cookies().set()
    // cookies().set("Front-end session", session, { expires, httpOnly: true });


    
    (await
    // console.log("session: " + session);
    // console.log(typeof(session));
    // Save the session in a cookie
    // cookies().set()
    // cookies().set("Front-end session", session, { expires, httpOnly: true });
    cookies()).set("Front-end session", token, { expires, httpOnly: true });

    return session;

    
  }

export async function logout() {
  // Destroy the session

  (await
    // Destroy the session
    cookies()).set("Front-end session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("Front-end session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
var number = 0;
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("Front-end session")?.value;
  // console.log(session + " N: " + number++);
  
  if (!session) {
    // const loginUrl = new URL('/login', request.url); // Construct absolute URL
    // return NextResponse.redirect(loginUrl.toString());
    return;
  } ;
  


  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  // console.log(parsed.exp);
  // console.log(Date.now());
  const currentTime =  Date.now() / 1000;

  // Check if the session token has expired
  // console.log("currentTime: " + currentTime );
  // console.log("parsed.exp: " + parsed.exp );
  
  if (parsed.exp && parsed.exp <= currentTime) {
    console.log("Session expired. Forcing login.");

    // const res = NextResponse.redirect('/');
    const res = NextResponse.redirect(new URL('/login', request.url).toString());

    res.cookies.set({
      name: "Front-end session",
      value: "",
      httpOnly: true,
      expires: new Date(0), // Immediately expire the cookie
    });
    return res;

  }
  return NextResponse.next();
}
