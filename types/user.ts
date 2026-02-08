import { UserRole } from "@/prisma/generated/prisma/enums";

type User = {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    email: string;
    registrationComplete: boolean;
    emailVerified: Date | null;
    image?: string | null;
    password?: string | null;
    role?: UserRole;
    year?: string | null;
    department?: string | null;
}

type SessionUser = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: UserRole;
    emailVerified: Date | null;
    registrationComplete: boolean;
}



export type {User, SessionUser};