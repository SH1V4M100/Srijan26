import "dotenv/config";
import { PrismaClient, UserRole } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  /* ============================
     ENV / DEFAULT CREDENTIALS
  ============================ */

  const adminEmail =
    process.env.ADMIN_EMAIL ?? "admin@srijan.com";
  const adminPassword =
    process.env.ADMIN_PASSWORD ?? "admin123";

  const superAdminEmail =
    process.env.SUPERADMIN_EMAIL ?? "superadmin@srijan.com";
  const superAdminPassword =
    process.env.SUPERADMIN_PASSWORD ?? "superadmin123";

  /* ============================
     HASH PASSWORDS
  ============================ */

  const adminHashed = await bcrypt.hash(adminPassword, 12);
  const superAdminHashed = await bcrypt.hash(superAdminPassword, 12);

  await prisma.user.upsert({
  where: { email: adminEmail },
  update: {
    role: UserRole.ADMIN,
    phone: "9990000001",
    password: adminHashed,
    registrationComplete: true,
    emailVerified: new Date(),
  },
  create: {
    name: "Admin",
    email: adminEmail,
    phone: "9990000001",
    password: adminHashed,
    role: UserRole.ADMIN,
    registrationComplete: true,
    emailVerified: new Date(),
  },
});

await prisma.user.upsert({
  where: { email: superAdminEmail },
  update: {
    role: UserRole.SUPERADMIN,
    phone: "9990000002",
    password: superAdminHashed,
    registrationComplete: true,
    emailVerified: new Date(),
  },
  create: {
    name: "Super Admin",
    email: superAdminEmail,
    phone: "9990000002",
    password: superAdminHashed,
    role: UserRole.SUPERADMIN,
    registrationComplete: true,
    emailVerified: new Date(),
  },
});

  console.log("✅ Seed complete");
  console.log("");
  console.log("🔐 TEST CREDENTIALS");
  console.log(`ADMIN → ${adminEmail} / ${adminPassword}`);
  console.log(`SUPERADMIN → ${superAdminEmail} / ${superAdminPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
