import { apiFetch } from "@/lib/api/client";
import type { AdminUserRecord, AdminUsersPage } from "@/lib/api/types";

function mapUser(raw: {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}): AdminUserRecord {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    roles: raw.roles,
    isDeleted: raw.isDeleted,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function listAdminUsers(
  page = 1,
  limit = 20,
): Promise<AdminUsersPage> {
  const raw = await apiFetch<{
    items: {
      id: string;
      email: string;
      name: string;
      roles: string[];
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }>(`/system/users/?page=${page}&limit=${limit}`);

  return {
    items: raw.items.map(mapUser),
    meta: raw.meta,
  };
}

export async function setUserRoles(
  userId: string,
  roles: string[],
): Promise<AdminUserRecord> {
  const raw = await apiFetch<{
    id: string;
    email: string;
    name: string;
    roles: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }>(`/system/users/${userId}/roles`, {
    method: "PATCH",
    body: { roles },
  });
  return mapUser(raw);
}
