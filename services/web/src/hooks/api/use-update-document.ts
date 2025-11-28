import { useState } from "react";
import type { DocumentResponse, DocumentUpdate } from "@/lib/api";

export function useUpdateDocument() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDocument = async (id: string, data: DocumentUpdate) => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update document");
      }

      const document: DocumentResponse = await res.json();
      setIsUpdating(false);

      return document;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update document";
      setError(message);
      setIsUpdating(false);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return {
    updateDocument,
    isUpdating,
    error,
    clearError,
  };
}
