// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the error boundary for the Notifications module.
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logger.error('Notifications Module Error:', error);
  }, [error]);

  return (
    <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Notifications</h2>
      <p className="text-secondary mb-8 max-w-md">
        We encountered a problem while trying to fetch your notifications. Please try again.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-primary"
      >
        <RefreshCcw size={18} />
        Retry
      </button>
    </div>
  );
}

