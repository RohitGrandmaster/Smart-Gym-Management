// RESPONSIBILITY: Server-side API fetching for the finance module.
import { ssrApiFetch } from '@/lib/server-api';
import { FinanceUrlConfig } from '@/app/admin/finance/finance_url_config';
import type { Payment, FinanceSummary } from '@/app/admin/finance/finance_types/finance_types';
import type { ApiResponse } from '@/lib/api';

export const ssrFinanceApi = {
  getPayments: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return ssrApiFetch<ApiResponse<{ payments: Payment[]; total: number }>>(`${FinanceUrlConfig.BACKEND_API.PAYMENTS_BASE}${q}`);
  },
  getSummary: () => ssrApiFetch<ApiResponse<FinanceSummary>>(FinanceUrlConfig.BACKEND_API.SUMMARY),
};
