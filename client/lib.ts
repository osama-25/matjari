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

export async function login(data: { id: string; fname: string;  lname: string; email: string ; password: string; user_name: string}) {
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
  
    // Save the session in a cookie
    
    cookies().set("Front-end session", session, { expires, httpOnly: true });

    return session;

    
  }

export async function logout() {
  // Destroy the session

  cookies().set("Front-end session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("Front-end session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("Front-end session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 1800 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "Front-end session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
