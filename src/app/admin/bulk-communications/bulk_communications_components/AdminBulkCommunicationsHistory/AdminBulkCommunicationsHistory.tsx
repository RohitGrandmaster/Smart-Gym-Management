// RESPONSIBILITY: History table of all past and scheduled broadcasts.
'use client';

import { Trash2, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { useAdminBulkCommunicationsLogic } from '@/app/admin/bulk-communications/bulk_communications_context/useAdminBulkCommunicationsLogic';
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { BROADCAST_STATUS_OPTIONS, CHANNEL_OPTIONS } from '@/app/admin/bulk-communications/bulk_communications_utils/AdminBulkCommunicationsSharedConstants';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';

const STATUS_STYLES: Record<string, string> = {
  sent: 'bg-success-bg text-success',
  scheduled: 'bg-warning-bg text-warning',
  failed: 'bg-danger-bg text-danger',
  draft: 'bg-input text-secondary',
};

const CHANNEL_ICON_MAP: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare size={13} />,
  email: <Mail size={13} />,
  sms: <Smartphone size={13} />,
};

const HEADERS = ['Title', 'Channel', 'Recipients', 'Delivered', 'Status', 'Sent / Scheduled', 'Actions'];

export default function AdminBulkCommunicationsHistory() {
  const { broadcasts, fetchState, deleteBroadcast, statusFilter, setStatusFilter, channelFilter, setChannelFilter, currentPage, setCurrentPage, totalPages, totalItems } = useAdminBulkCommunicationsLogic();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <div className="w-40">
          <AdminSearchableDropdown options={[{ value: 'all', label: 'All Channels' }, ...CHANNEL_OPTIONS]} value={channelFilter} onChange={(v) => setChannelFilter(v as string)} placeholder="All Channels" />
        </div>
        <div className="w-40">
          <AdminSearchableDropdown options={BROADCAST_STATUS_OPTIONS} value={statusFilter} onChange={(v) => setStatusFilter(v as string)} placeholder="All Status" />
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
                {broadcasts.length === 0 ? (
                  <tr><td colSpan={HEADERS.length} className="px-4 py-16 text-center text-sm text-secondary">No broadcasts found</td></tr>
                ) : broadcasts.map((b) => (
                  <tr key={b.id} className="hover:bg-primary/5 motion-safe:transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{b.title}</p>
                      <p className="text-xs text-secondary mt-0.5 line-clamp-1 max-w-56">{b.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-input text-secondary capitalize">
                        {CHANNEL_ICON_MAP[b.channel]} {b.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{b.recipientCount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {b.deliveredCount !== undefined ? (
                        <span className="text-success font-medium">{b.deliveredCount.toLocaleString('en-IN')}</span>
                      ) : <span className="text-secondary">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[b.status] ?? 'bg-input text-secondary'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary whitespace-nowrap">
                      {b.sentAt ? new Date(b.sentAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : b.scheduledAt ? new Date(b.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteBroadcast(b.id, b.title)} className="p-1.5 rounded-lg hover:bg-danger-bg text-secondary hover:text-danger motion-safe:transition-colors opacity-0 group-hover:opacity-100" aria-label="Delete broadcast">
                        <Trash2 size={15} />
                      </button>
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
