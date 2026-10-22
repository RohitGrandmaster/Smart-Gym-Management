// RESPONSIBILITY: Server-side API fetching for the members module.
import { ssrApiFetch } from '@/lib/server-api';
import type { ApiResponse } from '@/lib/api';
import { MembersUrlConfig } from '@/app/manager/members/ManagerMembersUrlConfig';

export const ssrMembersApi = {
  getAll: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${MembersUrlConfig.BACKEND_API.BASE}${q}`);
  },
  getStats: () => ssrApiFetch<ApiResponse<Record<string, unknown>>>(MembersUrlConfig.BACKEND_API.STATS),
};
