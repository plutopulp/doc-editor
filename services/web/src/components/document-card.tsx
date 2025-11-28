import Link from "next/link";
import type { DocumentSummary } from "@/lib/api";

type DocumentCardProps = {
  document: DocumentSummary;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const createdDate = new Date(document.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const updatedDate = new Date(document.updated_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Link
      href={`/documents/${document.id}`}
      className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate">
        {document.title}
      </h3>

      <div className="flex flex-col gap-1 text-xs text-slate-500">
        <div>
          <span className="font-medium">Created:</span> {createdDate}
        </div>
        <div>
          <span className="font-medium">Last updated:</span> {updatedDate}
        </div>
      </div>
    </Link>
  );
};
