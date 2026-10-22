// RESPONSIBILITY: Custom hook managing async fetching and state for the Reports module.
// DATA FLOW: page.tsx → AdminReportsMain → useAdminReportsLogic → reportsApi
'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/app/admin/reports/reports_api/reports_api';
import { useAdminReportsStore } from '@/app/admin/reports/reports_store/useAdminReportsStore';
import type { FetchState } from '@/app/admin/reports/reports_types/reports_types';

export function useAdminReportsLogic() {
  const { dateRange, startDate, endDate, selectedGymId } = useAdminReportsStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminReports', dateRange, startDate, endDate, selectedGymId],
    queryFn: () => reportsApi.fetchReportData({ dateRange, gymId: selectedGymId, startDate, endDate }).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  return { reportData: data ?? null, fetchState };
}
