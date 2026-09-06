"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./Calendar";
import { usePopover, useDismiss } from "./usePopover";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  min,
  max,
  disabled,
  className,
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { triggerRef, popoverRef, pos } = usePopover(open, 320);
  useDismiss(open, () => setOpen(false), [triggerRef, popoverRef]);

  const display = value ? formatDateDisplay(value) : "";
  const popoverStyle: React.CSSProperties | null = pos
    ? {
        position: "fixed",
        top: pos.flipUp ? undefined : pos.top,
        bottom: pos.flipUp ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        zIndex: 60,
      }
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "h-9 w-full inline-flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm transition outline-none",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-600/15",
          value ? "text-gray-900" : "text-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          open && "border-blue-500 ring-2 ring-blue-600/15",
          className,
        )}
      >
        <span className="truncate">{display || placeholder}</span>
        <CalendarIcon size={14} className="text-gray-400 shrink-0" />
      </button>

      {open &&
        popoverStyle &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="bg-white rounded-lg border border-gray-100 shadow-dialog"
          >
            <Calendar
              value={value}
              onChange={(v) => {
                onChange(v);
                setOpen(false);
              }}
              min={min}
              max={max}
            />
          </div>,
          document.body,
        )}
    </>
  );
}

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
