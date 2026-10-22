// RESPONSIBILITY: Provides strongly-typed network calls for the inquiries module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { InquiriesUrlConfig } from '@/app/manager/inquiries/ManagerInquiriesUrlConfig';
import type { Inquiry, InquiryStats } from '@/app/manager/inquiries/inquiries_types/ManagerInquiriesTypes';
import type { InquiryFormValues } from '@/app/manager/inquiries/inquiries_utils/ManagerInquiriesSharedConstants';

export const inquiriesApi = {
  getAll: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ inquiries: Inquiry[]; total: number }>>(`${InquiriesUrlConfig.BACKEND_API.BASE}${q}`);
  },
  getOne: (id: string) => apiFetch<ApiResponse<Inquiry>>(InquiriesUrlConfig.BACKEND_API.GET_ONE(id)),
  getStats: () => apiFetch<ApiResponse<InquiryStats>>(InquiriesUrlConfig.BACKEND_API.STATS),
  create: (body: Partial<InquiryFormValues>) =>
    apiFetch<ApiResponse<Inquiry>>(InquiriesUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<InquiryFormValues>) =>
    apiFetch<ApiResponse<Inquiry>>(InquiriesUrlConfig.BACKEND_API.UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => apiFetch<ApiResponse<{ id: string }>>(InquiriesUrlConfig.BACKEND_API.DELETE(id), { method: 'DELETE' }),
};
