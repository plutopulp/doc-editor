import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Calls the FastAPI backend over the Docker network.
 *
 * @param path - API endpoint path (e.g. "/health")
 * @param method - HTTP method (default: "GET")
 * @returns Response object from fetch
 */
export async function backendClient(
  path: string,
  method: HttpMethod = "GET"
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;

  return fetch(url, {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
