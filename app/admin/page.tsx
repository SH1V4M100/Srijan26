import { checkAdminAuthorization } from "@/services/AuthService";
import { getAdminEvents } from "@/services/AdminService";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { notFound } from "next/navigation";

export default async function AdminPage() {
  const user = await checkAdminAuthorization();

  if (user.role === "USER") {
    notFound();
  }

  const events = await getAdminEvents(user.id, user.role);

  return <AdminDashboard user={user} events={events} />;
}
