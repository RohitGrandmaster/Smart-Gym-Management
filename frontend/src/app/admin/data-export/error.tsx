'use client';
// RESPONSIBILITY: Error boundary for the Data Export page.
export default function DataExportError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <p className="text-danger font-semibold">Failed to load data export</p>
      <button onClick={reset} className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-medium">Try Again</button>
    </div>
  );
}
