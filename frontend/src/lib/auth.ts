export interface User {
  id: string;
  name: string;
  email: string;
  /** How this session was created */
  authMode?: "api";
  /** Resolved from GET /me — backend RBAC permissions */
  apiPermissions?: string[];
  /** Role names assigned in backend */
  backendRoles?: string[];
}

export const SESSION_COOKIE = "fnpt_user";
export const ACCESS_TOKEN_COOKIE = "fnpt_access_token";
export const REFRESH_TOKEN_COOKIE = "fnpt_refresh_token";

export const DEFAULT_ROUTE = "/";

/** Check if user has admin-level access (permission-based, best practice for RBAC). */
export function isAdmin(user: User): boolean {
  return hasPermission(user.apiPermissions, Permission.ALL) ||
    hasPermission(user.apiPermissions, Permission.ROLES_READ);
}

export { hasPermission, hasAnyPermission } from "@/lib/permissions";
import { hasPermission } from "@/lib/permissions";
import { Permission } from "@/lib/permissions";
