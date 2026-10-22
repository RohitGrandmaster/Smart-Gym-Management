// RESPONSIBILITY: Announcements table with search/filter toolbar, status badges, pin/edit/delete row actions.
'use client';

import { Search, Plus, Pin, PinOff, Edit2, Trash2, Eye, Megaphone, RotateCcw } from 'lucide-react';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import AdminTableSkeleton from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import { useAdminAnnouncementsLogic } from '@/app/admin/announcements/announcements_context/useAdminAnnouncementsLogic';
import { useAdminAnnouncementsStore } from '@/app/admin/announcements/announcements_store/useAdminAnnouncementsStore';
import {
  ANNOUNCEMENT_STATUS_OPTIONS,
  ANNOUNCEMENT_PRIORITY_OPTIONS,
  ANNOUNCEMENT_GYM_OPTIONS,
} from '@/app/admin/announcements/announcements_utils/AdminAnnouncementsSharedConstants';
import type { AnnouncementStatus, AnnouncementPriority } from '@/app/admin/announcements/announcements_types/announcements_types';

const STATUS_STYLES: Record<AnnouncementStatus, string> = {
  active:    'bg-success-bg text-success border-success/30',
  scheduled: 'bg-info-bg text-info border-info/30',
  expired:   'bg-danger-bg text-danger border-danger/30',
  draft:     'bg-input text-secondary border-border',
};

const PRIORITY_STYLES: Record<AnnouncementPriority, string> = {
  high:   'bg-danger-bg text-danger',
  medium: 'bg-warning-bg text-warning',
  low:    'bg-success-bg text-success',
};

export default function AdminAnnouncementsTable() {
  const {
    paginated, fetchState, openCreate, openEdit,
    deleteAnnouncement, togglePin,
    currentPage, setCurrentPage, totalPages, totalItems,
  } = useAdminAnnouncementsLogic();

  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    gymFilter, setGymFilter,
  } = useAdminAnnouncementsStore();

  const hasFilters = search || statusFilter !== 'all' || priorityFilter !== 'all' || gymFilter !== 'all';

  if (fetchState === 'loading') return <AdminTableSkeleton rows={6} cols={7} />;

  if (fetchState === 'error') return (
    <div className="bg-card border border-border rounded-xl p-10 text-center">
      <Megaphone size={32} className="mx-auto mb-3 text-danger opacity-60" />
      <p className="text-sm text-danger font-medium">Failed to load announcements</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search announcements"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors shrink-0"
          >
            <Plus size={15} /> New Announcement
          </button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            aria-label="Filter by status"
          >
            {ANNOUNCEMENT_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            aria-label="Filter by priority"
          >
            <option value="all">All Priority</option>
            {ANNOUNCEMENT_PRIORITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={gymFilter}
            onChange={e => setGymFilter(e.target.value)}
            className="bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            aria-label="Filter by gym"
          >
            {ANNOUNCEMENT_GYM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); setGymFilter('all'); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-input border border-border rounded-xl text-xs text-secondary hover:text-foreground motion-safe:transition-colors"
              aria-label="Reset filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
          <span className="ml-auto text-xs text-secondary">{totalItems} announcement{totalItems !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-border">
                {['', 'Title & Preview', 'Audience', 'Gyms', 'Schedule', 'Priority', 'Status', 'Views', 'Actions'].map((h, i) => (
                  <th key={i} className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <Megaphone size={32} className="mx-auto mb-3 opacity-30 text-secondary" />
                    <p className="text-sm text-secondary font-medium">No announcements found</p>
                    <button
                      onClick={openCreate}
                      className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors"
                    >
                      Create First Announcement
                    </button>
                  </td>
                </tr>
              ) : paginated.map(a => (
                <tr key={a.id} className="hover:bg-input/40 motion-safe:transition-colors group">
                  {/* Pin indicator */}
                  <td className="p-4 w-8">
                    {a.isPinned && <Pin size={13} className="text-warning" />}
                  </td>
                  {/* Title + preview */}
                  <td className="p-4 max-w-xs">
                    <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                    <p className="text-xs text-secondary truncate mt-0.5">{a.body.slice(0, 65)}…</p>
                  </td>
                  {/* Audience */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {a.audience.map(aud => (
                        <span key={aud} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium capitalize">{aud}</span>
                      ))}
                    </div>
                  </td>
                  {/* Gyms */}
                  <td className="p-4 text-xs text-secondary whitespace-nowrap">{a.gymNames.join(', ')}</td>
                  {/* Schedule */}
                  <td className="p-4 text-xs text-secondary whitespace-nowrap">
                    <p>{new Date(a.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                    <p className="text-secondary/60">→ {new Date(a.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </td>
                  {/* Priority */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${PRIORITY_STYLES[a.priority]}`}>
                      {a.priority}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${STATUS_STYLES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  {/* Views */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-xs text-secondary">
                      <Eye size={12} /> {a.viewCount.toLocaleString('en-IN')}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
                      <button
                        onClick={() => togglePin(a.id)}
                        className={`p-1.5 rounded-lg motion-safe:transition-colors ${a.isPinned ? 'text-warning hover:bg-warning-bg' : 'text-secondary hover:text-warning hover:bg-warning-bg'}`}
                        aria-label={a.isPinned ? 'Unpin announcement' : 'Pin announcement'}
                      >
                        {a.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-input motion-safe:transition-colors"
                        aria-label="Edit announcement"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(a.id, a.title)}
                        className="p-1.5 rounded-lg text-secondary hover:text-danger hover:bg-danger-bg motion-safe:transition-colors"
                        aria-label="Delete announcement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-border">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={10}
            />
          </div>
        )}
      </div>
    </div>
  );
}
