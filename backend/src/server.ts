import { app } from "./app";
import { appDataSource } from "./config/data-source";
import { env } from "./config/env";
import { User } from "./entities/User";
import { UserRole } from "./types/auth";

const seedSuperAdmins = async (): Promise<void> => {
  const repo = appDataSource.getRepository(User);
  const bcrypt = await import("bcryptjs");

  const superAdmins = ["mirza@valens.dev", "branko@valens.dev"];

  for (const email of superAdmins) {
    let user = await repo.findOne({ where: { email } });

    if (!user) {
      user = repo.create({
        email,
        role: UserRole.SUPER_ADMIN,
        isVerified: true,
        passwordHash: await bcrypt.hash(env.seedSuperAdminPassword, 10)
      });
      await repo.save(user);
      continue;
    }

    let changed = false;

    if (user.role !== UserRole.SUPER_ADMIN) {
      user.role = UserRole.SUPER_ADMIN;
      changed = true;
    }

    if (!user.isVerified) {
      user.isVerified = true;
      changed = true;
    }

    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(env.seedSuperAdminPassword, 10);
      changed = true;
    }

    if (changed) {
      await repo.save(user);
    }
  }
};

const bootstrap = async (): Promise<void> => {
  await appDataSource.initialize();
  await seedSuperAdmins();

  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
