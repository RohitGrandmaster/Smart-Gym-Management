// RESPONSIBILITY: Provides strongly-typed network calls for the plans module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { PlansUrlConfig } from '@/app/manager/plans/ManagerPlansUrlConfig';
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';

export const plansApi = {
  getAll: () => apiFetch<ApiResponse<Plan[]>>(PlansUrlConfig.BACKEND_API.BASE),
  getOne: (id: string) => apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.GET_ONE(id)),
  create: (body: Partial<Plan>) =>
    apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Plan>) =>
    apiFetch<ApiResponse<Plan>>(PlansUrlConfig.BACKEND_API.UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id: string) => apiFetch<ApiResponse<{ id: string }>>(PlansUrlConfig.BACKEND_API.DELETE(id), { method: 'DELETE' }),
};
