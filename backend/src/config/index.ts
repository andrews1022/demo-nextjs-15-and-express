import dotenv from "dotenv";

import type { Config } from "@/types/config";

dotenv.config();

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
};
