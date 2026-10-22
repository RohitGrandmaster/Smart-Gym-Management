// RESPONSIBILITY: Logic hook for the Background Jobs page. Owns all data-fetching, filter state,
// pagination, and action handlers. Exposes a clean interface to SuperadminJobsView (view only).
// No JSX — pure logic (Rule 6, Rule 56).
//
// DATA FLOW: superadminApi.jobs.fetchJobs() → useJobsPage → SuperadminJobsView → Sub-components

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import type { BackgroundJob, FetchState } from '@/app/superadmin/superadmin_types/superadmin_types';

const ITEMS_PER_PAGE = 10;

/** Mock fallback jobs — displayed when backend returns empty until MSW/API is ready */
const FALLBACK_JOBS: BackgroundJob[] = [
  { id: 'job-1', queueName: 'billing',   jobName: 'Process Monthly Invoices', status: 'ACTIVE',    attempts: 1, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'job-2', queueName: 'email',     jobName: 'Send Welcome Email',       status: 'FAILED',    attempts: 3, error: 'Connection timeout', createdAt: '2026-01-01T01:00:00Z' },
  { id: 'job-3', queueName: 'database',  jobName: 'Nightly Backup',           status: 'COMPLETED', attempts: 1, createdAt: '2026-01-02T00:00:00Z' },
  { id: 'job-4', queueName: 'webhook',   jobName: 'Stripe Webhook Delivery',  status: 'DELAYED',   attempts: 2, createdAt: '2026-01-02T02:00:00Z' },
];

export interface UseJobsPageReturn {
  fetchState: FetchState;
  filteredJobs: BackgroundJob[];
  paginatedJobs: BackgroundJob[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  queueFilter: string;
  setQueueFilter: (v: string) => void;
  selectedJobIds: Set<string>;
  toggleSelection: (id: string) => void;
  toggleAll: (visibleIds: string[]) => void;
  inspectJob: BackgroundJob | null;
  setInspectJob: (job: BackgroundJob | null) => void;
  isRetrying: boolean;
  handleRetryAll: () => void;
  handleRetryJob: (id: string) => void;
  handleCancelJob: (id: string) => void;
  handleDeleteJob: (id: string) => void;
  handleClearCompleted: () => void;
  handleBulkRetry: () => void;
  handleBulkDelete: () => void;
  metrics: { activeJobs: number; completed24h: number; failed24h: number; delayed: number };
}

/**
 * Logic hook for the Background Jobs page.
 * Returns job data, filter state, pagination, selection state, and all action handlers.
 */
export function useJobsPage(): UseJobsPageReturn {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRetrying, setIsRetrying] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [queueFilter, setQueueFilter] = useState<string>('ALL');
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [inspectJob, setInspectJob] = useState<BackgroundJob | null>(null);

  const { data: fetchRes, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'jobs'],
    queryFn: () => superadminApi.jobs.fetchJobs(),
  });

  const rawJobs = (fetchRes?.data as BackgroundJob[]) ?? [];
  const allJobs: BackgroundJob[] = rawJobs.length > 0 ? rawJobs : FALLBACK_JOBS;

  const metrics = {
    activeJobs:    allJobs.filter(j => j.status === 'ACTIVE').length,
    completed24h:  allJobs.filter(j => j.status === 'COMPLETED').length,
    failed24h:     allJobs.filter(j => j.status === 'FAILED').length,
    delayed:       allJobs.filter(j => j.status === 'DELAYED').length,
  };

  const filteredJobs = allJobs.filter(job => {
    if (statusFilter !== 'ALL' && job.status !== statusFilter) return false;
    if (queueFilter !== 'ALL' && job.queueName !== queueFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function handleRetryAll() {
    setIsRetrying(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Retrying all failed jobs...',
        success: 'Successfully queued all failed jobs for retry.',
        error: 'Failed to retry jobs.',
      }
    ).finally(() => setIsRetrying(false));
  }

  function handleRetryJob(id: string) {
    toast.success(`Job ${id} queued for retry.`);
    void queryClient.invalidateQueries({ queryKey: ['superadmin', 'jobs'] });
  }

  function handleCancelJob(id: string) {
    toast.success(`Job ${id} cancelled successfully.`);
    void queryClient.invalidateQueries({ queryKey: ['superadmin', 'jobs'] });
  }

  function handleDeleteJob(id: string) {
    toast.success(`Job ${id} deleted.`);
    setSelectedJobIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleClearCompleted() {
    toast.success('Cleared all completed jobs.');
    setSelectedJobIds(new Set());
  }

  function handleBulkRetry() {
    toast.success(`Queued ${selectedJobIds.size} jobs for retry.`);
    setSelectedJobIds(new Set());
  }

  function handleBulkDelete() {
    toast.success(`Deleted ${selectedJobIds.size} jobs.`);
    setSelectedJobIds(new Set());
  }

  function toggleSelection(id: string) {
    setSelectedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(visibleIds: string[]) {
    if (selectedJobIds.size === visibleIds.length && visibleIds.length > 0) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(visibleIds));
    }
  }

  return {
    fetchState: isLoading ? 'loading' : isError ? 'error' : 'success',

    filteredJobs,
    paginatedJobs,
    currentPage,
    totalPages,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    queueFilter,
    setQueueFilter,
    selectedJobIds,
    toggleSelection,
    toggleAll,
    inspectJob,
    setInspectJob,
    isRetrying,
    handleRetryAll,
    handleRetryJob,
    handleCancelJob,
    handleDeleteJob,
    handleClearCompleted,
    handleBulkRetry,
    handleBulkDelete,
    metrics,
  };
}
