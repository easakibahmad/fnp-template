import Link from "next/link";
import { ChevronLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-100 shadow-card mb-5">
          <Compass size={20} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="text-2xs uppercase tracking-wide text-gray-400 mb-1">
          404 - Not Found
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          We couldn't find that page
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          The page may have moved, or you may not have access to it.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mt-6 h-9 px-4 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={14} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
