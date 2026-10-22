'use client';
// RESPONSIBILITY: Route-level error boundary for the Notifications module.
import { Bell } from 'lucide-react';

export default function ManagerNotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-10 max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto">
          <Bell size={24} className="text-danger" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Notifications Unavailable</h2>
        <p className="text-sm text-secondary">
          Something went wrong loading your notifications.
          {error.digest && <span className="block text-xs mt-1 text-secondary/60">Ref: {error.digest}</span>}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:opacity-90 motion-safe:transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
