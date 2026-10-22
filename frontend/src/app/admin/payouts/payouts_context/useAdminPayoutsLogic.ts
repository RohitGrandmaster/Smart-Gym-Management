// RESPONSIBILITY: Business logic hook for the Payouts module.
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { payoutsApi } from '@/app/admin/payouts/payouts_api/payouts_api';
import { useAdminPayoutsStore } from '@/app/admin/payouts/payouts_store/useAdminPayoutsStore';
import { PAYOUTS_ITEMS_PER_PAGE } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';
import type { FetchState } from '@/app/admin/payouts/payouts_types/payouts_types';

export function useAdminPayoutsLogic() {
  const qc = useQueryClient();
  const { activeTab, setActiveTab, monthFilter, setMonthFilter, gymFilter, setGymFilter, statusFilter, setStatusFilter, currentPage, setCurrentPage } = useAdminPayoutsStore();

  const { data: payouts = [], isLoading: loadingPayouts, isError: errorPayouts } = useQuery({
    queryKey: ['adminPayouts'],
    queryFn: payoutsApi.fetchPayouts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: pnlData = [], isLoading: loadingPnL } = useQuery({
    queryKey: ['adminPnL'],
    queryFn: payoutsApi.fetchPnL,
    staleTime: 1000 * 60 * 5,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminPayoutsKPIs'],
    queryFn: payoutsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = loadingPayouts ? 'loading' : errorPayouts ? 'error' : 'success';

  const filteredPayouts = payouts.filter(p => {
    const matchMonth = monthFilter === 'all' || p.month === monthFilter;
    const matchGym = gymFilter === 'all' || p.gymId === gymFilter;
    const matchStatus = statusFilter === 'all' || p.payoutStatus === statusFilter;
    return matchMonth && matchGym && matchStatus;
  });

  const filteredPnL = pnlData.filter(p => {
    const matchMonth = monthFilter === 'all' || p.month === monthFilter;
    const matchGym = gymFilter === 'all' || p.gymId === gymFilter;
    return matchMonth && matchGym;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPayouts.length / PAYOUTS_ITEMS_PER_PAGE));
  const paginatedPayouts = filteredPayouts.slice((currentPage - 1) * PAYOUTS_ITEMS_PER_PAGE, currentPage * PAYOUTS_ITEMS_PER_PAGE);

  const markPaidMutation = useMutation({
    mutationFn: ({ gymId, month }: { gymId: string; month: string }) => payoutsApi.markPaid(gymId, month),
    onSuccess: () => { toast.success('Payout marked as paid'); qc.invalidateQueries({ queryKey: ['adminPayouts'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  return {
    activeTab, setActiveTab,
    monthFilter, setMonthFilter,
    gymFilter, setGymFilter,
    statusFilter, setStatusFilter,
    currentPage, setCurrentPage,
    fetchState,
    payouts: paginatedPayouts,
    allPayouts: filteredPayouts,
    pnlData: filteredPnL,
    kpis,
    totalPages,
    totalItems: filteredPayouts.length,
    markPaid: (gymId: string, month: string) => markPaidMutation.mutate({ gymId, month }),
    loadingPnL,
  };
}
