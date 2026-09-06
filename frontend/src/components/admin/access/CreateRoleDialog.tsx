"use client";

import * as React from "react";
import { FormDialog, FormField } from "@/components/ui/FormDialog";
import { Input } from "@/components/ui/Input";
import { PermissionMatrix } from "./PermissionMatrix";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (roleName: string, permissions: string[]) => Promise<void>;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateRoleDialogProps) {
  const [name, setName] = React.useState("");
  const [permissions, setPermissions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      setName("");
      setPermissions([]);
    }
  }, [open]);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New role"
      description="Define a role name and the permissions it grants."
      submitLabel="Create role"
      disabled={!name.trim()}
      onSubmit={async () => {
        await onCreate(name.trim(), permissions);
      }}
      className="max-w-lg"
    >
      <FormField label="Role name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="care_manager_ops"
          className="font-mono"
        />
      </FormField>
      <FormField label="Permissions">
        <PermissionMatrix value={permissions} onChange={setPermissions} />
      </FormField>
    </FormDialog>
  );
}
