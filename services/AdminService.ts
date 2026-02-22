"use server";

import { prisma } from "@/prisma/client";
import { AdminEvent, EventParticipant, VerificationFilter } from "@/types/admin";

const getAdminEvents = async (
  userId: string,
  role: string
): Promise<AdminEvent[]> => {
  if (!userId) return [];

  if (role === "SUPERADMIN") {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isVisible: true,
        registrationOpen: true,
      },
    });
    return events;
  }

  const assignments = await prisma.eventAdmin.findMany({
    where: { userId },
    include: { event: true },
  });

  return assignments.map((a) => ({
    id: a.event.id,
    name: a.event.name,
    slug: a.event.slug,
    isVisible: a.event.isVisible,
    registrationOpen: a.event.registrationOpen,
  }));
};

const getEventParticipantsBySlug = async (
  eventSlug: string,
  verification: VerificationFilter = "all"
) => {
  if (!eventSlug) return [] as EventParticipant[];

  const teams = await prisma.team.findMany({
    where: { eventSlug },
    include: { members: true },
  });

  const leaderById = new Map<string, string>();
  for (const team of teams) {
    const leader = team.members.find((m) => m.id === team.leader);
    if (leader) leaderById.set(team.id, leader.name);
  }

  const seen = new Set<string>();
  const users: EventParticipant[] = [];

  for (const team of teams) {
    const teamName = team.name;
    const teamLeaderName = leaderById.get(team.id) ?? null;
    for (const member of team.members) {
      if (!member?.id || seen.has(member.id)) continue;
      seen.add(member.id);

      if (verification === "verified" && !member.emailVerified) continue;
      if (verification === "unverified" && member.emailVerified) continue;

      users.push({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        college: member.college,
        emailVerified: member.emailVerified,
        teamName,
        teamLeaderName,
      });

    }
  }

  return users;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      college: true,
      department: true,
      year: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });
  return users;
};

export const getAllMerchandise = async () => {
  const merchandise = await prisma.merchandise.findMany({
    where: {
      status: "completed",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          department: true,
          year: true,
        },
      },
    },
    orderBy: {
      id: "desc", // implicitly ordered by creation if id is auto-generated in a way that respects time, but ObjectId contains timestamp.
    },
  });
  return merchandise;
};

export const searchUsersByEmail = async (query: string) => {
  if (!query) return [];
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    take: 10,
  });
  return users;
};

export const getEventAdmins = async (eventId: string) => {
  const admins = await prisma.eventAdmin.findMany({
    where: { eventId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return admins.map((a) => a.user);
};

export const addEventAdmin = async (eventId: string, userId: string) => {
  const count = await prisma.eventAdmin.count({
    where: { eventId },
  });

  if (count >= 3) {
    throw new Error("Maximum of 3 admins allowed per event");
  }

  const existing = await prisma.eventAdmin.findUnique({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  if (existing) {
    throw new Error("User is already an admin for this event");
  }

  await prisma.eventAdmin.create({
    data: { eventId, userId },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user && user.role === "USER") {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  }
};

export const removeEventAdmin = async (eventId: string, userId: string) => {
  await prisma.eventAdmin.delete({
    where: {
      eventId_userId: { eventId, userId },
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user && user.role === "ADMIN") {
    const adminFor = await prisma.eventAdmin.count({
      where: { userId },
    });

    if (adminFor === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "USER" },
      });
    }
  }
};

export { getAdminEvents, getEventParticipantsBySlug };
