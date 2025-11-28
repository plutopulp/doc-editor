import { NextRequest, NextResponse } from "next/server";
import { backendClient, DocumentResponseSchema } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/documents/[id] - Fetch a single document by ID
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    // Call FastAPI backend
    const res = await backendClient(`/documents/${id}`);

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return NextResponse.json(error, { status: res.status });
    }

    // Validate and return response
    const json = await res.json();
    const document = DocumentResponseSchema.parse(json);

    return NextResponse.json(document, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch document" },
      { status: 500 }
    );
  }
}
