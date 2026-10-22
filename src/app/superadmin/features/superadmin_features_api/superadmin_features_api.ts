import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/app/superadmin/superadmin_types/superadmin_types';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import type { FeatureFlag, ReleaseNote } from '@/app/superadmin/features/superadmin_features_types/superadmin_features_types';

export const featuresApi = {
  fetchFeatures: () => apiFetch<ApiResponse<{ flags: FeatureFlag[]; notes: ReleaseNote[] }>>(SuperadminUrlConfig.BACKEND_API.FEATURES_BASE),
  createFlag: (body: Partial<FeatureFlag>) => apiFetch<ApiResponse<FeatureFlag>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/flags`, { method: 'POST', body: JSON.stringify(body) }),
  updateFlag: (id: string, body: Partial<FeatureFlag>) => apiFetch<ApiResponse<FeatureFlag>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/flags/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  toggleFlag: (id: string) => apiFetch<ApiResponse<FeatureFlag>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/flags/${id}/toggle`, { method: 'PATCH' }),
  removeFlag: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/flags/${id}`, { method: 'DELETE' }),
  createNote: (body: Partial<ReleaseNote>) => apiFetch<ApiResponse<ReleaseNote>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/notes`, { method: 'POST', body: JSON.stringify(body) }),
  updateNote: (id: string, body: Partial<ReleaseNote>) => apiFetch<ApiResponse<ReleaseNote>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/notes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  removeNote: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.FEATURES_BASE}/notes/${id}`, { method: 'DELETE' }),
};
