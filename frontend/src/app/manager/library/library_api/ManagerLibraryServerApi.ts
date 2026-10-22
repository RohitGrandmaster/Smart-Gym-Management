// RESPONSIBILITY: Server-side API fetching for the library module.
import { ssrApiFetch } from '@/lib/server-api';
import type { ApiResponse } from '@/lib/api';
import { LibraryUrlConfig } from '@/app/manager/library/ManagerLibraryUrlConfig';
import type { DietPlan } from '@/app/manager/library/library_types/ManagerLibraryTypes';

export const ssrLibraryApi = {

  getDietPlans: () => ssrApiFetch<ApiResponse<{ dietPlans: DietPlan[]; total: number }>>(LibraryUrlConfig.BACKEND_API.DIET_PLANS_BASE),
};
