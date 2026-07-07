import { apiFetch } from "./api";
import type {
  ApiEnvelope,
  Paginated,
  Campaign,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignMember,
  AddMemberInput,
  Transaction,
} from "./types";

export const campaignsApi = {
  create: (input: CreateCampaignInput) =>
    apiFetch<ApiEnvelope<Campaign>>("/campaigns", {
      method: "POST",
      body: input,
    }),

  list: (params?: { page?: number; limit?: number }) =>
    apiFetch<Paginated<Campaign>>("/campaigns", { query: params }),

  get: (id: string) =>
    apiFetch<ApiEnvelope<Campaign>>(`/campaigns/${id}`),

  update: (id: string, input: UpdateCampaignInput) =>
    apiFetch<ApiEnvelope<Campaign>>(`/campaigns/${id}`, {
      method: "PATCH",
      body: input,
    }),

  activate: (id: string) =>
    apiFetch<ApiEnvelope<unknown>>(`/campaigns/${id}/activate`, {
      method: "POST",
    }),

  remove: (id: string) =>
    apiFetch<ApiEnvelope<null>>(`/campaigns/${id}`, { method: "DELETE" }),

  withdraw: (id: string) =>
    apiFetch<ApiEnvelope<unknown>>(`/campaigns/${id}/withdraw`, {
      method: "POST",
    }),

  transactions: (id: string, params?: { page?: number; limit?: number }) =>
    apiFetch<Paginated<Transaction>>(`/campaigns/${id}/transactions`, {
      query: params,
    }),
};

export const membersApi = {
  add: (campaignId: string, input: AddMemberInput) =>
    apiFetch<ApiEnvelope<CampaignMember>>(
      `/campaigns/${campaignId}/members`,
      { method: "POST", body: input }
    ),

  list: (campaignId: string, params?: { page?: number; limit?: number }) =>
    apiFetch<Paginated<CampaignMember>>(
      `/campaigns/${campaignId}/members`,
      { query: params }
    ),

  remove: (campaignId: string, memberId: string) =>
    apiFetch<ApiEnvelope<null>>(
      `/campaigns/${campaignId}/members/${memberId}`,
      { method: "DELETE" }
    ),
};
