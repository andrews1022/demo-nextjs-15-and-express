import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

import { config } from "@/config";

const secretKey = new TextEncoder().encode(config.jwtSecret);

// Generates a JSON Web Token (JWT) using jose
export const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: config.jwtAlg })
    .setIssuedAt()
    .setExpirationTime(config.jwtExpiresIn)
    .sign(secretKey);
};

// Verifies a JSON Web Token (JWT) using jose
export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [config.jwtAlg],
    });
    return payload;
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new Error("Invalid or expired token.");
  }
};
