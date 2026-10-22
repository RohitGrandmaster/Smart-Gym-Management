// RESPONSIBILITY: Modularized API client for the Affiliates module.
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { Affiliate } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';

export const affiliatesApi = {
  fetchAffiliates: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<Affiliate[]>>(`${SuperadminUrlConfig.BACKEND_API.AFFILIATES_BASE}${q}`);
  },
  createAffiliate: (body: Partial<Affiliate>) => apiFetch<ApiResponse<Affiliate>>(SuperadminUrlConfig.BACKEND_API.AFFILIATES_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateAffiliate: (id: string, body: Partial<Affiliate>) => apiFetch<ApiResponse<Affiliate>>(`${SuperadminUrlConfig.BACKEND_API.AFFILIATES_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateStatus: (id: string, status: string) => apiFetch<ApiResponse<Affiliate>>(`${SuperadminUrlConfig.BACKEND_API.AFFILIATES_BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteAffiliate: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.AFFILIATES_BASE}/${id}`, { method: 'DELETE' }),
};
