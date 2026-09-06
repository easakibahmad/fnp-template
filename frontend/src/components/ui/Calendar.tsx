"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  className?: string;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({ value, onChange, min, max, className }: Props) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const initial = value ? parseDate(value) : today;
  const [view, setView] = React.useState({
    year: initial.getFullYear(),
    month: initial.getMonth(),
  });

  React.useEffect(() => {
    if (!value) return;
    const d = parseDate(value);
    setView({ year: d.getFullYear(), month: d.getMonth() });
  }, [value]);

  const monthStart = new Date(view.year, view.month, 1);
  const monthEnd = new Date(view.year, view.month + 1, 0);
  const startWeekday = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];
  const prevMonthEnd = new Date(view.year, view.month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({
      date: new Date(view.year, view.month - 1, prevMonthEnd - i),
      inMonth: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(view.year, view.month, i), inMonth: true });
  }
  while (cells.length < 42) {
    const offset = cells.length - daysInMonth - startWeekday + 1;
    cells.push({
      date: new Date(view.year, view.month + 1, offset),
      inMonth: false,
    });
  }

  const minDate = min ? parseDate(min) : null;
  const maxDate = max ? parseDate(max) : null;
  const selected = value ? parseDate(value) : null;

  function navMonth(delta: number) {
    setView((v) => {
      const m = v.month + delta;
      return {
        year: v.year + Math.floor(m / 12),
        month: ((m % 12) + 12) % 12,
      };
    });
  }

  const monthName = monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("p-3 w-[260px]", className)}>
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          type="button"
          onClick={() => navMonth(-1)}
          className="h-7 w-7 inline-flex items-center justify-center rounded text-gray-500 hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          {monthName}
        </span>
        <button
          type="button"
          onClick={() => navMonth(1)}
          className="h-7 w-7 inline-flex items-center justify-center rounded text-gray-500 hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {DAY_LABELS.map((d, i) => (
          <div
            key={i}
            className="h-7 flex items-center justify-center text-2xs font-medium text-gray-400"
          >
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const sel = selected && sameDay(cell.date, selected);
          const dis =
            (minDate && cell.date < minDate) ||
            (maxDate && cell.date > maxDate);
          const tod = sameDay(cell.date, today);
          return (
            <button
              key={i}
              type="button"
              disabled={!!dis}
              onClick={() => onChange(toIsoDate(cell.date))}
              className={cn(
                "h-7 w-full flex items-center justify-center rounded text-xs transition-colors",
                !cell.inMonth && !sel && "text-gray-300",
                cell.inMonth && !dis && !sel && "text-gray-700 hover:bg-gray-100",
                tod && !sel && "ring-1 ring-blue-200",
                sel &&
                  "bg-gray-900 text-white hover:bg-gray-800 ring-0",
                dis && "opacity-30 cursor-not-allowed",
              )}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(toIsoDate(today))}
          className="text-2xs font-medium text-blue-600 hover:text-blue-700"
        >
          Today
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-2xs font-medium text-gray-400 hover:text-gray-700"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
