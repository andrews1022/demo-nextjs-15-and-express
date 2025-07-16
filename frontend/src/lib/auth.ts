import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { JWTPayload } from "jose";
import { redirect } from "next/navigation";

// Define a type for the user data we expect from our backend API
type UserProfile = {
  id: string;
  name: string;
  email: string;
};

// const secretKey = "secret";
// const key = new TextEncoder().encode(secretKey);

// export const encrypt = async (payload: JWTPayload): Promise<string> => {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("10 sec from now")
//     .sign(key);
// };

// export const decrypt = async (input: string): Promise<JWTPayload> => {
//   const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });

//   return payload;
// };

// A server-side login function that handles the request from the Express backend
// It uses the browser's native fetch which automatically handles cookies
export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const response = await fetch("http://localhost:4000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to log in.");
  }

  // The browser has already received and set the HttpOnly cookie.
  // There is no need to manually set the cookie here with `cookies().set()`.

  // Now, redirect the user to a protected page
  redirect("/profile");
}

// A server-side logout function that calls the backend to clear the cookie.
export async function logout() {
  const response = await fetch("http://localhost:4000/api/users/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed on the backend.");
  }

  // The backend's response will clear the cookie
  // Now, redirect to the login page after a successful logout
  redirect("/sign-in");
}

// export const getSession = async (): Promise<JWTPayload | null> => {
//   const cookieStore = await cookies();
//   const session = cookieStore.get("session")?.value;

//   if (!session) {
//     return null;
//   }

//   return await decrypt(session);
// };

// export const updateSession = async (request: NextRequest) => {
//   const session = request.cookies.get("session")?.value;

//   if (!session) {
//     return;
//   }

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);

//   const res = NextResponse.next();

//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });

//   return res;
// };

// Returns the authenticated user's profile data from the backend.
// This is our new way of "getting the session" since we no longer decrypt it here.
export async function getAuthenticatedUser(): Promise<UserProfile | null> {
  // Use a try-catch block for clean error handling
  try {
    // The browser automatically sends the HttpOnly cookie with this request
    const response = await fetch("http://localhost:4000/api/users/me");

    if (!response.ok) {
      // If the backend returns a non-200 status (e.g., 401 Unauthorized), the user is not authenticated
      return null;
    }

    const userData: UserProfile = await response.json();
    return userData;
  } catch (error) {
    // Handle network errors or other unexpected issues
    console.error("Failed to fetch authenticated user:", error);
    return null;
  }
}
