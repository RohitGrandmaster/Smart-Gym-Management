// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Skeleton loading state for Notifications page.
import { Bell } from 'lucide-react';

export default function NotificationsLoading() {
  return (
    <div className="p-4 md:p-8 motion-safe:animate-pulse">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-2 text-primary">
          <Bell className="text-secondary" />
          <div className="h-8 bg-muted rounded w-32"></div>
        </h1>
        <div className="h-4 bg-muted rounded w-64"></div>
      </div>
      <div className="max-w-2xl border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-input flex justify-between">
          <div className="h-5 bg-muted rounded w-24"></div>
          <div className="h-5 bg-muted rounded w-32"></div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-start">
              <div className="w-2 h-2 rounded-full bg-muted mt-2"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

