import { apiFetch } from "@/lib/api/client";
import type { MeProfile } from "@/lib/api/types";

export async function fetchMe(token?: string): Promise<MeProfile> {
  const raw = await apiFetch<{
    id: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  }>("/me/", { token });

  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    roles: raw.roles,
    permissions: raw.permissions,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
