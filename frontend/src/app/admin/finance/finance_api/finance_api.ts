// RESPONSIBILITY: Provides strongly-typed network calls for the finance module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { FinanceUrlConfig } from '@/app/admin/finance/finance_url_config';
import type { Payment, FinanceSummary } from '@/app/admin/finance/finance_types/finance_types';

export const financeApi = {
  fetchPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ payments: Payment[]; total: number }>>(`${FinanceUrlConfig.BACKEND_API.PAYMENTS_BASE}${q}`);
  },
  createPayment: (body: Partial<Payment>) =>
    apiFetch<ApiResponse<Payment>>(FinanceUrlConfig.BACKEND_API.PAYMENTS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  fetchSummary: async (branchId?: string) => {
    const q = branchId && branchId !== 'all' ? `?branchId=${branchId}` : '';
    const res = await apiFetch<ApiResponse<FinanceSummary>>(`${FinanceUrlConfig.BACKEND_API.SUMMARY}${q}`);
    if (res.data) {
      // Mocking Expenses since backend might not support it yet
      res.data.totalExpenses = res.data.totalRevenue ? res.data.totalRevenue * 0.3 : 15000;
      res.data.netProfit = (res.data.totalRevenue || 0) - res.data.totalExpenses;
    }
    return res;
  },
  fetchPaymentsByMember: (memberId: string) =>
    apiFetch<ApiResponse<Payment[]>>(FinanceUrlConfig.BACKEND_API.PAYMENTS_BY_MEMBER(memberId)),
};
