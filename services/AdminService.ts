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

  const seen = new Set<string>();
  const users: EventParticipant[] = [];

  for (const team of teams) {
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
      });

    }
  }

  return users;
};

export { getAdminEvents, getEventParticipantsBySlug };
