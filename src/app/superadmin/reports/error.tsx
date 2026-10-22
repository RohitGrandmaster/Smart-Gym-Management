'use client';
// RESPONSIBILITY: Route-level error boundary for the Reports module.

interface ReportsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ReportsError({ error, reset }: ReportsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-8">
      <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
        <span className="text-danger text-xl">!</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Failed to load Reports</h2>
        <p className="text-secondary text-sm max-w-sm">
          Something went wrong while loading reports data. Please try again.
        </p>
        {error.digest && (
          <p className="text-disabled text-xs mt-2">Error ID: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-black font-semibold rounded-lg text-sm motion-safe:transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
