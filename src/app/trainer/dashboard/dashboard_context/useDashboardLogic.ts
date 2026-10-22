// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Custom hook managing the asynchronous fetching of dashboard statistics.
// DATA FLOW: page.tsx (SSR) → TrainerDashboardMain → useDashboardLogic → DashboardContext → KPI/Chart components
'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/app/trainer/dashboard/dashboard_api/dashboard_api';
import type { DashboardContextType, FetchState, DashboardStats, TimeRange } from '@/app/trainer/dashboard/dashboard_types/dashboard_types';

/**
 * Hook to manage dashboard data fetching and network state tracking.
 */
export function useDashboardLogic(initialData?: DashboardStats | null): DashboardContextType {
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

  useEffect(() => {
    setTimeout(() => {
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
    }, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- runs once on mount only

  return {
    stats,
    status,
    error,
    timeRange,
    setTimeRange,
    startDate,
    endDate,
    setCustomDateRange
  };
}


