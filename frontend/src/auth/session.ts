import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { JWTPayload } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

// helper object to hold cookie options
const helper = {
  alg: "HS256",
  duration: 24 * 60 * 60 * 1000, // 1 day
  name: "session",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  },
};

type SessionPayload = {
  userId: string | number;
  expires: Date;
};

export const encrypt = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: helper.alg })
    .setIssuedAt()
    .setExpirationTime(86400) // 1 day in seconds
    .sign(key);
};

export const decrypt = async (session: string | undefined = ""): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: [helper.alg],
    });
    return payload;
  } catch (error) {
    if (error instanceof Error) {
      console.log("JWT decryption failed: ", error.message);
    }
    return null;
  }
};

export const createSession = async (userId: string): Promise<void> => {
  // console.log("userId: ", userId);
  // userId:  c80a42c4-7dd4-462a-b0d2-d2b230132669
  const expires = new Date(Date.now() + helper.duration);
  const session = await encrypt({ userId, expires });

  const cookieStore = await cookies();
  cookieStore.set(helper.name, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires,
  });

  redirect(`/profile/${userId}`);
};

export const verifySession = async () => {
  const cookieStore = await cookies();
  const ck = cookieStore.get(helper.name)?.value;

  const session = await decrypt(ck);

  // if (!session?.userId) {
  //   redirect("/sign-in");
  // }

  if (session?.userId) {
    return {
      userId: session.userId,
    };
  }
};

export const updateSession = async (): Promise<null | undefined> => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
};

export const deleteSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(helper.name);

  redirect("/sign-in");
};
