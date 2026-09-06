"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-gray-200", className)} role="tablist">
      <div className="flex gap-1">
        {tabs.map((t) => {
          const active = t.id === value;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              <span className="flex items-center gap-1.5">
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-2xs font-medium",
                      active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </span>
              {active && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
