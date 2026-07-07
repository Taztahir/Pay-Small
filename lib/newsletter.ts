/**
 * Newsletter API module — PaySmall API V1
 *
 * Public:
 *   POST /newsletter          — subscribe an email
 *
 * Admin (Bearer token required):
 *   GET  /newsletter          — list all subscribers (paginated)
 *   DELETE /newsletter/{id}   — unsubscribe by subscriber ID
 */

import { apiFetch } from "./api";
import type {
  ApiEnvelope,
  Paginated,
  NewsletterSubscriber,
  SubscribeInput,
  SubscriberStatus,
} from "./types";

export const newsletterApi = {
  /**
   * POST /newsletter
   * Subscribe an email address. No auth required.
   */
  subscribe: (input: SubscribeInput) =>
    apiFetch<ApiEnvelope<NewsletterSubscriber>>("/newsletter", {
      method: "POST",
      body: input,
    }),

  /**
   * GET /newsletter
   * List all subscribers (paginated). Requires Bearer token.
   */
  list: (params?: {
    page?: number;
    limit?: number;
    status?: SubscriberStatus;
  }) =>
    apiFetch<Paginated<NewsletterSubscriber>>("/newsletter", { query: params }),

  /**
   * DELETE /newsletter/{id}
   * Unsubscribe a subscriber by their ID. Requires Bearer token.
   */
  unsubscribe: (id: string) =>
    apiFetch<ApiEnvelope<null>>(`/newsletter/${id}`, { method: "DELETE" }),
};
