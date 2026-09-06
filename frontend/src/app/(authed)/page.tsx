"use client";

import { useTransition } from "react";
import { LogOut, Loader2, Sparkles } from "lucide-react";
import { logout } from "@/app/actions";

export default function EmptyStatePage() {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl p-10 text-center relative z-10 overflow-hidden">
        {/* Decorative subtle gradient border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />

        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/50 shadow-inner">
            <Sparkles className="text-indigo-500" size={28} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-3">
          Nothing here yet
        </h1>

        <p className="text-slate-500 text-sm mb-10 leading-relaxed max-w-[280px] mx-auto">
          Your workspace is currently being set up. Please check back later when your access has been configured.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => startTransition(() => logout())}
            disabled={isPending}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors h-10 px-4 rounded-full hover:bg-slate-100/50"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
