import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const orders = await prisma.merchandise.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                status: true,
                size: true,
                color: true,
                preferredCampus: true,
                amount: true,
                createdAt: true,
                orderId: true,
                paymentId: true,
            }
        });

        return NextResponse.json({ orders });
    } catch (err) {
        console.error("Error fetching user orders:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
