/**
 * PaySmall Authentication API
 *
 * Backed by Better Auth — fetched live from:
 *   https://paysmall-api-production.up.railway.app/api/v1/auth/open-api/generate-schema
 *
 * Auth server base: /api/v1/auth  (separate from the application API at /api/v1)
 *
 * Key endpoints used:
 *   POST /sign-in/email   → { token, user, redirect }
 *   POST /sign-up/email   → { token, user }
 *   POST /sign-out        → { success }
 *   GET  /get-session     → { session, user }
 *
 * Storage:
 *   Token is written to / read from localStorage[TOKEN_KEY].
 *   TOKEN_KEY is imported from lib/api.ts — that is the ONLY definition of
 *   the key string. getToken() in lib/api.ts reads from that same key.
 */

import { TOKEN_KEY } from "./api";

// ── Auth base URL ──────────────────────────────────────────────────────────────
// Better Auth lives under /auth, separate from the application API paths.
const AUTH_BASE =
  process.env.NEXT_PUBLIC_AUTH_BASE_URL ??
  (process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1$/, "/api/v1/auth")
    : "http://localhost:3001/api/v1/auth");

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  permissions: string[];
}

export interface BetterAuthSession {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  impersonatedBy: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  image?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: BetterAuthUser;
}

export interface SessionResponse {
  session: BetterAuthSession;
  user: BetterAuthUser;
}

// ── Internal helper ────────────────────────────────────────────────────────────

class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AuthError";
  }
}

function unwrapPayload<T>(data: unknown): T {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (record.data && typeof record.data === "object") {
      return record.data as T;
    }
  }

  return data as T;
}

async function authFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${AUTH_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && typeof (data as { message?: unknown }).message === "string" && (data as { message?: string }).message) ||
      `Auth request failed (${res.status})`;
    throw new AuthError(res.status, message);
  }

  return unwrapPayload<T>(data);
}

// ── Token helpers ──────────────────────────────────────────────────────────────
// These are the ONLY places that write/erase TOKEN_KEY.
// Reading is done by getToken() in lib/api.ts — same key, guaranteed.

function persistToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function storedToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// ── Public auth API ────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /sign-in/email
   *
   * On success:
   *   - Stores the returned token in localStorage[TOKEN_KEY] ("paysmall_token")
   *   - Returns { token, user }
   *
   * getToken() in lib/api.ts reads from localStorage[TOKEN_KEY] — the same key.
   */
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const data = await authFetch<{
      token: string;
      user: BetterAuthUser;
      redirect: boolean;
    }>("/sign-in/email", {
      method: "POST",
      body: JSON.stringify({ ...input, rememberMe: input.rememberMe ?? true }),
    });

    persistToken(data.token);
    return { token: data.token, user: data.user };
  },

  /**
   * POST /sign-up/email
   *
   * On success:
   *   - Stores the returned token (if present) in localStorage[TOKEN_KEY]
   *   - Returns { token, user }
   */
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const data = await authFetch<{
      token: string | null;
      user: BetterAuthUser;
    }>("/sign-up/email", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (data.token) {
      persistToken(data.token);
    }

    return { token: data.token ?? "", user: data.user };
  },

  /**
   * POST /sign-out
   *
   * Calls the server-side sign-out (invalidates the session on the backend)
   * then clears the token from localStorage.
   */
  logout: async (): Promise<void> => {
    const token = storedToken();
    try {
      await authFetch<{ success: boolean }>("/sign-out", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify({}),
      });
    } finally {
      // Always clear locally, even if the server call fails.
      clearToken();
    }
  },

  /**
   * GET /get-session
   *
   * Validates the current token with the server.
   * Returns null if there is no token or the session is invalid.
   */
  getSession: async (): Promise<SessionResponse | null> => {
    const token = storedToken();
    if (!token) return null;

    try {
      return await authFetch<SessionResponse>("/get-session", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return null;
    }
  },
};

export { AuthError };
