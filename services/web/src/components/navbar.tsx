"use client";

import Link from "next/link";
import { useCreateDocument } from "@/hooks/api";

/**
 * Navigation bar displayed across all pages
 */
export const Navbar: React.FC = () => {
  const { createDocument, isCreating } = useCreateDocument();

  const handleNewDocument = async () => {
    try {
      await createDocument({
        title: "Untitled Document",
        content: "",
      });
    } catch {
      // Hack for now, not enough time to implement a proper error handling
      console.error("Failed to create document. Please try again.");
    }
  };

  return (
    <nav className="w-full border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-semibold text-slate-800 hover:text-slate-600 transition-colors"
        >
          Document Editor
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors"
        >
          All Documents
        </Link>

        <button
          onClick={handleNewDocument}
          disabled={isCreating}
          className="px-3 py-1.5 text-sm bg-slate-800 text-white hover:bg-slate-700 disabled:bg-slate-400 rounded transition-colors"
        >
          {isCreating ? "Creating..." : "New Document"}
        </button>
      </div>
    </nav>
  );
};
