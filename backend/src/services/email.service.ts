export const emailService = {
  async sendCode(email: string, code: string, purpose: "register" | "reset_password"): Promise<void> {
    // Placeholder email transport for now.
    console.log(`[EMAIL] to=${email} purpose=${purpose} code=${code}`);
  }
};
