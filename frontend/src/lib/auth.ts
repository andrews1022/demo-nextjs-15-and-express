import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { JWTPayload } from "jose";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
};

export const decrypt = async (input: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });

  return payload;
};

export const login = async (formData: FormData): Promise<void> => {
  // Verify credentials && get the user
  const user = { email: formData.get("email"), name: "John" };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });
};

export const logout = async (): Promise<void> => {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
};

export const getSession = async (): Promise<JWTPayload | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  return await decrypt(session);
};

export const updateSession = async (request: NextRequest) => {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    return;
  }

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);

  const res = NextResponse.next();

  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });

  return res;
};
