import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { JWTPayload } from "jose";

import { cookieHelper } from "@/constants/cookies";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

type SessionPayload = {
  userId: string | number;
  expires: Date;
};

export const encrypt = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: cookieHelper.alg })
    .setIssuedAt()
    .setExpirationTime(cookieHelper.duration)
    .sign(key);
};

export const decrypt = async (session: string | undefined = ""): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: [cookieHelper.alg],
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
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  const session = await encrypt({ userId, expires });

  const cookieStore = await cookies();
  cookieStore.set(cookieHelper.name, session, {
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
  const cookieValue = cookieStore.get(cookieHelper.name)?.value;

  const session = await decrypt(cookieValue);

  if (session?.userId) {
    return {
      userId: session.userId,
    };
  }
};

export const updateSession = async (): Promise<null | undefined> => {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieHelper.name)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookieStore.set(cookieHelper.name, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
};

export const deleteSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(cookieHelper.name);

  redirect("/sign-in");
};
