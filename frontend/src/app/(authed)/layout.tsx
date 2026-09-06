import { redirect } from "next/navigation";
import { getCurrentUserWithPermissions } from "@/lib/auth-server";
import { isAdmin } from "@/lib/auth";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithPermissions();
  if (!user) redirect("/login");
  
  if (isAdmin(user)) {
     redirect("/admin/access");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
