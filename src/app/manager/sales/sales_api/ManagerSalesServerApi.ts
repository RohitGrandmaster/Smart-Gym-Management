// RESPONSIBILITY: Server-side API fetching for the sales module.
import { ssrApiFetch } from '@/lib/server-api';
import { SalesUrlConfig } from '@/app/manager/sales/ManagerSalesUrlConfig';
import type { ApiResponse } from '@/lib/api';

export const ssrSalesApi = {
  getOverview: () => ssrApiFetch<ApiResponse<Record<string, unknown>>>(SalesUrlConfig.BACKEND_API.OVERVIEW),
  getMembershipReport: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.MEMBERSHIP_REPORT}${q}`);
  },
  getPendingPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.PENDING_PAYMENTS}${q}`);
  },
  getAllMemberships: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<Record<string, unknown>>>(`${SalesUrlConfig.BACKEND_API.ALL_MEMBERSHIPS}${q}`);
  },
};
