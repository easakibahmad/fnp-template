"use server";

import { revalidatePath } from "next/cache";
import {
  createRole,
  deleteRole,
  updateRole,
  listRoles,
} from "@/lib/api/system/roles";
import { listAdminUsers, setUserRoles } from "@/lib/api/system/users";
import type { AdminUsersPage, RoleRecord } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";

export async function loadAccessPortalData(): Promise<{
  roles: RoleRecord[];
  users: AdminUsersPage;
}> {
  const [roles, users] = await Promise.all([listRoles(), listAdminUsers()]);
  return { roles, users };
}

export async function createRoleAction(input: {
  roleName: string;
  permissions: string[];
}) {
  try {
    const role = await createRole(input);
    revalidatePath("/admin/access");
    return { ok: true as const, role };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof ApiError ? e.detail ?? e.message : "Failed to create role",
    };
  }
}

export async function updateRoleAction(
  roleId: string,
  input: { roleName?: string; permissions?: string[] },
) {
  try {
    const role = await updateRole(roleId, input);
    revalidatePath("/admin/access");
    return { ok: true as const, role };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof ApiError ? e.detail ?? e.message : "Failed to update role",
    };
  }
}

export async function deleteRoleAction(roleId: string) {
  try {
    await deleteRole(roleId);
    revalidatePath("/admin/access");
    return { ok: true as const };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof ApiError ? e.detail ?? e.message : "Failed to delete role",
    };
  }
}

export async function setUserRolesAction(userId: string, roles: string[]) {
  try {
    const user = await setUserRoles(userId, roles);
    revalidatePath("/admin/access");
    return { ok: true as const, user };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof ApiError ? e.detail ?? e.message : "Failed to update user roles",
    };
  }
}
