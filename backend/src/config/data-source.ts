import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { VerificationCode } from "../entities/VerificationCode";

export const appDataSource = new DataSource({
  type: "postgres",
  url: env.databaseUrl,
  synchronize: true,
  logging: false,
  entities: [User, VerificationCode]
});
