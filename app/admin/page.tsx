import { checkAdminAuthorization } from "@/services/AuthService";

export default async function AdminPage() {
  const admin = await checkAdminAuthorization();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {admin.name}</p>
    </div>
  );
}
