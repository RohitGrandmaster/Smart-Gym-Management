// RESPONSIBILITY: Notifications list with toolbar (search + filters) and row actions (mark read, delete).
'use client';

import { useNotificationsContext } from '@/app/manager/notifications/notifications_context/ManagerNotificationsContext';
import {
  NOTIFICATION_TYPE_STYLES,
  NOTIFICATION_PRIORITY_STYLES,
  NOTIFICATION_TYPE_OPTIONS,
  NOTIFICATION_PRIORITY_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from '@/app/manager/notifications/notifications_utils/ManagerNotificationsSharedConstants';
import { Search, Loader2, Bell, CheckCheck, Trash2, CheckCircle } from 'lucide-react';

export default function ManagerNotificationsTable() {
  const {
    notifications, fetchState, saving,
    search, setSearch,
    typeFilter, setTypeFilter,
    priorityFilter, setPriorityFilter,
    statusFilter, setStatusFilter,
    handleMarkRead, handleMarkAllRead, handleDelete,
  } = useNotificationsContext();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-border">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-input border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
            {NOTIFICATION_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Types' : o}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
            {NOTIFICATION_PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Priority' : o}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary">
            {NOTIFICATION_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Status' : o}</option>)}
          </select>
          <button
            onClick={handleMarkAllRead}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:opacity-90 motion-safe:transition-opacity disabled:opacity-50"
          >
            <CheckCheck size={14} /> Mark All Read
          </button>
        </div>
      </div>

      {/* List */}
      {fetchState === 'loading' ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 motion-safe:animate-spin text-primary" />
        </div>
      ) : fetchState === 'error' ? (
        <div className="py-16 text-center">
          <p className="text-sm text-danger font-medium">Failed to load notifications</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Bell size={36} className="mx-auto text-secondary opacity-40" />
          <p className="text-sm text-secondary font-medium">No notifications found</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {notifications.map(n => {
            const typeStyle = NOTIFICATION_TYPE_STYLES[n.type] ?? NOTIFICATION_TYPE_STYLES['SYSTEM'];
            const priorityStyle = NOTIFICATION_PRIORITY_STYLES[n.priority];
            const isUnread = n.status === 'UNREAD';

            return (
              <li key={n.id} className={`group flex items-start gap-4 px-5 py-4 motion-safe:transition-colors hover:bg-primary/5 ${isUnread ? 'bg-primary/[0.02]' : ''}`}>
                {/* Unread dot */}
                <div className="mt-1.5 shrink-0">
                  {isUnread
                    ? <span className="block w-2.5 h-2.5 rounded-full bg-primary" />
                    : <span className="block w-2.5 h-2.5 rounded-full bg-transparent border border-border" />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>{typeStyle.label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}>{n.priority}</span>
                    {n.memberName && <span className="text-xs text-secondary">— {n.memberName}</span>}
                  </div>
                  <p className={`text-sm font-semibold ${isUnread ? 'text-foreground' : 'text-secondary'}`}>{n.title}</p>
                  <p className="text-xs text-secondary mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-secondary/60 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-opacity">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      title="Mark as read"
                      className="p-2 rounded-lg hover:bg-success/10 text-secondary hover:text-success motion-safe:transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    title="Dismiss"
                    className="p-2 rounded-lg hover:bg-danger/10 text-secondary hover:text-danger motion-safe:transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
