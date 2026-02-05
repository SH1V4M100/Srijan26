import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      password: hashed,
      registrationComplete: true,
      emailVerified: new Date(),
    },
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      registrationComplete: true,
      emailVerified: new Date(),
    },
  });

  console.log(`Seeded admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
