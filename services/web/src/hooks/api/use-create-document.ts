import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DocumentResponse, DocumentCreate } from "@/lib/api";

/**
 * Hook for creating new documents
 */
export function useCreateDocument() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new document and navigate to its editor
   */
  const createDocument = async (data: DocumentCreate) => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create document");
      }

      const document: DocumentResponse = await res.json();

      // Navigate to the new document's editor
      router.push(`/documents/${document.id}`);

      return document;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create document";
      setError(message);
      setIsCreating(false);
      throw err;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  return {
    createDocument,
    isCreating,
    error,
    clearError,
  };
}
