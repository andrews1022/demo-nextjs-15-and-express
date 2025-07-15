export type Config = {
  dbUrl: string;
  jwtSecret: string;
  jwtExpiresIn: number;
  nodeEnv: string;
  port: number;
};
