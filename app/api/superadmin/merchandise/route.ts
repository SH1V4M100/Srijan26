import { auth } from "@/auth";
import { getAllMerchandise } from "@/services/AdminService";

export async function GET() {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const merchandise = await getAllMerchandise();
        return Response.json(merchandise);
    } catch (error) {
        console.error("Failed to fetch merchandise:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
