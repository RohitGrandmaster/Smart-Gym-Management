// RESPONSIBILITY: Custom hook managing the asynchronous fetching of dashboard statistics.
// DATA FLOW: page.tsx (SSR) → ManagerDashboardMain → useManagerDashboardLogic → DashboardContext → KPI/Chart components
'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/app/manager/dashboard/dashboard_api/ManagerDashboardApi';
import { DashboardContextType, FetchState, DashboardStats, TimeRange } from '@/app/manager/dashboard/dashboard_types/ManagerDashboardTypes';

/**
 * Hook to manage dashboard data fetching and network state tracking.
 */
export function useManagerDashboardLogic(initialData?: DashboardStats | null): DashboardContextType {
  const [stats, setStats] = useState<DashboardStats | null>(initialData || null);
  const [status, setStatus] = useState<FetchState>(initialData ? 'success' : 'loading');
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const setCustomDateRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch only when no SSR initialData was passed from page.tsx; initialData in deps prevents re-fetch on SSR hydration
  useEffect(() => {
    

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading');
    dashboardApi.getStats()
      .then(res => {
        setStats(res.data);
        setStatus('success');
      })
      .catch(e => {
        setError(e.message);
        setStatus('error');
      });
  }, [initialData]);

  return { stats, status, error, timeRange, setTimeRange, startDate, endDate, setCustomDateRange };
}

