"use client";
import * as React from "react";

interface PopoverPos {
  top: number;
  left: number;
  width: number;
  flipUp: boolean;
}

export function usePopover(open: boolean, popoverHeight: number = 320) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<PopoverPos | null>(null);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }
    function compute() {
      const t = triggerRef.current;
      if (!t) return;
      const rect = t.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const flipUp = spaceBelow < popoverHeight && rect.top > popoverHeight;
      setPos({
        top: flipUp ? rect.top - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        flipUp,
      });
    }
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open, popoverHeight]);

  // Force re-render once popover mounts (if needed)
  React.useEffect(() => {
    if (open) setTick((t) => t + 1);
  }, [open]);

  return { triggerRef, popoverRef, pos };
}

export function useDismiss(
  open: boolean,
  close: () => void,
  refs: React.RefObject<HTMLElement | null>[],
) {
  React.useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      for (const r of refs) {
        if (r.current?.contains(target)) return;
      }
      close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
    // refs is stable (caller passes array of refs); deps intentionally minimal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
