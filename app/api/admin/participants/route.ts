import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { getEventParticipantsBySlug } from "@/services/AdminService";
import { VerificationFilter } from "@/types/admin";

const isValidVerification = (
  value: string | null
): value is VerificationFilter =>
  value === "all" || value === "verified" || value === "unverified";

export async function GET(request: Request) {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    !["ADMIN", "SUPERADMIN"].includes(session.user.role)
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventSlug = searchParams.get("eventSlug");
  const verificationParam = searchParams.get("verification");
  const verification: VerificationFilter = isValidVerification(verificationParam)
    ? verificationParam
    : "all";

  if (!eventSlug) {
    return Response.json({ error: "Missing eventSlug" }, { status: 400 });
  }

  if (session.user.role !== "SUPERADMIN") {
    const assignment = await prisma.eventAdmin.findFirst({
      where: {
        userId: session.user.id,
        event: { slug: eventSlug },
      },
      select: { id: true },
    });

    if (!assignment) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const participants = await getEventParticipantsBySlug(
    eventSlug,
    verification
  );
  return Response.json(participants);
}
