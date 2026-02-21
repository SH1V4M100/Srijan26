import { auth } from "@/auth";
import { getAllUsers } from "@/services/AdminService";

export async function GET() {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPERADMIN") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await getAllUsers();
        return Response.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
