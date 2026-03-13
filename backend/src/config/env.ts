import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

export const env = {
  port: toNumber(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/valenser",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret",
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  allowedEmailDomains: (process.env.ALLOWED_EMAIL_DOMAINS ?? "valens.dev,vales.dev")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
  seedSuperAdminPassword: process.env.SEED_SUPERADMIN_PASSWORD ?? "Admin123!"
};
