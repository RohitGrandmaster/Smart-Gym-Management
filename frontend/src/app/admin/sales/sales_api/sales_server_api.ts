// RESPONSIBILITY: Server-side API fetching for the sales module.
import { ssrApiFetch } from '@/lib/server-api';
import { SalesUrlConfig } from '@/app/admin/sales/sales_url_config';
import type { ApiResponse } from '@/lib/api';

export const ssrSalesApi = {
  fetchOverview: () => ssrApiFetch<ApiResponse<Record<string, unknown>>>(SalesUrlConfig.BACKEND_API.OVERVIEW),
  fetchMembershipReport: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.MEMBERSHIP_REPORT}${q}`);
  },
  fetchPendingPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.PENDING_PAYMENTS}${q}`);
  },
  fetchAllMemberships: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.ALL_MEMBERSHIPS}${q}`);
  },
};
