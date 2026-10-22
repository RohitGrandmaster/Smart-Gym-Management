// RESPONSIBILITY: Next.js error boundary for the /landing route segment.
// Displays a styled error card with a Retry button. Logs the error for observability.
// Rule 9: error.tsx must be a Client Component ('use client') per Next.js spec.
'use client';

import { useEffect } from 'react';

export default function LandingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error monitoring handled by provider
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-danger/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
        <h2 className="text-2xl font-black text-foreground">Oops! Something went wrong.</h2>
        <p className="text-secondary text-sm">
          We couldn't load the landing page. Please try refreshing.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-8 py-3 bg-danger hover:opacity-90 text-white font-bold rounded-xl transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
