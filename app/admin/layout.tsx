import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login?redirect=/admin");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    notFound();
  }

  return children;
}
