"use client";

import * as React from "react";
import { FormDialog, FormField } from "@/components/ui/FormDialog";
import type { AdminUserRecord, RoleRecord } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface UserRoleAssignDialogProps {
  user: AdminUserRecord | null;
  allRoles: RoleRecord[];
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, roles: string[]) => Promise<void>;
}

export function UserRoleAssignDialog({
  user,
  allRoles,
  onOpenChange,
  onSave,
}: UserRoleAssignDialogProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (user) setSelected([...user.roles]);
  }, [user]);

  const open = user !== null;

  function toggle(roleName: string) {
    setSelected((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName],
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Assign roles"
      description={
        user
          ? `Choose which roles ${user.name} holds. Permissions are the union of all assigned roles.`
          : undefined
      }
      submitLabel="Save roles"
      onSubmit={async () => {
        if (!user) return;
        await onSave(user.id, selected);
      }}
    >
      <FormField label="Available roles">
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-thin">
          {allRoles.map((role) => {
            const on = selected.includes(role.roleName);
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => toggle(role.roleName)}
                className={cn(
                  "text-left px-3 py-2 rounded-md border text-sm transition-colors",
                  on
                    ? "border-[var(--access-accent)] bg-blue-50 text-[var(--access-accent)]"
                    : "border-[var(--access-rule-line)] hover:bg-slate-50",
                )}
              >
                <code className="access-code">{role.roleName}</code>
              </button>
            );
          })}
        </div>
      </FormField>
    </FormDialog>
  );
}
