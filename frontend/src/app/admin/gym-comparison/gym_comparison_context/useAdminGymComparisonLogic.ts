// RESPONSIBILITY: Custom hook for fetching and filtering gym comparison data.
// DATA FLOW: page.tsx → AdminGymComparisonMain → useAdminGymComparisonLogic → gymComparisonApi
'use client';

import { useQuery } from '@tanstack/react-query';
import { gymComparisonApi } from '@/app/admin/gym-comparison/gym_comparison_api/gym_comparison_api';
import { useAdminGymComparisonStore } from '@/app/admin/gym-comparison/gym_comparison_store/useAdminGymComparisonStore';
import type { FetchState } from '@/app/admin/gym-comparison/gym_comparison_types/gym_comparison_types';

export function useAdminGymComparisonLogic() {
  const { selectedGymIds } = useAdminGymComparisonStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminGymComparison', selectedGymIds],
    queryFn: () => gymComparisonApi.fetchComparisonData(selectedGymIds).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filteredGyms = data?.gyms.filter(g => selectedGymIds.includes(g.gymId)) ?? [];

  return { comparisonData: data ?? null, filteredGyms, fetchState };
}
