import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Calls the FastAPI backend over the Docker network.
 *
 * @param path - API endpoint path (e.g. "/health")
 * @param method - HTTP method (default: "GET")
 * @param body - Optional request body (will be JSON stringified)
 * @returns Response object from fetch
 */
export async function backendClient(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;

  return fetch(url, {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
