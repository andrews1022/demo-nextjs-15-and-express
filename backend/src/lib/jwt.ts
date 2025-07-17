import jwt from "jsonwebtoken";

import { config } from "@/config";

type JwtPayload = {
  userId: string;
  // You can add more non-sensitive user data here if needed,
  // e.g., role: string, email: string (if needed for quick access without DB lookup)
};

// Generates a JSON Web Token (JWT)
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// Verifies a JSON Web Token (JWT)
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    return decoded;
  } catch (error) {
    // Handle specific JWT errors if needed (e.g., TokenExpiredError, JsonWebTokenError)
    console.error("JWT Verification Error:", error);
    throw new Error("Invalid or expired token.");
  }
};
