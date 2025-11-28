import { NextResponse } from "next/server";
import { backendClient, HealthSchema } from "@/lib/api";

/**
 * Health check proxy endpoint.
 * Calls FastAPI /health and validates response.
 */
export async function GET() {
  try {
    const res = await backendClient("/health");

    if (!res.ok) {
      return NextResponse.json(
        { message: "Upstream health check failed" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const parsed = HealthSchema.parse(json);

    return NextResponse.json(parsed, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Health check failed", error: "upstream_unreachable" },
      { status: 502 }
    );
  }
}
