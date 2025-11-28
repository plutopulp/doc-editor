import { DocumentCard } from "@/components/document-card";
import { backendClient, DocumentListSchema } from "@/lib/api";

export default async function HomePage() {
  const res = await backendClient("/documents");

  if (!res.ok) {
    throw new Error("Failed to load documents");
  }

  const json = await res.json();
  const documents = DocumentListSchema.parse(json);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Your Documents
        </h1>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg mb-4">No documents yet</p>
            <p className="text-slate-400 text-sm">
              Click &ldquo;New Document&rdquo; to create your first document
            </p>
          </div>
        )}

        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
