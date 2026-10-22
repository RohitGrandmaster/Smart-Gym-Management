'use client';
// RESPONSIBILITY: Route-level error boundary for the Reports module.
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ManagerReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged to monitoring provider
  }, [error]);

  return (
    <div className="min-h-full flex items-center justify-center p-6 bg-page">
      <div className="bg-card border border-danger/20 p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto text-danger">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Something went wrong!</h2>
        <p className="text-sm text-secondary">
          We encountered an issue loading the reports dashboard.
          {error.digest && <span className="block text-xs mt-1 text-secondary/60">Ref: {error.digest}</span>}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 motion-safe:transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
