"use client";

import * as React from "react";
import { Tabs } from "@/components/ui/Tabs";
import type { AdminUsersPage, RoleRecord } from "@/lib/api/types";
import { RoleRegistryPanel } from "./RoleRegistryPanel";
import { UserAccessPanel } from "./UserAccessPanel";

export interface AccessPermissions {
  canEditRoles: boolean;
  canCreateRoles: boolean;
  canDeleteRoles: boolean;
  canReadUsers: boolean;
  canEditUsers: boolean;
}

interface AccessPortalProps {
  initialRoles: RoleRecord[];
  initialUsers: AdminUsersPage;
  permissions: AccessPermissions;
}

export function AccessPortal({
  initialRoles,
  initialUsers,
  permissions,
}: AccessPortalProps) {
  const [tab, setTab] = React.useState<"roles" | "users">("roles");
  const [roles, setRoles] = React.useState(initialRoles);
  const [usersPage, setUsersPage] = React.useState(initialUsers);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-[var(--access-muted)] max-w-2xl">
          Manage role definitions, permission rules, and which users hold each role.
          Changes apply immediately to API access.
        </p>
      </div>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as "roles" | "users")}
        tabs={[
          { id: "roles", label: "Roles", count: roles.length },
          ...(permissions.canReadUsers
            ? [{ id: "users", label: "User access", count: usersPage.meta.total }]
            : []),
        ]}
      />

      <div className="access-panel">
        {tab === "roles" && (
          <RoleRegistryPanel
            roles={roles}
            setRoles={setRoles}
            permissions={permissions}
          />
        )}
        {tab === "users" && permissions.canReadUsers && (
          <UserAccessPanel
            usersPage={usersPage}
            setUsersPage={setUsersPage}
            allRoles={roles}
            canEdit={permissions.canEditUsers}
          />
        )}
      </div>
    </div>
  );
}
