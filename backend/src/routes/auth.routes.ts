import { Router } from "express";
import { z } from "zod";
import { appDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { VerificationCode } from "../entities/VerificationCode";
import { authMiddleware, requireRoles } from "../middlewares/auth.middleware";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../types/auth";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8, "Password must have at least 8 characters.");

const requestCodeBody = z.object({
  email: emailSchema
});

const completeWithPasswordBody = z.object({
  email: emailSchema,
  code: z.string().length(6),
  password: passwordSchema
});

const loginBody = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

const router = Router();

const authService = new AuthService(appDataSource.getRepository(User), appDataSource.getRepository(VerificationCode));

router.post("/register/request-code", async (req, res) => {
  const parsed = requestCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  try {
    await authService.requestRegisterCode(parsed.data.email);
    res.status(200).json({ message: "Verification code sent." });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Bad request" });
  }
});

router.post("/register/complete", async (req, res) => {
  const parsed = completeWithPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  try {
    await authService.completeRegistration(parsed.data.email, parsed.data.code, parsed.data.password);
    res.status(200).json({ message: "Registration completed." });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Bad request" });
  }
});

router.post("/login", async (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  try {
    const result = await authService.login(parsed.data.email, parsed.data.password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error instanceof Error ? error.message : "Unauthorized" });
  }
});

router.post("/password-reset/request-code", async (req, res) => {
  const parsed = requestCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  await authService.requestPasswordResetCode(parsed.data.email);
  res.status(200).json({ message: "If email exists, verification code was sent." });
});

router.post("/password-reset/complete", async (req, res) => {
  const parsed = completeWithPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.flatten() });
    return;
  }

  try {
    await authService.completePasswordReset(parsed.data.email, parsed.data.code, parsed.data.password);
    res.status(200).json({ message: "Password reset completed." });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Bad request" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const profile = await authService.getProfile(req.auth.sub);
  if (!profile) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json(profile);
});

router.get("/admin-only", authMiddleware, requireRoles(UserRole.SUPER_ADMIN), (_req, res) => {
  res.status(200).json({ message: "You are super admin." });
});

export default router;
