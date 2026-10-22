// RESPONSIBILITY: Generic fetch hook for Superadmin read-only data. Manages loading/error state for a single API endpoint. For mutations, use useSuperadminMutation instead.
// DATA FLOW: API -> useSuperadminData -> Superadmin page components (SuperadminFeaturesClient, SuperadminBackupsClient, MigrationsClient, SuperadminDashboardView)

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { FetchState } from '@/app/superadmin/superadmin_types/superadmin_types';

/**
 * Fetches read-only data from a superadmin API endpoint.
 * Handles loading/error/success states automatically.
 * For mutations (create/update/delete), use useSuperadminMutation (Rule 58).
 * @param endpoint - The API path to fetch (e.g. SuperadminUrlConfig.BACKEND_API.FEATURES_BASE)
 */
export function useSuperadminData<T>(endpoint: string) {
  const query = useQuery({
    queryKey: ['superadmin', endpoint],
    queryFn: () => apiFetch<{ success: boolean; data: T }>(endpoint).then(res => {
      if ('data' in res) return res.data;
      return res as unknown as T;
    })
  });

  const fetchState: FetchState = query.isLoading ? 'loading' : query.isError ? 'error' : 'success';
  const data = query.data ?? null;
  const error = query.error ? query.error.message : null;

  /** Pessimistically mutate local cache after a confirmed API write. */
  const mutate = useCallback((updater: T | ((prev: T | null) => T | null)) => {
    // Local mutation is tricky without passing queryClient, so we just refetch for now
    query.refetch();
  }, [query]);

  return { data, fetchState, error, mutate };
}
