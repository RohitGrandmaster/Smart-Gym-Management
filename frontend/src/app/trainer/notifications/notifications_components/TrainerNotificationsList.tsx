// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
import { NotificationItem } from '@/app/trainer/notifications/notifications_utils/useNotificationsPage';
import { X, Bell } from 'lucide-react';
import TrainerNotificationsEmptyState from '@/app/trainer/notifications/notifications_components/TrainerNotificationsEmptyState/TrainerNotificationsEmptyState';
import { useConfirm } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerConfirmProvider';

interface NotificationsListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TrainerNotificationsList({ notifications, onMarkAsRead, onDelete }: NotificationsListProps) {
  const { confirm } = useConfirm();
  
  if (notifications.length === 0) {
    return <TrainerNotificationsEmptyState />;
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          onMouseEnter={() => n.unread && onMarkAsRead(n.id)}
          className={`p-4 md:px-6 flex items-start justify-between group motion-safe:transition-colors ${n.unread ? 'bg-primary-subtle hover:bg-primary-subtle/80' : 'bg-card hover:bg-input'}`}
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
                message: 'Are you sure you want to delete this notification?',
                type: 'danger',
                confirmText: 'Delete'
              });
              if (ok) {
                onDelete(n.id);
              }
            }}
            className="text-secondary hover:text-danger p-2 rounded-md hover:bg-danger-bg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 motion-safe:transition-all focus:opacity-100"
            aria-label="Delete notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
