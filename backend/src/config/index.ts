import dotenv from "dotenv";

import type { Config } from "@/types/config";

dotenv.config();

export const config: Config = {
  dbUrl: process.env.DB_URL || "",
  jwtAlg: process.env.JWT_ALG || "HS256", // Default to HS256 if not set
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d", // Default to 1 day if not set
  jwtName: process.env.JWT_NAME || "jwt",
  jwtSecret: process.env.JWT_SECRET || "",
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
};
