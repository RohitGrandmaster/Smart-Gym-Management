'use client';
// RESPONSIBILITY: Renders the page title, filter toolbar, and bulk action buttons for the Jobs page.
// Pure view component — no data-fetching, no business logic. All handlers passed via props (Rule 34).

import { RefreshCw, Filter, Trash2 } from 'lucide-react';

interface SuperadminJobsHeaderProps {
  selectedCount: number;
  isRetrying: boolean;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  queueFilter: string;
  setQueueFilter: (v: string) => void;
  onClearCompleted: () => void;
  onRetryAll: () => void;
  onBulkRetry: () => void;
  onBulkDelete: () => void;
  onFilterChange: () => void;
}

/**
 * Header section of the Background Jobs page.
 * Contains: page title, Clear Completed + Retry All buttons, and filter dropdowns.
 */
export default function SuperadminJobsHeader({
  selectedCount,
  isRetrying,
  statusFilter,
  setStatusFilter,
  queueFilter,
  setQueueFilter,
  onClearCompleted,
  onRetryAll,
  onBulkRetry,
  onBulkDelete,
  onFilterChange,
}: SuperadminJobsHeaderProps) {
  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value);
    onFilterChange();
  }

  function handleQueueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setQueueFilter(e.target.value);
    onFilterChange();
  }

  return (
    <div className="space-y-4">
      {/* Page Title + Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Background Jobs</h1>
          <p className="text-secondary mt-1 text-sm">Monitor async queues, inspect payloads, and manage tasks.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onClearCompleted}
            className="bg-input text-foreground px-4 py-2 rounded-lg font-medium hover:bg-border motion-safe:transition-colors border border-border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear Completed
          </button>
          <button
            onClick={onRetryAll}
            disabled={isRetrying}
            className="flex items-center gap-2 bg-danger-bg/10 text-danger px-4 py-2 rounded-lg font-medium hover:bg-danger-bg hover:text-white motion-safe:transition-colors border border-destructive/20 hover:border-transparent disabled:opacity-50 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <RefreshCw size={15} className={isRetrying ? 'motion-safe:animate-spin' : ''} />
            Retry All Failed
          </button>
        </div>
      </div>

      {/* Filter + Bulk Actions Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-secondary shrink-0" />
            <select
              aria-label="Filter by status"
              className="bg-input border border-border text-foreground text-sm rounded-lg px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="ALL">All Statuses</option>
              <option value="FAILED">Failed</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>
          <select
            aria-label="Filter by queue"
            className="bg-input border border-border text-foreground text-sm rounded-lg px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={queueFilter}
            onChange={handleQueueChange}
          >
            <option value="ALL">All Queues</option>
            <option value="billing">billing</option>
            <option value="email">email</option>
            <option value="webhook">webhook</option>
            <option value="database">database</option>
          </select>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-3 motion-safe:animate-in motion-safe:slide-in-from-right-4">
            <span className="text-sm font-medium text-primary">{selectedCount} selected</span>
            <button
              onClick={onBulkRetry}
              className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RefreshCw size={13} /> Retry
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 bg-danger text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90 motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
