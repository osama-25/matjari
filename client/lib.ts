"use server";

import { cookies } from "next/headers";

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

  token: string
) {

    const expires = new Date(Date.now() + 1800 * 24000);

  
    const cookieStore = await cookies();

    cookieStore.delete("Admin session");

    cookieStore.set("Front-end session", token, { expires, httpOnly: true });

    
  }

export async function logout() {
  
  (await
  
    cookies()).set("Front-end session", "", { expires: new Date(0) });
    
}

export async function adminLogout() {
  
  (await
  
    cookies()).set("Admin session", "", { expires: new Date(0) });
}

