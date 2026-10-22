// RESPONSIBILITY: Provides strongly-typed network calls for the sales module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { SalesUrlConfig } from '@/app/manager/sales/ManagerSalesUrlConfig';
import type { OverviewDataPoint, MembershipReportItem, MembershipTotals, PendingPaymentMember } from '@/app/manager/sales/sales_types/ManagerSalesTypes';
import type { Member } from '@/app/manager/members/members_types/ManagerMembersTypes';

export const salesApi = {
  getOverview: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ monthlyRevenue: OverviewDataPoint[] }>>(`${SalesUrlConfig.BACKEND_API.OVERVIEW}${q}`);
  },
  getMembershipReport: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ report: MembershipReportItem[]; totals: MembershipTotals }>>(`${SalesUrlConfig.BACKEND_API.MEMBERSHIP_REPORT}${q}`);
  },
  getPendingPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ members: PendingPaymentMember[]; total: number }>>(`${SalesUrlConfig.BACKEND_API.PENDING_PAYMENTS}${q}`);
  },
  getAllMemberships: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ members: Member[]; total: number }>>(`${SalesUrlConfig.BACKEND_API.ALL_MEMBERSHIPS}${q}`);
  },
};
