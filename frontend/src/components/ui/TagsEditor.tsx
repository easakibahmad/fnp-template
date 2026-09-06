"use client";
import * as React from "react";
import { X, Plus } from "lucide-react";
import { Input } from "./Input";
import { cn } from "@/lib/utils";

interface Props {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TagsEditor({ values, onChange, placeholder = "Add...", className }: Props) {
  const [draft, setDraft] = React.useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) {
      setDraft("");
      return;
    }
    onChange([...values, v]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(values.filter((v) => v !== tag));
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-0.5"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="text-gray-400 hover:text-rose-500 -mr-0.5"
              aria-label={`Remove ${v}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <span className="text-xs text-gray-400 italic">No items added.</span>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim()}
          className="h-9 px-3 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  );
}
