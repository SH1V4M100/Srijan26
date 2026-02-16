import { checkAdminAuthorization } from "@/services/AuthService";
import { getAdminEvents } from "@/services/AdminService";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const user = await checkAdminAuthorization();
  const events = await getAdminEvents(user.id, user.role);

  return <AdminDashboard user={user} events={events} />;
}
