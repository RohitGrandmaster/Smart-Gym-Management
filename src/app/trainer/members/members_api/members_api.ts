// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides isolated data fetching methods for the members module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { MembersUrlConfig } from '@/app/trainer/members/members_url_config';
import type { Member, MemberStats } from '@/app/trainer/trainer_types/trainer_types';

export const membersApi = {
  fetchMembers: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ members: Member[]; total: number; page: number; limit: number }>>(`${MembersUrlConfig.BACKEND_API.BASE}${q}`);
  },
  fetchMemberById: (id: string) => apiFetch<ApiResponse<Member>>(MembersUrlConfig.BACKEND_API.GET_ONE(id)),
  fetchMemberStats: () => apiFetch<ApiResponse<MemberStats>>(MembersUrlConfig.BACKEND_API.STATS),
  createMember: (body: Partial<Member>) =>
    apiFetch<ApiResponse<Member>>(MembersUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateMember: (id: string, body: Partial<Member>) =>
    apiFetch<ApiResponse<Member>>(MembersUrlConfig.BACKEND_API.UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  deleteMember: (id: string) => apiFetch<ApiResponse<{ id: string }>>(MembersUrlConfig.BACKEND_API.DELETE(id), { method: 'DELETE' }),
  renew: (id: string, body: unknown) =>
    apiFetch<ApiResponse<Member>>(MembersUrlConfig.BACKEND_API.RENEW(id), { method: 'POST', body: JSON.stringify(body) }),
};

