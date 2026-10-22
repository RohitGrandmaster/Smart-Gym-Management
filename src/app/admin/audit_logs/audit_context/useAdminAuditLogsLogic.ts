// RESPONSIBILITY: Business logic hook for Audit Logs — filtering, pagination, CSV export.
'use client';

import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '@/app/admin/audit_logs/audit_api/audit_api';
import { useAdminAuditLogsStore } from '@/app/admin/audit_logs/audit_store/useAdminAuditLogsStore';
import { AUDIT_ITEMS_PER_PAGE } from '@/app/admin/audit_logs/audit_utils/AdminAuditLogsSharedConstants';
import type { AuditLog, FetchState } from '@/app/admin/audit_logs/audit_types/audit_types';

export function useAdminAuditLogsLogic() {
  const {
    search, severityFilter, moduleFilter, branchFilter,
    dateFrom, dateTo, currentPage, setCurrentPage,
  } = useAdminAuditLogsStore();

  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ['adminAuditLogs'],
    queryFn: auditLogsApi.fetchLogs,
    staleTime: 1000 * 60 * 2,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminAuditKPIs'],
    queryFn: auditLogsApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = logs.filter((log: AuditLog) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      log.details.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.ip.includes(q);
    const matchSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    const matchBranch = branchFilter === 'all' || log.branchId === branchFilter || log.branchId === 'all';
    const logDate = new Date(log.timestamp);
    const matchFrom = !dateFrom || logDate >= new Date(dateFrom);
    const matchTo = !dateTo || logDate <= new Date(dateTo + 'T23:59:59');
    return matchSearch && matchSeverity && matchModule && matchBranch && matchFrom && matchTo;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / AUDIT_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * AUDIT_ITEMS_PER_PAGE, currentPage * AUDIT_ITEMS_PER_PAGE);

  function exportCSV(rows: AuditLog[]) {
    const headers = ['Timestamp', 'Action', 'Module', 'User', 'Branch', 'Details', 'Severity', 'IP', 'User Agent'];
    const csvRows = rows.map(l => [
      new Date(l.timestamp).toLocaleString('en-IN'),
      l.action,
      l.module,
      l.user,
      l.branchId,
      `"${l.details.replace(/"/g, '""')}"`,
      l.severity,
      l.ip,
      l.userAgent ?? '',
    ]);
    const csv = [headers, ...csvRows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    paginated, filtered, fetchState, kpis,
    currentPage, setCurrentPage, totalPages, totalItems: filtered.length,
    exportCSV,
  };
}
