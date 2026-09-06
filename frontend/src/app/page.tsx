import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { isAdmin } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  
  if (isAdmin(user)) {
    redirect("/admin/access");
  }
  
  // Non-admins render the empty state page
  // The layout will wrap this
}
