// RESPONSIBILITY: Custom hook managing the asynchronous fetching of dashboard statistics.
// DATA FLOW: page.tsx (SSR) → AdminDashboardMain → useAdminDashboardLogic
'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/app/admin/dashboard/dashboard_api/dashboard_api';
import type { FetchState, DashboardStats } from '@/app/admin/dashboard/dashboard_types/dashboard_types';

export function useAdminDashboardLogic(initialData?: DashboardStats | null) {
  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => dashboardApi.fetchDashboardStats().then(r => r.data),
    initialData: initialData ?? undefined,
    staleTime: Infinity,
  });

  const status: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  return {
    stats: data ?? null,
    status,
    error: isError ? (queryError as Error).message : '',
  };
}

