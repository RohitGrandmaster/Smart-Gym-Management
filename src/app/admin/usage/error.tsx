'use client';
// RESPONSIBILITY: Error boundary for Admin Usage page.
import { RefreshCw } from 'lucide-react';

export default function AdminUsageError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4 p-6">
      <p className="text-base font-semibold text-foreground">Failed to load usage data</p>
      <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium active:scale-95 motion-safe:transition-all">
        <RefreshCw size={15} /> Try Again
      </button>
    </div>
  );
}
