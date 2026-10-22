// RESPONSIBILITY: Modularized API client for the Gyms module. All methods import apiFetch from src/lib/api.ts.
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { Tenant } from '@/app/superadmin/gyms/superadmin_gyms_types/superadmin_gyms_types';

export const gymsApi = {
  fetchGyms: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<Tenant[]>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}${q}`);
  },
  fetchGymById: (id: string) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`),
  createGym: (body: Partial<Tenant>) => apiFetch<ApiResponse<Tenant>>(SuperadminUrlConfig.BACKEND_API.GYMS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateGym: (id: string, body: Partial<Tenant>) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  changeGymStatus: (id: string, status: string) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteGym: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`, { method: 'DELETE' }),
  fetchGymStats: () => apiFetch<ApiResponse<unknown>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/stats`),
  impersonateTenant: (id: string) => apiFetch<ApiResponse<{ token: string }>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/impersonate`, { method: 'POST' }),
  emailGymOwner: (id: string, body: { subject: string; message: string; [key: string]: unknown }) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/email`, { method: 'POST', body: JSON.stringify(body) }),
};
