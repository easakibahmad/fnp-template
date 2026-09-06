"use client";
import { cn } from "@/lib/utils";

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

interface Props {
  values: number[];
  onChange: (next: number[]) => void;
  className?: string;
}

export function DayToggle({ values, onChange, className }: Props) {
  function toggle(day: number) {
    if (values.includes(day)) {
      onChange(values.filter((d) => d !== day));
    } else {
      onChange([...values, day].sort((a, b) => a - b));
    }
  }
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {DAYS.map((d) => {
        const on = values.includes(d.value);
        return (
          <button
            key={d.value}
            type="button"
            onClick={() => toggle(d.value)}
            className={cn(
              "h-9 w-12 rounded-md text-xs font-medium border transition-colors",
              on
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
            )}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
