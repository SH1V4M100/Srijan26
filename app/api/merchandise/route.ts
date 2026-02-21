import { auth } from "@/auth";
import { prisma } from "@/prisma/client";
import { MerchandiseSize, MerchandiseColor, Campus, PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { size, color, campus, customText } = body;

        // Basic Validation
        if (!size || !color || !campus) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Regex Validation (Matching Frontend)
        const BATCH_CODE_REGEX = /^(2k\d{2}|20\d{2}|\d{8,12})$/i;
        const ALLOWED_CHARS_REGEX = /^[a-zA-Z0-9\s@#\.()]*$/;

        if (customText) {
            if (!ALLOWED_CHARS_REGEX.test(customText)) {
                return Response.json({ error: "Invalid characters in custom text" }, { status: 400 });
            }

            const parts = customText.split(/\s+/);
            for (const part of parts) {
                if (BATCH_CODE_REGEX.test(part)) {
                    return Response.json({ error: "Custom text cannot contain batch codes" }, { status: 400 });
                }
            }
        }

        // Create Merchandise Order
        const merchandise = await prisma.merchandise.create({
            data: {
                size: size as MerchandiseSize,
                color: color as MerchandiseColor,
                preferredCampus: campus as Campus,
                customText: customText || null,
                status: "pending" as PaymentStatus,
                userId: session.user.id,
            },
        });

        return Response.json({
            success: true,
            merchandiseId: merchandise.id,
            message: "Order initiated successfully"
        });
    } catch (error) {
        console.error("Merchandise API Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
