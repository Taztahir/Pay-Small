/**
 * Contact API module — PaySmall API V1
 *
 * Public:
 *   POST /contact             — submit a contact/inquiry form
 *
 * Admin (Bearer token required):
 *   GET  /contact             — list all contact requests (paginated)
 *   GET  /contact/{id}        — get a single contact record
 */

import { apiFetch } from "./api";
import type {
  ApiEnvelope,
  Paginated,
  ContactRequest,
  ContactInput,
  ContactStatus,
} from "./types";

export const contactApi = {
  /**
   * POST /contact
   * Submit a new contact or inquiry form. No auth required.
   */
  submit: (input: ContactInput) =>
    apiFetch<ApiEnvelope<ContactRequest>>("/contact", {
      method: "POST",
      body: input,
    }),

  /**
   * GET /contact
   * List all contact requests (paginated). Requires Bearer token.
   */
  list: (params?: {
    page?: number;
    limit?: number;
    status?: ContactStatus;
  }) =>
    apiFetch<Paginated<ContactRequest>>("/contact", { query: params }),

  /**
   * GET /contact/{id}
   * Retrieve a single contact record. Requires Bearer token.
   */
  get: (id: string) =>
    apiFetch<ApiEnvelope<ContactRequest>>(`/contact/${id}`),
};
