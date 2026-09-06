import { apiFetch } from "@/lib/api/client";
import type { RoleRecord } from "@/lib/api/types";

function mapRole(raw: {
  id: string;
  roleName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}): RoleRecord {
  return {
    id: raw.id,
    roleName: raw.roleName,
    permissions: raw.permissions,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function listRoles(): Promise<RoleRecord[]> {
  const raw = await apiFetch<
    {
      id: string;
      roleName: string;
      permissions: string[];
      createdAt: string;
      updatedAt: string;
    }[]
  >("/system/roles/");
  return raw.map(mapRole);
}

export async function createRole(input: {
  roleName: string;
  permissions?: string[];
}): Promise<RoleRecord> {
  const raw = await apiFetch<{
    id: string;
    roleName: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  }>("/system/roles/", {
    method: "POST",
    body: {
      roleName: input.roleName,
      permissions: input.permissions ?? [],
    },
  });
  return mapRole(raw);
}

export async function updateRole(
  roleId: string,
  input: { roleName?: string; permissions?: string[] },
): Promise<RoleRecord> {
  const raw = await apiFetch<{
    id: string;
    roleName: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  }>(`/system/roles/${roleId}`, {
    method: "PATCH",
    body: input,
  });
  return mapRole(raw);
}

export async function deleteRole(roleId: string): Promise<void> {
  await apiFetch(`/system/roles/${roleId}`, { method: "DELETE" });
}
