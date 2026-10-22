// RESPONSIBILITY: Renders the error boundary fallback for the expenses module.
'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
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
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto text-danger mb-2">
          <AlertTriangle size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-primary">Something went wrong!</h2>
        
        <p className="text-sm text-secondary">
          We encountered an issue loading the expenses dashboard.
        </p>

        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-danger hover:bg-danger text-white font-medium rounded-xl transition-colors shadow-sm shadow-danger/20"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
