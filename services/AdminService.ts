"use server";

import { prisma } from "@/prisma/client";
import { User } from "@/types/types";

const getAdminEvents = async (userId: string) => {
  if (!userId) return [];

  const assignments = await prisma.eventAdmin.findMany({
    where: { userId },
    include: { event: true },
  });

  return assignments.map((a) => a.event);
};

type VerificationFilter = "all" | "verified" | "unverified";

const getEventParticipantsBySlug = async (
  eventSlug: string,
  verification: VerificationFilter = "all"
) => {
  if (!eventSlug) return [] as User[];

  const teams = await prisma.team.findMany({
    where: { eventSlug },
    include: { members: true },
  });

  const seen = new Set<string>();
  const users: User[] = [];

  for (const team of teams) {
    for (const member of team.members) {
      if (!member?.id || seen.has(member.id)) continue;
      seen.add(member.id);

      if (verification === "verified" && !member.emailVerified) continue;
      if (verification === "unverified" && member.emailVerified) continue;

      users.push(member as User);
    }
  }

  return users;
};

export { getAdminEvents, getEventParticipantsBySlug };
