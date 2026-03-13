import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "../types/auth";
import { VerificationCode } from "./VerificationCode";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  passwordHash!: string | null;

  @Column({ type: "enum", enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole;

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @OneToMany(() => VerificationCode, (code) => code.user)
  verificationCodes!: VerificationCode[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
