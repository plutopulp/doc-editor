import { notFound } from "next/navigation";
import { Editor } from "@/components/editor";
import { backendClient, DocumentResponseSchema } from "@/lib/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Document editor page - displays a single document for editing
 */
export default async function DocumentPage({ params }: PageProps) {
  const { id } = await params;

  const res = await backendClient(`/documents/${id}`);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to load document");
  }

  const json = await res.json();
  const document = DocumentResponseSchema.parse(json);

  return <Editor initialDocument={document} />;
}
