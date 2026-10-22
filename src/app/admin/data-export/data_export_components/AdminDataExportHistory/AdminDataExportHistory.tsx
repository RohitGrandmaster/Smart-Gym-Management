// RESPONSIBILITY: Table showing export job history with status, row count, file size, and delete action.
'use client';

import { Trash2, CheckCircle, Loader2, XCircle, Download } from 'lucide-react';
import { useAdminDataExportLogic } from '@/app/admin/data-export/data_export_context/useAdminDataExportLogic';
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { EXPORT_STATUS_OPTIONS } from '@/app/admin/data-export/data_export_utils/AdminDataExportSharedConstants';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-success-bg text-success',
  processing: 'bg-warning-bg text-warning',
  failed: 'bg-danger-bg text-danger',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle size={11} />,
  processing: <Loader2 size={11} className="animate-spin" />,
  failed: <XCircle size={11} />,
};

const DATA_TYPE_LABELS: Record<string, string> = {
  members: 'Members',
  payments: 'Payments',
  attendance: 'Attendance',
  staff: 'Staff',
  full_report: 'Full Report',
};

const HEADERS = ['Data Type', 'Format', 'Gyms', 'Date Range', 'Rows', 'Size', 'Status', 'Created', 'Actions'];

export default function AdminDataExportHistory() {
  const { jobs, fetchState, deleteJob, statusFilter, setStatusFilter, currentPage, setCurrentPage, totalPages, totalItems } = useAdminDataExportLogic();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm font-semibold text-foreground">Export History</p>
        <div className="w-44">
          <AdminSearchableDropdown options={EXPORT_STATUS_OPTIONS} value={statusFilter} onChange={(v) => setStatusFilter(v as string)} placeholder="All Status" />
        </div>
      </div>

      {fetchState === 'loading' ? <AdminTableSkeleton rows={5} cols={HEADERS.length} /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5">
                  {HEADERS.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.length === 0 ? (
                  <tr><td colSpan={HEADERS.length} className="px-4 py-16 text-center text-sm text-secondary">No export jobs found</td></tr>
                ) : jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-primary/5 motion-safe:transition-colors group">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{DATA_TYPE_LABELS[job.dataType] ?? job.dataType}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-input text-secondary uppercase">{job.format}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-secondary max-w-36 truncate">{job.gymNames.join(', ')}</td>
                    <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">{job.dateFrom} → {job.dateTo}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{job.rowCount !== undefined ? job.rowCount.toLocaleString('en-IN') : '—'}</td>
                    <td className="px-4 py-3 text-sm text-secondary">{job.fileSizeKb !== undefined ? `${job.fileSizeKb} KB` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[job.status] ?? 'bg-input text-secondary'}`}>
                        {STATUS_ICONS[job.status]}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
                        {job.status === 'completed' && (
                          <button className="p-1.5 rounded-lg hover:bg-input text-secondary hover:text-primary motion-safe:transition-colors" aria-label="Download export">
                            <Download size={15} />
                          </button>
                        )}
                        <button onClick={() => deleteJob(job.id)} className="p-1.5 rounded-lg hover:bg-danger-bg text-secondary hover:text-danger motion-safe:transition-colors" aria-label="Delete export job">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border">
            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={10} />
          </div>
        </div>
      )}
    </div>
  );
}
