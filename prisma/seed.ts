import "dotenv/config";
import { PrismaClient, UserRole } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  /* ============================
     ENV / DEFAULT CREDENTIALS
  ============================ */

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@srijan.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const superAdminEmail =
    process.env.SUPERADMIN_EMAIL ?? "superadmin@srijan.com";
  const superAdminPassword =
    process.env.SUPERADMIN_PASSWORD ?? "superadmin123";

  /* ============================
     HASH PASSWORDS
  ============================ */

  const adminHashed = await bcrypt.hash(adminPassword, 12);
  const superAdminHashed = await bcrypt.hash(superAdminPassword, 12);
  const dummyPassword = await bcrypt.hash("password123", 12);

  const adminUser = await prisma.user.upsert({
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

  /* ============================
     EVENTS
  ============================ */

  const eventsData = [
    {
      slug: "hackathon",
      name: "Srijan Hackathon",
      minMembers: 1,
      maxMembers: 4,
      isVisible: true,
      registrationOpen: true,
    },
    {
      slug: "roborace",
      name: "Robo Race",
      minMembers: 2,
      maxMembers: 5,
      isVisible: true,
      registrationOpen: true,
    },
    {
      slug: "design-sprint",
      name: "Design Sprint",
      minMembers: 1,
      maxMembers: 3,
      isVisible: false,
      registrationOpen: false,
    },
  ];

  const events = [];
  for (const event of eventsData) {
    const created = await prisma.event.upsert({
      where: { slug: event.slug },
      update: {
        name: event.name,
        minMembers: event.minMembers,
        maxMembers: event.maxMembers,
        isVisible: event.isVisible,
        registrationOpen: event.registrationOpen,
      },
      create: event,
    });
    events.push(created);
  }

  /* ============================
     USERS
  ============================ */

  const dummyUsers = [
    {
      name: "Anita Sharma",
      email: "anita@srijan.com",
      phone: "9000000001",
      college: "IIT Example",
      year: "2",
      department: "CSE",
      emailVerified: new Date(),
    },
    {
      name: "Rahul Verma",
      email: "rahul@srijan.com",
      phone: "9000000002",
      college: "IIT Example",
      year: "3",
      department: "ECE",
      emailVerified: null,
    },
    {
      name: "Meera Iyer",
      email: "meera@srijan.com",
      phone: "9000000003",
      college: "NIT Sample",
      year: "1",
      department: "ME",
      emailVerified: new Date(),
    },
    {
      name: "Arjun Rao",
      email: "arjun@srijan.com",
      phone: "9000000004",
      college: "NIT Sample",
      year: "4",
      department: "CE",
      emailVerified: null,
    },
    {
      name: "Zoya Khan",
      email: "zoya@srijan.com",
      phone: "9000000005",
      college: "IIIT Demo",
      year: "2",
      department: "IT",
      emailVerified: new Date(),
    },
  ];

  const createdUsers = [];
  for (const user of dummyUsers) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        phone: user.phone,
        college: user.college,
        year: user.year,
        department: user.department,
        password: dummyPassword,
        registrationComplete: true,
        emailVerified: user.emailVerified,
      },
      create: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        year: user.year,
        department: user.department,
        password: dummyPassword,
        role: UserRole.USER,
        registrationComplete: true,
        emailVerified: user.emailVerified,
      },
    });
    createdUsers.push(created);
  }

  /* ============================
     EVENT ADMIN ASSIGNMENTS
  ============================ */

  const eventBySlug = new Map(events.map((e) => [e.slug, e]));

  const adminAssignments = [
    { userId: adminUser.id, eventId: eventBySlug.get("hackathon")?.id },
    { userId: adminUser.id, eventId: eventBySlug.get("roborace")?.id },
  ].filter((a): a is { userId: string; eventId: string } => Boolean(a.eventId));

  for (const assignment of adminAssignments) {
    await prisma.eventAdmin.upsert({
      where: {
        eventId_userId: {
          eventId: assignment.eventId,
          userId: assignment.userId,
        },
      },
      update: {},
      create: assignment,
    });
  }

  /* ============================
     TEAMS (EVENT PARTICIPATION)
  ============================ */

  const teamSeeds = [
    {
      name: "Team Alpha",
      eventSlug: "hackathon",
      members: [createdUsers[0], createdUsers[1]],
      leader: createdUsers[0],
    },
    {
      name: "Team Beta",
      eventSlug: "hackathon",
      members: [createdUsers[2]],
      leader: createdUsers[2],
    },
    {
      name: "RoboRiders",
      eventSlug: "roborace",
      members: [createdUsers[3], createdUsers[4]],
      leader: createdUsers[3],
    },
  ];

  for (const teamSeed of teamSeeds) {
    if (!teamSeed.members.length) continue;
    const joiningCode = `${teamSeed.eventSlug}_${teamSeed.name
      .replace(/\s+/g, "")
      .toLowerCase()}`;

    const createdTeam = await prisma.team.upsert({
      where: { joiningCode },
      update: {
        name: teamSeed.name,
        eventSlug: teamSeed.eventSlug,
        memberIds: teamSeed.members.map((m) => m.id),
        leader: teamSeed.leader.id,
      },
      create: {
        name: teamSeed.name,
        eventSlug: teamSeed.eventSlug,
        memberIds: teamSeed.members.map((m) => m.id),
        leader: teamSeed.leader.id,
        joiningCode,
        allowResetCode: true,
      },
    });

    for (const member of teamSeed.members) {
      await prisma.user.update({
        where: { id: member.id },
        data: {
          teamIds: {
            set: Array.from(
              new Set([...(member.teamIds ?? []), createdTeam.id])
            ),
          },
        },
      });
    }
  }

  console.log("Seed complete");
  console.log("");
  console.log("TEST CREDENTIALS");
  console.log(`ADMIN -> ${adminEmail} / ${adminPassword}`);
  console.log(`SUPERADMIN -> ${superAdminEmail} / ${superAdminPassword}`);
  console.log("USER PASSWORD -> password123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
