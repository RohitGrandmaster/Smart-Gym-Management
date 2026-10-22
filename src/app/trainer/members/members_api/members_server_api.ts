// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server-side API fetching for the members module.
import { ssrApiFetch } from '@/lib/server-api';
import type { ApiResponse } from '@/lib/api';
import { MembersUrlConfig } from '@/app/trainer/members/members_url_config';

export const ssrMembersApi = {
  fetchMembers: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<unknown>>(`${MembersUrlConfig.BACKEND_API.BASE}${q}`);
  },
  fetchMemberStats: () => ssrApiFetch<ApiResponse<unknown>>(MembersUrlConfig.BACKEND_API.STATS),
};

