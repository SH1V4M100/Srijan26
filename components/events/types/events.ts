export type Category =
  | "All"
  | "Coding"
  | "Circuits and Robotics"
  | "Business"
  | "Brainstroming"
  | "Gaming"
  | "Esports"
  | "Special Attractions"
  | "Special Attractions1"
  | "Misc";

export type EventStatus = "All" | "Open" | "Closed" | "Coming Soon";

export interface Coordinator {
  name: string;
  contact: string;
}

export interface Event {
  // --- Core Metadata ---
  id: string;
  title: string;
  category: Category;
  color: string;
  description: string;
  image: string;
  tags: string[];

  // --- Event Details & Rules ---
  format: string;
  teamSize: string;
  rules: string[];

  // --- Schedule & Dates ---
  lastDate: string;
  prelimsDate?: string;
  finalsDate?: string;

  // --- Prizes ---
  prizePool: string;
  winnerPrize?: string;
  runnersUpPrize?: string;
  secondRunnersUpPrize?: string;

  // --- Links & Contacts ---
  link: string;
  driveLink: string;
  coordinators: Coordinator[];

  // --- State ---
  status: EventStatus;
}