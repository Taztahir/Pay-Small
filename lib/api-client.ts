/**
 * Central export for all PaySmall API modules.
 *
 * Usage:
 *   import { campaignsApi, newsletterApi, contactApi } from "@/lib/api-client"
 */

export { apiFetch, ApiError } from "./api";

export { campaignsApi, membersApi } from "./campaigns";
export { transfersApi, profileApi } from "./transfers-and-profile";
export { newsletterApi } from "./newsletter";
export { contactApi } from "./contact";
export { adminApi, usersApi } from "./admin";
export { authApi } from "./auth";

export type * from "./types";
