"use server";

// import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

const secretKey = "TopSecretKey";
const key = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("24h")
//     .sign(key);
// }

// export async function decrypt(input: string): Promise<any> {
//   const { payload } = await jwtVerify(input, key, {
//     algorithms: ["HS256"],
//   });
//   return payload;
// }

export async function adminLogin(token: string) {
  const cookieStore = await cookies();
  
  // Create the session
  cookieStore.set("Admin session", token, { httpOnly: true });

  // Remove front-end session completely
  cookieStore.delete("Front-end session");

  // Return the redirect object directly
  return {
    redirect: {
      destination: '/admin',
      permanent: false,
    },
  };
}

export async function login(
  // data: { id: string; fname: string;  lname: string; email: string ; password: string; user_name: string},
  token: string
) {
    // Verify credentials && get the user

    
    // const user = { 
    //     id : data.id , 
    //     fname : data.fname , 
    //     lname : data.lname, 
    //     email : data.email, 
    //     password : data.password , 
    //     user_name : data.user_name, 
    // };
  
    // Create the session
    const expires = new Date(Date.now() + 1800 * 24000);
    // const session = await encrypt({ user, expires });
  
    const cookieStore = await cookies();
    // Remove admin session completely
    cookieStore.delete("Admin session");

    cookieStore.set("Front-end session", token, { expires, httpOnly: true });

    // return session;

    
  }

export async function logout() {
  // Destroy the session
  (await
    // Destroy the session
    cookies()).set("Front-end session", "", { expires: new Date(0) });
    
}

export async function adminLogout() {
  // Destroy the session
  (await
    // Destroy the session
    cookies()).set("Admin session", "", { expires: new Date(0) });
}

