"use client";
import * as React from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "info" | "error";
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}
interface ToastContextValue {
  toast: (t: { title: string; description?: string; tone?: ToastTone }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const toast = React.useCallback<ToastContextValue["toast"]>(({ title, description, tone = "success" }) => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, title, description, tone }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto bg-white rounded-lg shadow-dialog border border-gray-100 px-4 py-3 flex items-start gap-3 min-w-[280px]",
              "animate-in",
            )}
            role="status"
          >
            {t.tone === "success" && (
              <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
            )}
            {t.tone === "error" && (
              <span className="h-4 w-4 rounded-full bg-rose-500 shrink-0 mt-0.5 flex items-center justify-center">
                <X size={12} className="text-white" strokeWidth={3} />
              </span>
            )}
            {t.tone === "info" && (
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{t.title}</div>
              {t.description && (
                <div className="text-xs text-gray-500 mt-0.5">{t.description}</div>
              )}
            </div>
            <button
              className="text-gray-400 hover:text-gray-700"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
