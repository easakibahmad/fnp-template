import { redirect } from "next/navigation";
import { getCurrentUserWithPermissions } from "@/lib/auth-server";
import { Permission, hasPermission } from "@/lib/permissions";
import { loadAccessPortalData } from "./actions";
import { AccessPortal } from "@/components/admin/access/AccessPortal";

export default async function AccessPage() {
  const user = await getCurrentUserWithPermissions();
  if (!user) redirect("/login");

  if (!hasPermission(user.apiPermissions, Permission.ROLES_READ)) {
    redirect("/admin/access/forbidden");
  }

  let data;
  try {
    data = await loadAccessPortalData();
  } catch {
    redirect("/admin/access/forbidden");
  }

  const canEditRoles = hasPermission(user.apiPermissions, Permission.ROLES_EDIT);
  const canCreateRoles = hasPermission(user.apiPermissions, Permission.ROLES_CREATE);
  const canDeleteRoles = hasPermission(user.apiPermissions, Permission.ROLES_DELETE);
  const canReadUsers = hasPermission(user.apiPermissions, Permission.USERS_READ);
  const canEditUsers = hasPermission(user.apiPermissions, Permission.USERS_EDIT);

  return (
    <AccessPortal
      initialRoles={data.roles}
      initialUsers={data.users}
      permissions={{
        canEditRoles,
        canCreateRoles,
        canDeleteRoles,
        canReadUsers,
        canEditUsers,
      }}
    />
  );
}
