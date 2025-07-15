import dotenv from "dotenv";

import type { Config } from "@/types/config";

dotenv.config();

export const config: Config = {
  dbUrl: process.env.DB_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400, // 86400 is 1 day in seconds
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
};
