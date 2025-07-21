import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

import { cookieHelper } from "@/lib/cookieHelper";

const keyAASD = new TextEncoder().encode(process.env.JWT_SECRET);

type SessionPayload = {
  userId: string | number;
  expires: Date;
};

export const encryptToken = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: cookieHelper.alg })
    .setIssuedAt()
    .setExpirationTime(cookieHelper.duration)
    .sign(keyAASD);
};

export const decryptToken = async (
  session: string | undefined = "",
): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(session, keyAASD, {
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
