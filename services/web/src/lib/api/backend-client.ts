import { API_BASE_URL } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
