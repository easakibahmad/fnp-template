"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_COOKIE,
  isAdmin,
} from "@/lib/auth";
import { loginWithPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/errors";
import { fetchMe } from "@/lib/api/me";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

const SESSION_OPTS = {
  httpOnly: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

/** Real email/password login — backend JWT + /me permissions. */
export async function login(
  formData: FormData,
): Promise<{ ok: false; error: string } | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  let tokens;
  try {
    tokens = await loginWithPassword(email, password);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof ApiError ? (e.detail ?? e.message) : "Sign in failed",
    };
  }

  let me;
  try {
    me = await fetchMe(tokens.accessToken);
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof ApiError
          ? (e.detail ?? e.message)
          : "Could not load your profile",
    };
  }

  const sessionUser = {
    id: me.id,
    name: me.name,
    email: me.email,
    authMode: "api" as const,
    apiPermissions: me.permissions,
    backendRoles: me.roles,
  };

  const c = await cookies();
  c.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, COOKIE_OPTS);
  c.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, COOKIE_OPTS);
  c.set(SESSION_COOKIE, encodeURIComponent(JSON.stringify(sessionUser)), SESSION_OPTS);

  // Admins go to the access control portal, others to the home page
  if (isAdmin(sessionUser)) {
    redirect("/admin/access");
  }
  redirect("/");
}

export async function logout() {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
  c.delete(ACCESS_TOKEN_COOKIE);
  c.delete(REFRESH_TOKEN_COOKIE);
  redirect("/login");
}
