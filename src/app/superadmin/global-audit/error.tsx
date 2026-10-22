// RESPONSIBILITY: Core infrastructure component for routing, loading, and error boundaries in the module.
'use client';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error locally
  return (
    <div className="min-h-screen flex items-center justify-center bg-page p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-danger-bg flex items-center justify-center mx-auto">
          <AlertCircle className="text-danger w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Failed to Load Audits</h2>
          <p className="text-sm text-secondary">
            We encountered an unexpected error while rendering the audit logs.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium motion-safe:transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> Try again
        </button>
      </div>
    </div>
  );
}

