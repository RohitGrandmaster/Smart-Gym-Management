// RESPONSIBILITY: Toolbar with search, severity/module/branch/date filters, and CSV export for Audit Logs.
'use client';

import { Search, Download, RotateCcw } from 'lucide-react';
import { useAdminAuditLogsStore } from '@/app/admin/audit_logs/audit_store/useAdminAuditLogsStore';
import { useAdminAuditLogsLogic } from '@/app/admin/audit_logs/audit_context/useAdminAuditLogsLogic';
import {
  AUDIT_SEVERITY_OPTIONS,
  AUDIT_MODULE_OPTIONS,
  AUDIT_GYM_OPTIONS,
} from '@/app/admin/audit_logs/audit_utils/AdminAuditLogsSharedConstants';

export default function AdminAuditLogsToolbar() {
  const {
    search, setSearch,
    severityFilter, setSeverityFilter,
    moduleFilter, setModuleFilter,
    branchFilter, setBranchFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
  } = useAdminAuditLogsStore();

  const { filtered, exportCSV } = useAdminAuditLogsLogic();

  function resetFilters() {
    setSearch('');
    setSeverityFilter('all');
    setModuleFilter('all');
    setBranchFilter('all');
    setDateFrom('');
    setDateTo('');
  }

  const hasActiveFilters = search || severityFilter !== 'all' || moduleFilter !== 'all' || branchFilter !== 'all' || dateFrom || dateTo;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search by action, user, details, IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Search audit logs"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 bg-input border border-border rounded-xl text-sm text-secondary hover:text-foreground motion-safe:transition-colors"
              aria-label="Reset filters"
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors"
            aria-label="Export logs as CSV"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          aria-label="Filter by severity"
        >
          {AUDIT_SEVERITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          aria-label="Filter by module"
        >
          {AUDIT_MODULE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          aria-label="Filter by branch"
        >
          {AUDIT_GYM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            aria-label="Date from"
          />
          <span className="text-secondary text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            aria-label="Date to"
          />
        </div>
        <span className="ml-auto text-xs text-secondary self-center">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</span>
      </div>
    </div>
  );
}
