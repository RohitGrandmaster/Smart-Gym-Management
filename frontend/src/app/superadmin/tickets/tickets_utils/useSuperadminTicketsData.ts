// RESPONSIBILITY: Generic fetch hook for Tickets read-only data.
// DATA FLOW: Component -> useSuperadminTicketsData.ts -> API/Store
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch, ApiResponse } from '@/lib/api';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export function useSuperadminTicketsData<T>(endpoint: string) {
  const query = useQuery({
    queryKey: ['superadmin', endpoint],
    queryFn: () => apiFetch<ApiResponse<T>>(endpoint).then(res => {
      if ('data' in res) return res.data;
      return res as unknown as T;
    })
  });

  const fetchState: FetchState = query.isLoading ? 'loading' : query.isError ? 'error' : 'success';
  const data = query.data ?? null;
  const error = query.error ? query.error.message : null;

  const mutate = useCallback((updater: T | ((prev: T | null) => T | null)) => {
    query.refetch();
  }, [query]);

  return { data, fetchState, error, mutate };
}
