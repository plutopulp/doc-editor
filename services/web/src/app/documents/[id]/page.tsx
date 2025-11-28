"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@/components/editor";
import { DocumentResponseSchema, DocumentResponse } from "@/lib/api";

export default function DocumentPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      const id = params.id as string;

      try {
        const res = await fetch(`/api/documents/${id}`);

        if (res.status === 404) {
          router.push("/404");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load document");
        }

        const json = await res.json();
        const doc = DocumentResponseSchema.parse(json);
        setDocument(doc);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return <Editor initialDocument={document} />;
}
