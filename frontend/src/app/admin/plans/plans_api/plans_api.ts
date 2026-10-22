// RESPONSIBILITY: Provides strongly-typed network calls for the plans module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { PlansUrlConfig } from '@/app/admin/plans/plans_url_config';
import type { Plan } from '@/app/admin/plans/plans_types/plans_types';

export const plansApi = {
  fetchAllPlans: () => apiFetch<ApiResponse<Plan[]>>(PlansUrlConfig.BACKEND_API.BASE),
  fetchPlanById: (id: string) => apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.GET_ONE(id)),
  createPlan: (body: Partial<Plan>) =>
    apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  updatePlan: (id: string, body: Partial<Plan>) =>
    apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  deletePlan: (id: string) => apiFetch<ApiResponse<{ id: string }>>(PlansUrlConfig.BACKEND_API.DELETE(id), { method: 'DELETE' }),
};
