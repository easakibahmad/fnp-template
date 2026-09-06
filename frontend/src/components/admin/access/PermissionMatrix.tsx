"use client";

import * as React from "react";
import {
  ALL_ASSIGNABLE_PERMISSIONS,
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
  type PermissionKey,
} from "@/lib/permissions";
import { cn } from "@/lib/utils";

interface PermissionMatrixProps {
  value: string[];
  onChange: (next: string[]) => void;
  readOnly?: boolean;
}

export function PermissionMatrix({
  value,
  onChange,
  readOnly = false,
}: PermissionMatrixProps) {
  const granted = new Set(value);

  function toggle(perm: PermissionKey) {
    if (readOnly) return;
    const next = new Set(granted);
    if (next.has(perm)) next.delete(perm);
    else next.add(perm);
    onChange(Array.from(next));
  }

  return (
    <div className="flex flex-col gap-4">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.domain}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--access-muted)]">
              {group.domain}
            </span>
            <div className="flex-1 h-px bg-[var(--access-rule-line)]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {group.permissions.map((perm) => {
              const on = granted.has(perm);
              return (
                <label
                  key={perm}
                  className={cn(
                    "access-perm-row flex items-center gap-3 px-3 py-2 rounded-md border transition-colors cursor-pointer",
                    on
                      ? "border-[var(--access-grant)] bg-[var(--access-grant-bg)]"
                      : "border-transparent hover:bg-slate-50",
                    readOnly && "cursor-default opacity-80",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={readOnly}
                    onChange={() => toggle(perm)}
                    className="rounded border-[var(--access-rule-line)] text-[var(--access-accent)] focus:ring-[var(--access-accent)]"
                  />
                  <span className="flex flex-col min-w-0">
                    <code className="access-code truncate">{perm}</code>
                    <span className="text-2xs text-[var(--access-muted)] mt-0.5">
                      {PERMISSION_LABELS[perm]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export { ALL_ASSIGNABLE_PERMISSIONS };
