"use client";

import * as React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AdminUserRecord, AdminUsersPage, RoleRecord } from "@/lib/api/types";
import { UserRoleAssignDialog } from "./UserRoleAssignDialog";
import { setUserRolesAction } from "@/app/(admin)/admin/access/actions";
import { useToast } from "@/components/ui/Toast";

interface UserAccessPanelProps {
  usersPage: AdminUsersPage;
  setUsersPage: React.Dispatch<React.SetStateAction<AdminUsersPage>>;
  allRoles: RoleRecord[];
  canEdit: boolean;
}

export function UserAccessPanel({
  usersPage,
  setUsersPage,
  allRoles,
  canEdit,
}: UserAccessPanelProps) {
  const { toast } = useToast();
  const [editUser, setEditUser] = React.useState<AdminUserRecord | null>(null);

  async function handleAssign(userId: string, roles: string[]) {
    const result = await setUserRolesAction(userId, roles);
    if (!result.ok) {
      toast({
        title: "Could not update user",
        description: result.error,
        tone: "error",
      });
      return;
    }
    setUsersPage((prev) => ({
      ...prev,
      items: prev.items.map((u) => (u.id === userId ? result.user : u)),
    }));
    setEditUser(null);
    toast({ title: "User roles updated", description: result.user.email });
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-[var(--access-rule-line)] text-left">
            <th className="pb-2 text-xs font-medium text-[var(--access-muted)]">Name</th>
            <th className="pb-2 text-xs font-medium text-[var(--access-muted)]">Email</th>
            <th className="pb-2 text-xs font-medium text-[var(--access-muted)]">Roles</th>
            <th className="pb-2 w-16" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--access-rule-line)]">
          {usersPage.items.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/80">
              <td className="py-3 pr-4 text-sm font-medium">{user.name}</td>
              <td className="py-3 pr-4 text-sm text-[var(--access-muted)]">{user.email}</td>
              <td className="py-3 pr-4">
                <div className="flex flex-wrap gap-1">
                  {user.roles.length ? (
                    user.roles.map((r) => (
                      <span
                        key={r}
                        className="access-code text-[var(--access-grant)] border-[var(--access-grant)]/30 bg-[var(--access-grant-bg)]"
                      >
                        {r}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--access-muted)]">No roles</span>
                  )}
                </div>
              </td>
              <td className="py-3 text-right">
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditUser(user)}
                    aria-label={`Edit roles for ${user.name}`}
                  >
                    <Pencil size={13} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserRoleAssignDialog
        user={editUser}
        allRoles={allRoles}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSave={handleAssign}
      />
    </div>
  );
}
