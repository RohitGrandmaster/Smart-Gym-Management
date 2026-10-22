'use client';
// RESPONSIBILITY: Error boundary for the Reports page.
export default function ReportsError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <p className="text-danger font-semibold">Failed to load reports</p>
      <button onClick={reset} className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-medium">Try Again</button>
    </div>
  );
}
