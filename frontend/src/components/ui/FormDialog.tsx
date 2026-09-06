"use client";
import * as React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  disabled?: boolean;
  onSubmit: () => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  destructive = false,
  disabled = false,
  onSubmit,
  className,
  children,
}: FormDialogProps) {
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit() {
    if (busy || disabled) return;
    setBusy(true);
    try {
      await onSubmit();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => !busy && onOpenChange(o)}
      title={title}
      description={description}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">{children}</div>
        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={busy}
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={handleSubmit}
            disabled={disabled || busy}
            type="button"
          >
            {busy ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export function FormField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
      {error ? (
        <span className="text-2xs text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-2xs text-gray-400">{hint}</span>
      ) : null}
    </div>
  );
}
