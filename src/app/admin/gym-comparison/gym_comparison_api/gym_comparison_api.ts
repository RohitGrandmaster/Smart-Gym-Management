// RESPONSIBILITY: API client for the Gym Comparison module.
import type { ApiResponse } from '@/lib/api';
import type { GymComparisonData } from '@/app/admin/gym-comparison/gym_comparison_types/gym_comparison_types';
import { MOCK_GYM_COMPARISON_DATA } from '@/app/admin/gym-comparison/gym_comparison_utils/AdminGymComparisonSharedConstants';

export const gymComparisonApi = {
  fetchComparisonData: async (_gymIds?: string[]): Promise<ApiResponse<GymComparisonData>> => {
    return { success: true, message: 'Comparison data fetched', data: MOCK_GYM_COMPARISON_DATA };
  },
};
