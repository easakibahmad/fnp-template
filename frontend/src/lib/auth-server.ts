import "server-only";

import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, SESSION_COOKIE, type User } from "@/lib/auth";
import { fetchMe } from "@/lib/api/me";

export async function getCurrentUser(): Promise<User | null> {
  const c = await cookies();
  const value = c.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as User;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const c = await cookies();
  return c.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

/** Hydrate session user with latest /me permissions when API token exists. */
export async function getCurrentUserWithPermissions(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const token = await getAccessToken();
  if (!token) return user;

  try {
    const me = await fetchMe(token);
    return {
      ...user,
      id: me.id,
      apiPermissions: me.permissions,
      backendRoles: me.roles,
    };
  } catch {
    return user;
  }
}
