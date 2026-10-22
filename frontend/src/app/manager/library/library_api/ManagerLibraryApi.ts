// RESPONSIBILITY: Provides strongly-typed network calls for the library module.
import { apiFetch, ApiResponse } from '@/lib/api';
import { LibraryUrlConfig } from '@/app/manager/library/ManagerLibraryUrlConfig';
import type { DietPlan, Exercise } from '@/app/manager/library/library_types/ManagerLibraryTypes';

export const libraryApi = {
  getExercises: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<ApiResponse<{ exercises: Exercise[]; total: number }>>(`${LibraryUrlConfig.BACKEND_API.EXERCISES_BASE}${q}`);
  },
  createExercise: (body: Partial<Exercise>) =>
    apiFetch<ApiResponse<Exercise>>(LibraryUrlConfig.BACKEND_API.EXERCISES_BASE, { method: 'POST', body: JSON.stringify(body) }),
  updateExercise: (id: string, body: Partial<Exercise>) =>
    apiFetch<ApiResponse<Exercise>>(LibraryUrlConfig.BACKEND_API.EXERCISE_UPDATE(id), { method: 'PATCH', body: JSON.stringify(body) }),
  removeExercise: (id: string) => apiFetch<ApiResponse<{ id: string }>>(LibraryUrlConfig.BACKEND_API.EXERCISE_DELETE(id), { method: 'DELETE' }),
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
