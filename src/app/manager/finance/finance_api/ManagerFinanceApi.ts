// RESPONSIBILITY: Provides strongly-typed network calls for the finance module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { FinanceUrlConfig } from '@/app/manager/finance/ManagerFinanceUrlConfig';
import type { Payment, FinanceSummary } from '@/app/manager/finance/finance_types/ManagerFinanceTypes';

export const financeApi = {
  getPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ payments: Payment[]; total: number }>>(`${FinanceUrlConfig.BACKEND_API.PAYMENTS_BASE}${q}`);
  },
  createPayment: (body: Partial<Payment>) =>
    apiFetch<ApiResponse<Payment>>(FinanceUrlConfig.BACKEND_API.PAYMENTS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  getSummary: () => apiFetch<ApiResponse<FinanceSummary>>(FinanceUrlConfig.BACKEND_API.SUMMARY),
  getByMember: (memberId: string) =>
    apiFetch<ApiResponse<Payment[]>>(FinanceUrlConfig.BACKEND_API.PAYMENTS_BY_MEMBER(memberId)),
};
