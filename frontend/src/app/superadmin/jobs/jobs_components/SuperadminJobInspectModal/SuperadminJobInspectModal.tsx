'use client';
// RESPONSIBILITY: Renders the Job Payload Inspect Modal — shows timing, error trace, and JSON payload.
// Pure view component — rendered conditionally by SuperadminJobsView (Rule 34). No state, no API calls.

import { Eye, AlertTriangle, X as XIcon } from 'lucide-react';
import type { BackgroundJob } from '@/app/superadmin/superadmin_types/superadmin_types';

const STATUS_TEXT_COLORS: Record<BackgroundJob['status'], string> = {
  ACTIVE:    'text-primary',
  COMPLETED: 'text-success',
  FAILED:    'text-danger',
  DELAYED:   'text-warning',
};

function formatDuration(ms?: number): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

interface SuperadminJobInspectModalProps {
  job: BackgroundJob;
  onClose: () => void;
}

/**
 * Full-screen overlay modal for inspecting a background job's timing, error, and payload.
 */
export default function SuperadminJobInspectModal({ job, onClose }: SuperadminJobInspectModalProps) {
  const jobExt = job as BackgroundJob & { durationMs?: number; finishedAt?: string; payload?: unknown };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect job ${job.id}`}
      className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in"
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-sidebar/30 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Eye className="text-primary w-5 h-5" />
              Inspect Job: <span className="font-mono text-sm text-secondary ml-1">{job.id}</span>
            </h2>
            <p className="text-sm text-secondary mt-1">
              Queue: <span className="text-primary font-medium">{job.queueName}</span> &bull; Task: {job.jobName}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close inspect modal"
            className="p-2 text-secondary hover:text-foreground hover:bg-input rounded-full motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Status & Timing */}
          <div>
            <h3 className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wider">Status &amp; Timing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-input p-4 rounded-lg">
              <div>
                <p className="text-xs text-secondary mb-1">Status</p>
                <p className={`text-sm font-bold ${STATUS_TEXT_COLORS[job.status]}`}>{job.status}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Attempts</p>
                <p className="text-sm font-medium text-foreground">{job.attempts}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Created At</p>
                <p className="text-xs text-foreground">{new Date(job.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Duration</p>
                <p className="text-sm text-foreground font-mono">{formatDuration(jobExt.durationMs)}</p>
              </div>
            </div>
          </div>

          {/* Error Trace */}
          {job.error && (
            <div>
              <h3 className="text-xs font-semibold text-danger mb-3 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={13} /> Error Trace
              </h3>
              <div className="bg-danger-bg/10 border border-destructive/20 text-danger p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {job.error}
              </div>
            </div>
          )}

          {/* Payload */}
          <div>
            <h3 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">Job Payload</h3>
            <div className="bg-sidebar border border-border p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs font-mono text-foreground">
                {JSON.stringify(jobExt.payload ?? { message: 'No payload attached.' }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
