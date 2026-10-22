// RESPONSIBILITY: API client for Admin Members module. All fetch calls go through apiFetch wrapper.
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { AdminMember, AdminMembersSummary } from '@/app/admin/members/members_types/AdminMembersTypes';

export const ADMIN_MEMBERS_URLS = {
  list: '/admin/members',
  summary: '/admin/members/summary',
} as const;

export interface FetchMembersParams {
  search?: string;
  status?: string;
  branchId?: string;
  expiryFilter?: string;
  page?: number;
  limit?: number;
}

export const adminMembersApi = {
  fetchMembers: (params: FetchMembersParams) =>
    apiFetch<ApiResponse<AdminMember[]>>(`${ADMIN_MEMBERS_URLS.list}?${new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)]))
    )}`),
  fetchSummary: () =>
    apiFetch<ApiResponse<AdminMembersSummary>>(ADMIN_MEMBERS_URLS.summary),
};
