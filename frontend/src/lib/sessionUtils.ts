import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { cookieHelper } from "@/lib/cookieHelper";
import { decryptToken, encryptToken } from "@/lib/jwtUtils";

type UserSession = {
  userId: string;
  userName: string;
};

export const createSession = async (userData: UserSession): Promise<void> => {
  const oneDayFromNowInMiliseconds = 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + oneDayFromNowInMiliseconds);
  const session = await encryptToken({ ...userData, expires });

  const cookieStore = await cookies();
  cookieStore.set(cookieHelper.name, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires,
  });
};

export const verifySession = async (): Promise<UserSession | null> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(cookieHelper.name)?.value;

  const session = await decryptToken(cookieValue);

  if (!session) {
    return null;
  }

  const sessionObj = {
    userId: session.userId,
    userName: session.userName,
  };

  return sessionObj;
};

export const updateSession = async (): Promise<null | undefined> => {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieHelper.name)?.value;
  const payload = await decryptToken(session);

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
