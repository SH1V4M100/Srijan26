import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyMerchandisePayment } from "@/actions/merchandise";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { order_id } = await req.json();

        if (!order_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Call the server action to verify Cashfree payment
        const result = await verifyMerchandisePayment({
            order_id,
            userId: session.user.id,
        });

        if (result.error) {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: result.message
        });

    } catch (err) {
        console.error("Error verifying payment:", err);
        return NextResponse.json({
            success: false,
            error: "Server error"
        }, { status: 500 });
    }
}
