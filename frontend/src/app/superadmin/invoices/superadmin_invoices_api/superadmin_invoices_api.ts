// RESPONSIBILITY: Modularized API client for the Invoices module.
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { SaaSInvoice } from '@/app/superadmin/invoices/superadmin_invoices_types/superadmin_invoices_types';

export const invoicesApi = {
  fetchInvoices: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<SaaSInvoice[]>>(`${SuperadminUrlConfig.BACKEND_API.INVOICES_BASE}${q}`);
  },
};
