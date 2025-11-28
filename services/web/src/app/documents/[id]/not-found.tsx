import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Document not found
        </h2>
        <p className="text-slate-600 mb-4">
          The document you&rsquo;re looking for doesn&rsquo;t exist.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
          Go back to all documents
        </Link>
      </div>
    </div>
  );
}
