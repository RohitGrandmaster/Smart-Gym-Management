// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
import { NotificationItem } from '@/app/admin/notifications/notifications_utils/useAdminNotificationsPage';
import { X, Bell } from 'lucide-react';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';

interface NotificationsListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminNotificationsList({ notifications, onMarkAsRead, onDelete }: NotificationsListProps) {
  const { confirm } = useAdminConfirm();

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-secondary" />
        </div>
        <h3 className="text-lg font-medium text-foreground">You&apos;re all caught up!</h3>
        <p className="text-sm text-secondary mt-1">No new notifications to show right now.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          onMouseEnter={() => n.unread && onMarkAsRead(n.id)}
          className={`p-4 md:px-6 flex items-start justify-between group transition-colors ${n.unread ? 'bg-primary-subtle hover:bg-primary-subtle/80' : 'bg-card hover:bg-input'}`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? 'bg-primary' : 'bg-transparent'}`} />
            <div>
              <p className={`text-sm md:text-base ${n.unread ? 'text-foreground font-medium' : 'text-secondary'}`}>{n.text}</p>
              <span className="text-xs text-secondary mt-1 block">{n.time}</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              const ok = await confirm({
                title: 'Delete Notification',
                message: 'Delete this notification?',
                type: 'danger',
                confirmText: 'Delete'
              });
              if (ok) {
                onDelete(n.id);
              }
            }}
            className="text-secondary hover:text-danger p-2 rounded-md hover:bg-danger-bg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all focus:opacity-100"
            aria-label="Delete notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
