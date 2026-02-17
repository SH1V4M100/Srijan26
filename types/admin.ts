export type AdminEvent = {
  id: string;
  name: string;
  slug: string;
  isVisible: boolean;
  registrationOpen: boolean;
};

export type EventParticipant = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  college?: string | null;
  emailVerified: Date | null;
  teamName?: string | null;
  teamLeaderName?: string | null;
};

export type VerificationFilter = "all" | "verified" | "unverified";
