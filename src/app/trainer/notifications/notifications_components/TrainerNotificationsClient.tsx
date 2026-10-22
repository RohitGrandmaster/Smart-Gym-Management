// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
'use client';
// RESPONSIBILITY: Orchestrates the notifications list and actions (mark all read, clear all).
import { useNotificationsPage } from '@/app/trainer/notifications/notifications_utils/useNotificationsPage';
import TrainerNotificationsList from '@/app/trainer/notifications/notifications_components/TrainerNotificationsList';
import { CheckCheck, Trash2 } from 'lucide-react';

export default function TrainerNotificationsClient() {
  const { notifications, markAllAsRead, clearAll, markAsRead, deleteNotification } = useNotificationsPage();

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
            className="flex items-center gap-2 text-sm text-secondary hover:text-primary motion-safe:transition-colors disabled:opacity-50 disabled:hover:text-secondary"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
          <button 
            onClick={() => {
              // TODO: Replace with custom ConfirmationDrawer/Modal as per Rule 4
              clearAll();
            }}
            disabled={notifications.length === 0}
            className="flex items-center gap-2 text-sm text-secondary hover:text-danger motion-safe:transition-colors disabled:opacity-50 disabled:hover:text-secondary"
          >
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>
      
      <TrainerNotificationsList 
        notifications={notifications} 
        onMarkAsRead={markAsRead} 
        onDelete={deleteNotification} 
      />
    </div>
  );
}

