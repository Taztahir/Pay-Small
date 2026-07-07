/**
 * Admin & Users API modules — PaySmall API V1
 *
 * Admin (Bearer token required):
 *   POST /admin/invite          — invite a new admin user
 *   POST /admin/accept-invite   — accept invitation and create account (public)
 *
 * Current user (Bearer token required):
 *   GET  /users/me              — get the authenticated user's profile
 */

import { apiFetch } from "./api";
import type {
  ApiEnvelope,
  AdminInviteInput,
  AcceptInviteInput,
  AcceptInviteResponse,
  CurrentUser,
} from "./types";

export const adminApi = {
  /**
   * POST /admin/invite
   * Send an invitation email to a new admin. Requires Bearer token.
   */
  invite: (input: AdminInviteInput) =>
    apiFetch<ApiEnvelope<null>>("/admin/invite", {
      method: "POST",
      body: input,
    }),

  /**
   * POST /admin/accept-invite
   * Accept an admin invitation and create an account. No auth required.
   */
  acceptInvite: (input: AcceptInviteInput) =>
    apiFetch<AcceptInviteResponse>("/admin/accept-invite", {
      method: "POST",
      body: input,
    }),
};

export const usersApi = {
  /**
   * GET /users/me
   * Get the currently authenticated user's profile. Requires Bearer token.
   */
  me: () => apiFetch<ApiEnvelope<CurrentUser>>("/users/me"),

  /**
   * PATCH /users/me
   * Update the currently authenticated user's profile. Requires Bearer token.
   */
  update: (input: Partial<CurrentUser>) =>
    apiFetch<ApiEnvelope<CurrentUser>>("/users/me", {
      method: "PATCH",
      body: input,
    }),

  /**
   * DELETE /users/me
   * Deletes the currently authenticated user immediately. Requires Bearer token.
   */
  remove: () =>
    apiFetch<ApiEnvelope<null>>("/users/me", {
      method: "DELETE",
    }),
};
