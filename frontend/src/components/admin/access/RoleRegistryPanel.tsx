"use client";

import * as React from "react";
import { Plus, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { RoleRecord } from "@/lib/api/types";
import { Permission } from "@/lib/permissions";
import type { AccessPermissions } from "./AccessPortal";
import { PermissionMatrix } from "./PermissionMatrix";
import { CreateRoleDialog } from "./CreateRoleDialog";
import {
  createRoleAction,
  deleteRoleAction,
  updateRoleAction,
} from "@/app/(admin)/admin/access/actions";
import { useToast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/Input";

const BUILTIN_ROLES = new Set(["system_admin"]);

interface RoleRegistryPanelProps {
  roles: RoleRecord[];
  setRoles: React.Dispatch<React.SetStateAction<RoleRecord[]>>;
  permissions: AccessPermissions;
}

export function RoleRegistryPanel({
  roles,
  setRoles,
  permissions,
}: RoleRegistryPanelProps) {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = React.useState<string | null>(
    roles[0]?.id ?? null,
  );
  const [createOpen, setCreateOpen] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");
  const [draftPermissions, setDraftPermissions] = React.useState<string[]>([]);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const selected = roles.find((r) => r.id === selectedId) ?? null;

  React.useEffect(() => {
    if (selected) {
      setDraftName(selected.roleName);
      setDraftPermissions([...selected.permissions]);
      setDirty(false);
    }
  }, [selected?.id, selected?.roleName, selected?.permissions]);

  const hasWildcard = draftPermissions.includes(Permission.ALL);

  async function handleSave() {
    if (!selected || !permissions.canEditRoles) return;
    setSaving(true);
    const result = await updateRoleAction(selected.id, {
      roleName: draftName.trim(),
      permissions: draftPermissions,
    });
    setSaving(false);
    if (!result.ok) {
      toast({ title: "Could not save role", description: result.error, tone: "error" });
      return;
    }
    setRoles((prev) => prev.map((r) => (r.id === result.role.id ? result.role : r)));
    setDirty(false);
    toast({ title: "Role updated", description: result.role.roleName });
  }

  async function handleDelete() {
    if (!selected || !permissions.canDeleteRoles) return;
    if (BUILTIN_ROLES.has(selected.roleName)) return;
    if (!confirm(`Delete role "${selected.roleName}"?`)) return;

    const result = await deleteRoleAction(selected.id);
    if (!result.ok) {
      toast({ title: "Could not delete role", description: result.error, tone: "error" });
      return;
    }
    setRoles((prev) => {
      const next = prev.filter((r) => r.id !== selected.id);
      setSelectedId(next[0]?.id ?? null);
      return next;
    });
    toast({ title: "Role deleted" });
  }

  async function handleCreate(roleName: string, perms: string[]) {
    const result = await createRoleAction({ roleName, permissions: perms });
    if (!result.ok) {
      toast({ title: "Could not create role", description: result.error, tone: "error" });
      return;
    }
    setRoles((prev) => [...prev, result.role].sort((a, b) => a.roleName.localeCompare(b.roleName)));
    setSelectedId(result.role.id);
    setCreateOpen(false);
    toast({ title: "Role created", description: result.role.roleName });
  }

  return (
    <>
      <div className="access-split">
        <aside className="border-r border-[var(--access-rule-line)] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--access-muted)]">
              Roles
            </span>
            {permissions.canCreateRoles && (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="text-[var(--access-accent)] hover:opacity-80"
                aria-label="New role"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-0.5 overflow-y-auto max-h-[480px] scrollbar-thin">
            {roles.map((role) => {
              const active = role.id === selectedId;
              const builtin = BUILTIN_ROLES.has(role.roleName);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedId(role.id)}
                  className={cn(
                    "text-left px-2.5 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-[var(--access-grant-bg)] text-[var(--access-grant)] font-medium"
                      : "text-[var(--access-ink)] hover:bg-slate-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        active ? "bg-[var(--access-grant)]" : "bg-[var(--access-rule-line)]",
                      )}
                    />
                    {role.roleName}
                    {builtin && (
                      <Lock size={11} className="text-[var(--access-muted)] ml-auto" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="p-5 flex flex-col gap-4 min-w-0">
          {!selected ? (
            <p className="text-sm text-[var(--access-muted)]">Select a role to edit.</p>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 max-w-sm">
                  <label className="text-xs text-[var(--access-muted)] block mb-1">
                    Role name
                  </label>
                  <Input
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      setDirty(true);
                    }}
                    disabled={!permissions.canEditRoles || BUILTIN_ROLES.has(selected.roleName)}
                    className="font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-[var(--access-muted)]">
                  {hasWildcard
                    ? "Full access"
                    : `${draftPermissions.length} permission${draftPermissions.length === 1 ? "" : "s"}`}
                </p>
              </div>

              {hasWildcard ? (
                <div className="rounded-md border border-[var(--access-grant)] bg-[var(--access-grant-bg)] px-4 py-3 text-sm text-[var(--access-grant)]">
                  This role has wildcard access (<code className="access-code">*</code>) — all
                  permissions are granted.
                </div>
              ) : (
                <PermissionMatrix
                  value={draftPermissions}
                  onChange={(next) => {
                    setDraftPermissions(next);
                    setDirty(true);
                  }}
                  readOnly={!permissions.canEditRoles}
                />
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--access-rule-line)]">
                {permissions.canEditRoles && (
                  <Button
                    onClick={handleSave}
                    disabled={!dirty || saving || !draftName.trim()}
                    className="!bg-[var(--access-accent)] hover:!bg-blue-700"
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                )}
                {permissions.canDeleteRoles && !BUILTIN_ROLES.has(selected.roleName) && (
                  <Button variant="outline" onClick={handleDelete}>
                    Delete role
                  </Button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      <CreateRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </>
  );
}
