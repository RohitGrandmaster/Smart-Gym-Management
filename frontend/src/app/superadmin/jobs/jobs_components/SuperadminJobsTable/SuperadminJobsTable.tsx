'use client';
// RESPONSIBILITY: Renders the jobs data table — rows, status badges, action buttons, and inspect modal trigger.
// Pure view component — consumes data + callbacks via props (Rule 34). No fetching, no state.

import { RefreshCw, XCircle, Trash2, Eye, AlertTriangle, X as XIcon } from 'lucide-react';
import type { BackgroundJob } from '@/app/superadmin/superadmin_types/superadmin_types';
import SuperadminJobsEmptyState from '@/app/superadmin/jobs/jobs_components/SuperadminJobsEmptyState/SuperadminJobsEmptyState';

/** Maps BackgroundJob status → TailwindCSS color classes */
const STATUS_STYLES: Record<BackgroundJob['status'], string> = {
  ACTIVE:    'text-primary bg-primary/10',
  COMPLETED: 'text-success bg-success/10',
  FAILED:    'text-danger bg-danger-bg/10',
  DELAYED:   'text-warning bg-warning/10',
};

/** Formats a millisecond duration to human-readable string */
function formatDuration(ms?: number): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

interface SuperadminJobsTableProps {
  jobs: BackgroundJob[];
  allJobsFiltered: boolean;
  selectedJobIds: Set<string>;
  toggleSelection: (id: string) => void;
  toggleAll: (ids: string[]) => void;
  onInspect: (job: BackgroundJob) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Jobs data table with 7 columns: checkbox, ID, queue, task/error, status, timing, actions.
 * Row click opens the inspect modal via onInspect callback.
 */
export default function SuperadminJobsTable({
  jobs,
  allJobsFiltered,
  selectedJobIds,
  toggleSelection,
  toggleAll,
  onInspect,
  onRetry,
  onCancel,
  onDelete,
}: SuperadminJobsTableProps) {
  if (jobs.length === 0) {
    return <SuperadminJobsEmptyState isFiltered={allJobsFiltered} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-full">
        <thead>
          <tr className="bg-primary/10 border-b border-border text-sm">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                aria-label="Select all visible jobs"
                className="rounded border-border text-primary cursor-pointer w-4 h-4"
                checked={selectedJobIds.size === jobs.length && jobs.length > 0}
                onChange={() => toggleAll(jobs.map(j => j.id))}
              />
            </th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider">Job ID</th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider">Queue</th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider">Task / Error</th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider">Status</th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider">Timing</th>
            <th className="p-4 font-semibold text-secondary text-xs uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {jobs.map((job) => {
            const jobExt = job as BackgroundJob & { durationMs?: number; finishedAt?: string };
            return (
              <tr
                key={job.id}
                onClick={() => onInspect(job)}
                className="hover:bg-card/50 motion-safe:transition-colors group cursor-pointer"
              >
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label={`Select job ${job.id}`}
                    className="rounded border-border text-primary cursor-pointer w-4 h-4"
                    checked={selectedJobIds.has(job.id)}
                    onChange={() => toggleSelection(job.id)}
                  />
                </td>
                <td className="p-4 text-xs font-mono text-secondary max-w-[120px] truncate">{job.id}</td>
                <td className="p-4 text-sm font-medium text-primary">{job.queueName}</td>
                <td className="p-4 text-sm max-w-[200px]">
                  <div className="font-medium text-foreground truncate">{job.jobName}</div>
                  {job.error && (
                    <div className="text-xs text-danger truncate mt-1" title={job.error}>{job.error}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex flex-col items-start gap-1">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                    {job.attempts > 1 && (
                      <span className="text-[10px] text-secondary">Attempts: {job.attempts}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-xs text-secondary whitespace-nowrap">
                  <div>Created: {new Date(job.createdAt).toLocaleTimeString()}</div>
                  {jobExt.finishedAt && <div>Finished: {new Date(jobExt.finishedAt).toLocaleTimeString()}</div>}
                  <div className="font-mono mt-1 text-foreground">Duration: {formatDuration(jobExt.durationMs)}</div>
                </td>
                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
                    <button
                      onClick={() => onInspect(job)}
                      className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg motion-safe:transition-colors"
                      title="Inspect Job"
                      aria-label={`Inspect job ${job.id}`}
                    >
                      <Eye size={15} />
                    </button>
                    {job.status === 'FAILED' && (
                      <button
                        onClick={() => onRetry(job.id)}
                        className="p-1.5 text-secondary hover:text-success hover:bg-success/10 rounded-lg motion-safe:transition-colors"
                        title="Retry Job"
                        aria-label={`Retry job ${job.id}`}
                      >
                        <RefreshCw size={15} />
                      </button>
                    )}
                    {(job.status === 'ACTIVE' || job.status === 'DELAYED') && (
                      <button
                        onClick={() => onCancel(job.id)}
                        className="p-1.5 text-secondary hover:text-warning hover:bg-warning/10 rounded-lg motion-safe:transition-colors"
                        title="Cancel Job"
                        aria-label={`Cancel job ${job.id}`}
                      >
                        <XCircle size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 text-secondary hover:text-danger hover:bg-danger-bg/10 rounded-lg motion-safe:transition-colors"
                      title="Delete Job"
                      aria-label={`Delete job ${job.id}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
