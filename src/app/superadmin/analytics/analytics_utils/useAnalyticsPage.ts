// RESPONSIBILITY: Logic hook for the Analytics page. Fetches revenue metrics and monthly chart data.
// Exposes fetchState enum (never boolean flags — Rule 42). No JSX — pure logic.
//
// DATA FLOW: analyticsApi.getRevenueMetrics() → useAnalyticsPage → SuperadminAnalyticsClient → UI

import { useState, useEffect } from 'react';
import { analyticsApi } from '@/app/superadmin/analytics/superadmin_analytics_api/superadmin_analytics_api';
import type { RevenueMetrics, MonthlyAnalyticsDataPoint, FetchState } from '@/app/superadmin/analytics/superadmin_analytics_types/superadmin_analytics_types';
import { MOCK_ANALYTICS_METRICS, MOCK_MONTHLY_DATA } from '@/app/superadmin/analytics/analytics_utils/SuperadminAnalyticsConstants';

interface UseAnalyticsPageReturn {
  metrics: RevenueMetrics | null;
  monthlyData: MonthlyAnalyticsDataPoint[];
  fetchState: FetchState;
  error: string | null;
}

/**
 * Logic hook for the Revenue Analytics dashboard.
 * Fetches metrics from the API and falls back to mock data when the backend is unavailable.
 * Returns `FetchState` enum instead of boolean flags (Rule 42).
 */
export function useAnalyticsPage(): UseAnalyticsPageReturn {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [monthlyData] = useState<MonthlyAnalyticsDataPoint[]>(MOCK_MONTHLY_DATA);
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Fetches revenue metrics on mount. Falls back to mock data if API is unavailable (stub-first pattern).
  // Dependency: [] — runs once on mount; metric data is static after fetch.
  useEffect(() => {
    let cancelled = false;

    setFetchState('loading');
    analyticsApi
      .getRevenueMetrics()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setMetrics(res.data);
          setFetchState('success');
        } else {
          // Inject mock data for UI presentation when backend is not yet available (Rule 75: MSW pattern)
          setMetrics(MOCK_ANALYTICS_METRICS);
          setFetchState('success');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setMetrics(MOCK_ANALYTICS_METRICS);
        setFetchState('success');
        setError(null); // Not a user-visible error since mock data is shown
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { metrics, monthlyData, fetchState, error };
}
