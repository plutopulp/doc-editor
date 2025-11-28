import { DocumentCard } from "@/components/document-card";
import { backendClient, DocumentListSchema, DocumentList } from "@/lib/api";

/**
 * Home page - displays a list of all documents
 */
export default async function HomePage() {
  let documents: DocumentList = [];
  let error: string | null = null;

  try {
    const res = await backendClient("/documents");

    if (!res.ok) {
      error = "Failed to load documents";
      documents = [];
    } else {
      const json = await res.json();
      documents = DocumentListSchema.parse(json);
    }
  } catch {
    error = "Failed to load documents";
    documents = [];
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Your Documents
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!error && documents.length === 0 && (
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
