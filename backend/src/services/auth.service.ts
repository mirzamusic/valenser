import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MoreThan, Repository } from "typeorm";
import { env } from "../config/env";
import { User } from "../entities/User";
import { VerificationCode } from "../entities/VerificationCode";
import { CodePurpose, UserRole } from "../types/auth";
import { emailService } from "./email.service";

const CODE_TTL_MINUTES = 15;

export class AuthService {
  constructor(
    private readonly usersRepo: Repository<User>,
    private readonly codesRepo: Repository<VerificationCode>
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isAllowedEmail(email: string): boolean {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    return env.allowedEmailDomains.includes(domain);
  }

  private buildCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private async createCode(user: User, purpose: CodePurpose): Promise<string> {
    await this.codesRepo.update(
      {
        userId: user.id,
        purpose,
        isUsed: false
      },
      { isUsed: true }
    );

    const code = this.buildCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

    await this.codesRepo.save(
      this.codesRepo.create({
        userId: user.id,
        email: user.email,
        purpose,
        code,
        expiresAt,
        isUsed: false
      })
    );

    await emailService.sendCode(user.email, code, purpose);
    return code;
  }

  async requestRegisterCode(rawEmail: string): Promise<void> {
    const email = this.normalizeEmail(rawEmail);

    if (!this.isAllowedEmail(email)) {
      throw new Error("Only company email domains are allowed.");
    }

    let user = await this.usersRepo.findOne({ where: { email } });

    if (user?.isVerified) {
      throw new Error("User already exists. Please login.");
    }

    if (!user) {
      user = await this.usersRepo.save(
        this.usersRepo.create({
          email,
          isVerified: false,
          role: UserRole.EMPLOYEE,
          passwordHash: null
        })
      );
    }

    await this.createCode(user, CodePurpose.REGISTER);
  }

  async completeRegistration(rawEmail: string, code: string, password: string): Promise<void> {
    const email = this.normalizeEmail(rawEmail);

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found.");
    }

    const verificationCode = await this.codesRepo.findOne({
      where: {
        email,
        userId: user.id,
        purpose: CodePurpose.REGISTER,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date())
      },
      order: { createdAt: "DESC" }
    });

    if (!verificationCode) {
      throw new Error("Invalid or expired code.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    verificationCode.isUsed = true;
    user.passwordHash = passwordHash;
    user.isVerified = true;

    await this.codesRepo.save(verificationCode);
    await this.usersRepo.save(user);
  }

  async requestPasswordResetCode(rawEmail: string): Promise<void> {
    const email = this.normalizeEmail(rawEmail);
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user || !user.isVerified) {
      // Do not leak user existence.
      return;
    }

    await this.createCode(user, CodePurpose.RESET_PASSWORD);
  }

  async completePasswordReset(rawEmail: string, code: string, password: string): Promise<void> {
    const email = this.normalizeEmail(rawEmail);
    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user || !user.isVerified) {
      throw new Error("Invalid request.");
    }

    const verificationCode = await this.codesRepo.findOne({
      where: {
        email,
        userId: user.id,
        purpose: CodePurpose.RESET_PASSWORD,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date())
      },
      order: { createdAt: "DESC" }
    });

    if (!verificationCode) {
      throw new Error("Invalid or expired code.");
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    verificationCode.isUsed = true;

    await this.codesRepo.save(verificationCode);
    await this.usersRepo.save(user);
  }

  async login(rawEmail: string, password: string): Promise<{ token: string; email: string; role: UserRole }> {
    const email = this.normalizeEmail(rawEmail);

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user || !user.passwordHash || !user.isVerified) {
      throw new Error("Invalid credentials.");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials.");
    }

    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    return {
      token,
      email: user.email,
      role: user.role
    };
  }

  async getProfile(userId: string): Promise<{ id: string; email: string; role: UserRole } | null> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }
}
