"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Error boundary for document page
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Document page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded max-w-md">
        <h2 className="font-semibold mb-2">Failed to load document</h2>
        <p className="text-sm mb-4">
          There was an error loading this document. Please try again.
        </p>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
