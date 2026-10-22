// RESPONSIBILITY: Server-side API fetching for the plans module.
import { ssrApiFetch } from '@/lib/server-api';
import { PlansUrlConfig } from '@/app/manager/plans/ManagerPlansUrlConfig';
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';
import type { ApiResponse } from '@/lib/api';

export const ssrPlansApi = {
  getAll: () => ssrApiFetch<ApiResponse<Plan[]>>(PlansUrlConfig.BACKEND_API.BASE),
};
