'use client';
// RESPONSIBILITY: Orchestrates the notifications list and actions (mark all read, clear all).
import { useAdminNotificationsPage } from '@/app/admin/notifications/notifications_utils/useAdminNotificationsPage';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import AdminNotificationsList from '@/app/admin/notifications/notifications_components/AdminNotificationsList/AdminNotificationsList';
import { CheckCheck, Trash2 } from 'lucide-react';

export default function AdminNotificationsClient() {
  const { notifications, markAllAsRead, clearAll, markAsRead, deleteNotification } = useAdminNotificationsPage();
  const { confirm } = useAdminConfirm();

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-header">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">All Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-secondary"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
          <button 
            onClick={async () => {
              const ok = await confirm({
                title: 'Clear Notifications',
                message: 'Are you sure you want to clear all notifications?',
                type: 'danger',
                confirmText: 'Clear All'
              });
              if (ok) {
                clearAll();
              }
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 text-sm text-secondary hover:text-danger transition-colors disabled:opacity-50 disabled:hover:text-secondary"
          >
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>
      
      <AdminNotificationsList 
        notifications={notifications} 
        onMarkAsRead={markAsRead} 
        onDelete={deleteNotification} 
      />
    </div>
  );
}
