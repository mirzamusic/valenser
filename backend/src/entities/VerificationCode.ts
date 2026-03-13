import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CodePurpose } from "../types/auth";
import { User } from "./User";

@Entity("verification_codes")
export class VerificationCode {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "enum", enum: CodePurpose })
  purpose!: CodePurpose;

  @Column({ type: "varchar" })
  code!: string;

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @Column({ type: "boolean", default: false })
  isUsed!: boolean;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.verificationCodes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
