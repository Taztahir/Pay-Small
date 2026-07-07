/**
 * PaySmall API client
 * Derived from application-api.json (OpenAPI 3.1.1) — Application API
 *
 * Auth: Better Auth Bearer token, stored in localStorage under TOKEN_KEY.
 * The auth endpoints live at a separate base URL; see lib/auth.ts.
 */

// ── Shared storage key ────────────────────────────────────────────────────────
// THIS is the single source of truth for where the token is stored.
// lib/auth.ts writes here; getToken() reads from here.
// If you ever rename this key, change it ONLY here — everything else follows.
export const TOKEN_KEY = "paysmall_token" as const;

// ── API base URL ──────────────────────────────────────────────────────────────
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

// ── Error class ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// ── Request options ───────────────────────────────────────────────────────────

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Pass a token explicitly, or let getToken() pull from localStorage. */
  token?: string;
  query?: Record<string, string | number | undefined>;
};

// ── Token accessor ────────────────────────────────────────────────────────────

/**
 * Reads the Bearer token from localStorage.
 * Key: TOKEN_KEY ("paysmall_token")
 * Written by: authApi.login() and authApi.register() in lib/auth.ts
 */
export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(TOKEN_KEY) ?? undefined;
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, query } = options;
  const token = options.token ?? getToken();

  const url = new URL(BASE_URL + path, "http://placeholder");
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const finalUrl = BASE_URL.startsWith("http")
    ? url.toString().replace("http://placeholder", "")
    : BASE_URL + path + (url.search || "");

  const res = await fetch(finalUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message as string)) || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}
