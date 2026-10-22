// RESPONSIBILITY: Business logic hook for the Data Export module.
// DATA FLOW: API → useAdminDataExportLogic → components
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataExportApi } from '@/app/admin/data-export/data_export_api/data_export_api';
import { useAdminDataExportStore } from '@/app/admin/data-export/data_export_store/useAdminDataExportStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { DATA_EXPORT_ITEMS_PER_PAGE } from '@/app/admin/data-export/data_export_utils/AdminDataExportSharedConstants';
import type { ExportFormValues, FetchState } from '@/app/admin/data-export/data_export_types/data_export_types';

export function useAdminDataExportLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const { statusFilter, setStatusFilter, currentPage, setCurrentPage } = useAdminDataExportStore();

  const { data: jobs = [], isLoading, isError } = useQuery({
    queryKey: ['adminDataExportJobs'],
    queryFn: dataExportApi.fetchJobs,
    staleTime: 1000 * 30,
    refetchInterval: 10000, // Poll every 10s to catch processing → completed transitions
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminDataExportKPIs'],
    queryFn: dataExportApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = jobs.filter(j => statusFilter === 'all' || j.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / DATA_EXPORT_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * DATA_EXPORT_ITEMS_PER_PAGE, currentPage * DATA_EXPORT_ITEMS_PER_PAGE);

  const createMutation = useMutation({
    mutationFn: (payload: ExportFormValues) => dataExportApi.createExport(payload),
    onSuccess: () => {
      toast.success('Export job started! It will appear in history when ready.');
      qc.invalidateQueries({ queryKey: ['adminDataExportJobs'] });
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dataExportApi.deleteJob(id),
    onSuccess: () => { toast.success('Export job deleted'); qc.invalidateQueries({ queryKey: ['adminDataExportJobs'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const createExport = useCallback((data: ExportFormValues) => { createMutation.mutate(data); }, [createMutation]);

  const deleteJob = useCallback(async (id: string) => {
    const ok = await confirm({ title: 'Delete Export', message: 'Delete this export job? This cannot be undone.', confirmText: 'Delete', type: 'danger' });
    if (!ok) return;
    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  return {
    jobs: paginated, allJobs: filtered, fetchState, kpis,
    statusFilter, setStatusFilter,
    currentPage, setCurrentPage,
    totalPages, totalItems: filtered.length,
    createExport, deleteJob,
    creating: createMutation.isPending,
  };
}
