// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides strongly-typed network calls for the library module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { LibraryUrlConfig } from '@/app/trainer/library/library_url_config';
import type { Exercise, DietPlan } from '@/app/trainer/trainer_types/trainer_types';

export const libraryApi = {
  getDietPlans: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ dietPlans: DietPlan[]; total: number }>>(`${LibraryUrlConfig.BACKEND_API.DIET_PLANS_BASE}${q}`);
  },
  createDietPlan: (body: Partial<DietPlan>) =>
    apiFetch<ApiResponse<DietPlan>>(LibraryUrlConfig.BACKEND_API.DIET_PLANS_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateDietPlan: (id: string, body: Partial<DietPlan>) =>
    apiFetch<ApiResponse<DietPlan>>(LibraryUrlConfig.BACKEND_API.DIET_PLAN_UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  removeDietPlan: (id: string) => apiFetch<ApiResponse<{ id: string }>>(LibraryUrlConfig.BACKEND_API.DIET_PLAN_DELETE(id), { method: 'DELETE' }),
};

