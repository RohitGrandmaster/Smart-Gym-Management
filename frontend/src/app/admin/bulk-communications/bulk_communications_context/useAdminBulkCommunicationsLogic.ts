// RESPONSIBILITY: Business logic hook for the Bulk Communications module.
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bulkCommsApi } from '@/app/admin/bulk-communications/bulk_communications_api/bulk_communications_api';
import { useAdminBulkCommunicationsStore } from '@/app/admin/bulk-communications/bulk_communications_store/useAdminBulkCommunicationsStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { BULK_COMMS_ITEMS_PER_PAGE } from '@/app/admin/bulk-communications/bulk_communications_utils/AdminBulkCommunicationsSharedConstants';
import type { BroadcastFormValues, FetchState } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';

export function useAdminBulkCommunicationsLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const { activeTab, setActiveTab, statusFilter, setStatusFilter, channelFilter, setChannelFilter, currentPage, setCurrentPage } = useAdminBulkCommunicationsStore();

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['adminBroadcasts'],
    queryFn: bulkCommsApi.fetchBroadcasts,
    staleTime: 1000 * 60 * 2,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminBulkCommsKPIs'],
    queryFn: bulkCommsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = data.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchChannel = channelFilter === 'all' || b.channel === channelFilter;
    return matchStatus && matchChannel;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / BULK_COMMS_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * BULK_COMMS_ITEMS_PER_PAGE, currentPage * BULK_COMMS_ITEMS_PER_PAGE);

  const sendMutation = useMutation({
    mutationFn: (payload: BroadcastFormValues) => bulkCommsApi.sendBroadcast(payload),
    onSuccess: (b) => {
      toast.success(b.status === 'scheduled' ? 'Broadcast scheduled!' : 'Broadcast sent successfully!');
      setActiveTab('history');
      qc.invalidateQueries({ queryKey: ['adminBroadcasts'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bulkCommsApi.deleteBroadcast(id),
    onSuccess: () => { toast.success('Broadcast deleted'); qc.invalidateQueries({ queryKey: ['adminBroadcasts'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const sendBroadcast = useCallback((data: BroadcastFormValues) => { sendMutation.mutate(data); }, [sendMutation]);

  const deleteBroadcast = useCallback(async (id: string, title: string) => {
    const ok = await confirm({ title: 'Delete Broadcast', message: `Delete "${title}"? This cannot be undone.`, confirmText: 'Delete', type: 'danger' });
    if (!ok) return;
    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  return {
    activeTab, setActiveTab,
    statusFilter, setStatusFilter,
    channelFilter, setChannelFilter,
    fetchState, kpis,
    broadcasts: paginated,
    allBroadcasts: filtered,
    sendBroadcast,
    deleteBroadcast,
    sending: sendMutation.isPending,
    currentPage, setCurrentPage,
    totalPages, totalItems: filtered.length,
  };
}
