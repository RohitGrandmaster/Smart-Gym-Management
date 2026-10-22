// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the empty state for notifications list.
import { BellOff } from 'lucide-react';

export default function TrainerNotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <BellOff className="w-6 h-6 text-secondary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">No notifications</h3>
      <p className="text-sm text-secondary max-w-sm">
        You are all caught up! New alerts and messages will appear here.
      </p>
    </div>
  );
}

