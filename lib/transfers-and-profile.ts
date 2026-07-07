import { apiFetch } from "./api";
import type {
  ApiEnvelope,
  Bank,
  BankLookupInput,
  BankLookupResult,
  OrganizerProfile,
  VerifyBankInput,
} from "./types";

export const transfersApi = {
  listBanks: () => apiFetch<ApiEnvelope<Bank[]>>("/transfers/banks"),

  lookupAccount: (input: BankLookupInput) =>
    apiFetch<ApiEnvelope<BankLookupResult>>("/transfers/banks/lookup", {
      method: "POST",
      body: input,
    }),
};

export const profileApi = {
  // saves + verifies the organizer's payout bank account via Nomba
  verifyBank: (input: VerifyBankInput) =>
    apiFetch<ApiEnvelope<OrganizerProfile>>("/profile/bank", {
      method: "POST",
      body: input,
    }),

  get: () => apiFetch<ApiEnvelope<OrganizerProfile>>("/profile"),
};
