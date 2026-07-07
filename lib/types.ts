// Types derived from application-api.json (OpenAPI 3.1.1 — PaySmall API V1)

// ── Generic wrappers ──────────────────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Standard paginated response used by list endpoints */
export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginatedMeta;
  success: boolean;
  message: string;
}

// ── Campaigns (/campaigns) ────────────────────────────────────────────────────

export type CampaignStatus = "draft" | "active" | "closed";
export type DispatchMethod = "email_only" | "email_and_sms";
export type MemberStatus = "pending" | "paid" | "expired";

export interface Campaign {
  id: string;
  organizerId: string;
  title: string;
  description: string | null;
  targetAmount: string | null;
  currentBalance: string;
  dispatchMethod: DispatchMethod;
  smsFeeExpected: string;
  isSmsFeePaid: boolean;
  status: CampaignStatus;
  deadline: string; // ISO date-time
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignInput {
  title: string; // min 3 chars
  description?: string | null;
  targetAmount?: string | null;
  dispatchMethod?: DispatchMethod;
  deadline: string; // ISO date-time, required
}

export interface UpdateCampaignInput {
  title?: string;
  description?: string | null;
  targetAmount?: string | null;
  dispatchMethod?: DispatchMethod;
  status?: CampaignStatus;
  deadline?: string;
}

// ── Campaign members (/campaigns/{campaignId}/members) ────────────────────────

export interface CampaignMember {
  id: string;
  campaignId: string;
  guestName: string;
  guestEmail: string | null;
  phoneNumber: string | null;
  accountReference: string; // Nomba virtual account reference
  accountNumber: string | null;
  bankName: string | null;
  amountExpected: string;
  status: MemberStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  campaignId: string;
  memberId: string | null;
  amount: string;
  reference: string;
  rawPayload: unknown;
  createdAt: string;
}

export interface AddMemberInput {
  guestName: string; // min 2 chars
  guestEmail?: string | null;
  phoneNumber?: string | null;
  amountExpected: string;
}

// ── Banks / Transfers (/transfers/banks) ──────────────────────────────────────

export interface Bank {
  code: string;
  name: string;
}

export interface BankLookupInput {
  bankCode: string;
  accountNumber: string;
}

export interface BankLookupResult {
  accountNumber: string;
  accountName: string;
}

// ── Organiser Profile (/profile) ──────────────────────────────────────────────

export interface OrganizerProfile {
  id: string;
  userId: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  phoneNumber: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyBankInput {
  bankCode: string; // 3-10 chars
  accountNumber: string;
  phoneNumber: string; // min 6 chars
}

// ── Current User (/users/me) ──────────────────────────────────────────────────

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Newsletter (/newsletter) ──────────────────────────────────────────────────

export type SubscriberStatus = "subscribed" | "unsubscribed";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  createdAt: string; // ISO date-time
}

/** POST /newsletter */
export interface SubscribeInput {
  email: string;
}

// ── Contact (/contact) ────────────────────────────────────────────────────────

export type ContactStatus = "pending" | "replied" | "archived";

export interface ContactRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

/** POST /contact */
export interface ContactInput {
  firstName: string; // min 2 chars
  lastName: string;  // min 2 chars
  email: string;
  subject?: string | null;
  message: string; // min 5 chars
}

// ── Admin (/admin) ────────────────────────────────────────────────────────────

/** POST /admin/invite */
export interface AdminInviteInput {
  email: string;
  name: string;
  permissions: string[];
}

/** POST /admin/accept-invite */
export interface AcceptInviteInput {
  token: string;
  name: string;    // min 2 chars
  password: string; // min 8 chars
}

export interface AcceptInviteResponse {
  success: boolean;
  message: string;
  token?: string | null; // session token for automatic login
}
