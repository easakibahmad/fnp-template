"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { usePopover, useDismiss } from "./usePopover";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
  step?: number;
  startHour?: number;
  endHour?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  min,
  step = 15,
  startHour = 6,
  endHour = 22,
  disabled,
  className,
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { triggerRef, popoverRef, pos } = usePopover(open, 280);
  useDismiss(open, () => setOpen(false), [triggerRef, popoverRef]);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const slots = React.useMemo(() => {
    const arr: string[] = [];
    const total = (endHour - startHour) * 60;
    for (let m = 0; m <= total; m += step) {
      const h = startHour + Math.floor(m / 60);
      const mm = m % 60;
      arr.push(
        `${h.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`,
      );
    }
    return arr;
  }, [startHour, endHour, step]);

  const visible = React.useMemo(() => {
    if (!min) return slots;
    return slots.filter((s) => s > min);
  }, [slots, min]);

  React.useEffect(() => {
    if (!open) return;
    const target = value || visible[0];
    if (!target) return;
    const t = setTimeout(() => {
      const el = listRef.current?.querySelector<HTMLElement>(
        `[data-time="${target}"]`,
      );
      if (el && listRef.current) {
        const list = listRef.current;
        list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
      }
    }, 30);
    return () => clearTimeout(t);
  }, [open, value, visible]);

  const display = value ? formatTime(value) : "";

  const popoverStyle: React.CSSProperties | null = pos
    ? {
        position: "fixed",
        top: pos.flipUp ? undefined : pos.top,
        bottom: pos.flipUp ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        width: Math.max(pos.width, 160),
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
        aria-haspopup="listbox"
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
        <Clock size={14} className="text-gray-400 shrink-0" />
      </button>

      {open &&
        popoverStyle &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="bg-white rounded-lg border border-gray-100 shadow-dialog overflow-hidden"
          >
            <div
              ref={listRef}
              role="listbox"
              className="max-h-[260px] overflow-y-auto scrollbar-thin py-1"
            >
              {visible.length === 0 ? (
                <div className="text-sm text-gray-400 px-3 py-3 text-center">
                  No available times.
                </div>
              ) : (
                visible.map((slot) => (
                  <button
                    key={slot}
                    data-time={slot}
                    type="button"
                    role="option"
                    aria-selected={slot === value}
                    onClick={() => {
                      onChange(slot);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-1.5 text-sm text-left transition-colors",
                      slot === value
                        ? "bg-gray-900 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {formatTime(slot)}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
