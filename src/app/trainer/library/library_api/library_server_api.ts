// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server-side API fetching for the library module.
import { ssrApiFetch } from '@/lib/server-api';
import type { ApiResponse } from '@/lib/api';
import { LibraryUrlConfig } from '@/app/trainer/library/library_url_config';
import type { Exercise, DietPlan } from '@/app/trainer/trainer_types/trainer_types';

export const ssrLibraryApi = {
  getDietPlans: () => ssrApiFetch<ApiResponse<{ dietPlans: DietPlan[]; total: number }>>(LibraryUrlConfig.BACKEND_API.DIET_PLANS_BASE),
};

