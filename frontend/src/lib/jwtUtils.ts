import { SignJWT, jwtVerify } from "jose";

import { cookieHelper } from "@/lib/cookieHelper";

const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET);

type SessionPayload = {
  userId: string;
  expires: Date;
};

type TokenPayload = {
  userId: string;
  userName: string;
  expires: string; // ISO string format (e.g., "2023-10-01T00:00:00.000Z")
  iat: number;
  exp: number;
};

export const encryptToken = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: cookieHelper.alg })
    .setIssuedAt()
    .setExpirationTime(cookieHelper.duration)
    .sign(jwtSecretKey);
};

export const decryptToken = async (
  session: string | undefined = "",
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(session, jwtSecretKey, {
      algorithms: [cookieHelper.alg],
    });

    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.log("JWT decryption failed: ", error.message);
    }

    return null;
  }
};
