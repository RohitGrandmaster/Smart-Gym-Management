// RESPONSIBILITY: Business logic hook for the Gym Health Alerts module.
// DATA FLOW: API → useAdminGymHealthAlertsLogic → components
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { gymHealthAlertsApi } from '@/app/admin/gym-health-alerts/gym_health_alerts_api/gym_health_alerts_api';
import { useAdminGymHealthAlertsStore } from '@/app/admin/gym-health-alerts/gym_health_alerts_store/useAdminGymHealthAlertsStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { GYM_HEALTH_ITEMS_PER_PAGE } from '@/app/admin/gym-health-alerts/gym_health_alerts_utils/AdminGymHealthAlertsSharedConstants';
import type { FetchState } from '@/app/admin/gym-health-alerts/gym_health_alerts_types/gym_health_alerts_types';

export function useAdminGymHealthAlertsLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const {
    severityFilter, setSeverityFilter,
    typeFilter, setTypeFilter,
    gymFilter, setGymFilter,
    resolvedFilter, setResolvedFilter,
    currentPage, setCurrentPage,
  } = useAdminGymHealthAlertsStore();

  const { data: alerts = [], isLoading, isError } = useQuery({
    queryKey: ['adminGymHealthAlerts'],
    queryFn: gymHealthAlertsApi.fetchAlerts,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 60000,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminGymHealthKPIs'],
    queryFn: gymHealthAlertsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = alerts.filter(a => {
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchType = typeFilter === 'all' || a.alertType === typeFilter;
    const matchGym = gymFilter === 'all' || a.gymId === gymFilter;
    const matchResolved = resolvedFilter === 'all' || (resolvedFilter === 'active' ? !a.isResolved : a.isResolved);
    return matchSeverity && matchType && matchGym && matchResolved;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / GYM_HEALTH_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * GYM_HEALTH_ITEMS_PER_PAGE, currentPage * GYM_HEALTH_ITEMS_PER_PAGE);

  const resolveMutation = useMutation({
    mutationFn: (id: string) => gymHealthAlertsApi.resolveAlert(id),
    onSuccess: () => { toast.success('Alert marked as resolved'); qc.invalidateQueries({ queryKey: ['adminGymHealthAlerts'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) => gymHealthAlertsApi.dismissAlert(id),
    onSuccess: () => { toast.success('Alert dismissed'); qc.invalidateQueries({ queryKey: ['adminGymHealthAlerts'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const resolveAlert = useCallback((id: string) => { resolveMutation.mutate(id); }, [resolveMutation]);

  const dismissAlert = useCallback(async (id: string, title: string) => {
    const ok = await confirm({ title: 'Dismiss Alert', message: `Dismiss "${title}"? It will be permanently removed.`, confirmText: 'Dismiss', type: 'warning' });
    if (!ok) return;
    dismissMutation.mutate(id);
  }, [confirm, dismissMutation]);

  return {
    alerts: paginated, allAlerts: filtered, fetchState, kpis,
    severityFilter, setSeverityFilter,
    typeFilter, setTypeFilter,
    gymFilter, setGymFilter,
    resolvedFilter, setResolvedFilter,
    currentPage, setCurrentPage,
    totalPages, totalItems: filtered.length,
    resolveAlert, dismissAlert,
  };
}
