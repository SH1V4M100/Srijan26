"use server";
import "server-only";

import { prisma } from "@/prisma/client";
import { checkSuperAdminAuthorization } from "./AuthService";
import { revalidatePath } from "next/cache";

export async function createCampusAmbassador(data: { name: string; college: string; referralCode: string }) {
    await checkSuperAdminAuthorization();

    try {
        const existing = await prisma.campusAmbassador.findUnique({
            where: { referralCode: data.referralCode }
        });

        if (existing) {
            return { ok: false, message: "Referral code already exists" };
        }

        await prisma.campusAmbassador.create({
            data: {
                name: data.name,
                college: data.college,
                referralCode: data.referralCode,
                referralCount: 0
            }
        });

        revalidatePath("/admin/superadmin/ca");
        return { ok: true, message: "Campus Ambassador created successfully" };
    } catch (error) {
        console.error("Error creating CA:", error);
        return { ok: false, message: "Failed to create Campus Ambassador" };
    }
}
