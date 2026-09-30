export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 400, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "rosado.token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable (private browsing, etc.) -- fail silently.
  }
}

function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      search.set(key, value.join(","));
    } else {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, unknown>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query } = options;
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${path}${buildQueryString(query)}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = (data && typeof data === "object" && "message" in data && typeof data.message === "string")
      ? data.message
      : "Something went wrong. Please try again.";
    const code = data && typeof data === "object" && "code" in data && typeof data.code === "string" ? data.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  return data as T;
}

export function apiGet<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  return apiRequest<T>(path, { method: "GET", query });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, { method: "POST", body: body ?? {} });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" });
}
