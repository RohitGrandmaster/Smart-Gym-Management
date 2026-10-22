'use client';
// RESPONSIBILITY: Renders the Broadcasts data table shell (header + rows). Delegates row rendering to BroadcastsTableRow. No API calls.
import { useState } from 'react';
import SuperadminBroadcastStatusBadge from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastStatusBadge/SuperadminBroadcastStatusBadge';
import { Send, Edit2, Trash2 } from 'lucide-react';
import { useSuperadminConfirm } from '@/app/superadmin/superadmin_components/SuperadminFeedback/SuperadminConfirmProvider';
import SuperadminBroadcastsEmptyState from '@/app/superadmin/broadcasts/broadcasts_components/SuperadminBroadcastsEmptyState/SuperadminBroadcastsEmptyState';
import type { BroadcastsTableProps } from '@/app/superadmin/broadcasts/superadmin_broadcasts_types/superadmin_broadcasts_types';
import SuperadminPagination from '@/app/superadmin/superadmin_components/SuperadminShared/SuperadminPagination';

const ITEMS_PER_PAGE = 10;

export default function SuperadminBroadcastsTable({ broadcasts, onSend, onEdit, onDelete, onCreateClick }: BroadcastsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { confirm } = useSuperadminConfirm();

  const totalPages = Math.ceil(broadcasts.length / ITEMS_PER_PAGE) || 1;
  const paginatedBroadcasts = broadcasts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-96">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Audience</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider">Scheduled / Sent Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedBroadcasts.length === 0 ? (
              <tr>
                <td colSpan={5}><SuperadminBroadcastsEmptyState onCreateClick={onCreateClick} /></td>
              </tr>
            ) : (
              paginatedBroadcasts.map((bc) => (
                <tr 
                  key={bc.id} 
                  className="hover:bg-primary/5 motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out group cursor-pointer"
                  onClick={() => onEdit(bc)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{bc.title}</span>
                      <span className="text-xs text-secondary truncate max-w-xs">{bc.content}</span>
                    </div>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-subtle text-primary border border-primary/20">
                    {bc.targetGymIds && bc.targetGymIds.length > 0 ? `${bc.targetGymIds.length} Gym(s)` : 'All Gyms'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <SuperadminBroadcastStatusBadge status={bc.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                  {bc.status === 'SCHEDULED' && bc.scheduledDate ? new Date(bc.scheduledDate).toLocaleString() : ''}
                  {bc.status === 'SENT' && bc.sentDate ? new Date(bc.sentDate).toLocaleString() : ''}
                  {bc.status === 'DRAFT' && '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {bc.status === 'DRAFT' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSend(bc.id); }}
                        className="p-1.5 text-secondary hover:text-primary hover:bg-primary-subtle rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out"
                        title="Send Now"
                        aria-label={`Send broadcast: ${bc.title}`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(bc); }}
                      className="p-1.5 text-secondary hover:text-primary hover:bg-primary-subtle rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out"
                      title="Edit Broadcast"
                      aria-label={`Edit broadcast: ${bc.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        const ok = await confirm({
                          title: 'Delete Broadcast',
                          message: `Are you sure you want to delete broadcast "${bc.title}"? This action cannot be undone.`,
                          type: 'danger',
                          confirmText: 'Delete'
                        });
                        if (ok) {
                          onDelete(bc.id); 
                        }
                      }}
                      className="p-1.5 text-secondary hover:text-danger hover:bg-danger-bg/10 rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out"
                      title="Delete Broadcast"
                      aria-label={`Delete broadcast: ${bc.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <SuperadminPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
