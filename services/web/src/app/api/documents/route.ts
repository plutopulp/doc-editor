import { NextRequest, NextResponse } from "next/server";
import {
  backendClient,
  DocumentCreateSchema,
  DocumentListSchema,
  DocumentResponseSchema,
} from "@/lib/api";

/**
 * POST /api/documents - Create a new document
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = DocumentCreateSchema.parse(body);

    // Call FastAPI backend
    const res = await backendClient("/documents", "POST", validated);

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return NextResponse.json(error, { status: res.status });
    }

    // Validate and return response
    const json = await res.json();
    const document = DocumentResponseSchema.parse(json);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create document" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documents - List all documents
 */
export async function GET() {
  try {
    const res = await backendClient("/documents");

    if (!res.ok) {
      const error = await res
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return NextResponse.json(error, { status: res.status });
    }

    // Validate and return response
    const json = await res.json();
    const documents = DocumentListSchema.parse(json);

    return NextResponse.json(documents, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
