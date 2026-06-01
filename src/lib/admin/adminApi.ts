import { getAdminToken, clearAdminSession } from "./AdminAuthContext";

/**
 * Fetch wrapper for the admin API. Attaches the Bearer token, parses JSON, and
 * on a 401/403 clears the session so the UI returns to the login screen.
 * All paths are same-origin (/api/admin/*), proxied to the backend by server.ts.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api/admin${path}`, { ...init, headers });

  if (res.status === 401 || res.status === 403) {
    clearAdminSession();
    throw new Error("Your session expired. Please sign in again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any)?.message || (data as any)?.error || "Request failed.");
  }
  // Backend wraps payloads as { data } or { success, data }.
  return ((data as any)?.data ?? data) as T;
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
};
