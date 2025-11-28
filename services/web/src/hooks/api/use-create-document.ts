import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DocumentResponse, DocumentCreate } from "@/lib/api";

export function useCreateDocument() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const clearError = () => setError(null);

  return {
    createDocument,
    isCreating,
    error,
    clearError,
  };
}
