export const Permission = {
  ALL: "*",
  USERS_READ: "UsersRead",
  USERS_CREATE: "UsersCreate",
  USERS_EDIT: "UsersEdit",
  USERS_DELETE: "UsersDelete",
  ROLES_READ: "RolesRead",
  ROLES_CREATE: "RolesCreate",
  ROLES_EDIT: "RolesEdit",
  ROLES_DELETE: "RolesDelete",
  SETTINGS_READ: "SettingsRead",
  SETTINGS_CREATE: "SettingsCreate",
  SETTINGS_EDIT: "SettingsEdit",
  SETTINGS_DELETE: "SettingsDelete",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  [Permission.ALL]: "Full access",
  [Permission.USERS_READ]: "View users",
  [Permission.USERS_CREATE]: "Create users",
  [Permission.USERS_EDIT]: "Edit users",
  [Permission.USERS_DELETE]: "Delete users",
  [Permission.ROLES_READ]: "View roles",
  [Permission.ROLES_CREATE]: "Create roles",
  [Permission.ROLES_EDIT]: "Edit roles",
  [Permission.ROLES_DELETE]: "Delete roles",
  [Permission.SETTINGS_READ]: "View settings",
  [Permission.SETTINGS_CREATE]: "Create settings",
  [Permission.SETTINGS_EDIT]: "Edit settings",
  [Permission.SETTINGS_DELETE]: "Delete settings",
};

export type PermissionDomain = "Users" | "Roles" | "Settings";

export const PERMISSION_GROUPS: {
  domain: PermissionDomain;
  permissions: PermissionKey[];
}[] = [
  {
    domain: "Users",
    permissions: [
      Permission.USERS_READ,
      Permission.USERS_CREATE,
      Permission.USERS_EDIT,
      Permission.USERS_DELETE,
    ],
  },
  {
    domain: "Roles",
    permissions: [
      Permission.ROLES_READ,
      Permission.ROLES_CREATE,
      Permission.ROLES_EDIT,
      Permission.ROLES_DELETE,
    ],
  },
  {
    domain: "Settings",
    permissions: [
      Permission.SETTINGS_READ,
      Permission.SETTINGS_CREATE,
      Permission.SETTINGS_EDIT,
      Permission.SETTINGS_DELETE,
    ],
  },
];

export const ALL_ASSIGNABLE_PERMISSIONS = PERMISSION_GROUPS.flatMap(
  (g) => g.permissions,
);

export function hasPermission(
  permissions: string[] | undefined,
  required: PermissionKey,
): boolean {
  if (!permissions?.length) return false;
  if (permissions.includes(Permission.ALL)) return true;
  return permissions.includes(required);
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  required: PermissionKey[],
): boolean {
  return required.some((p) => hasPermission(permissions, p));
}
