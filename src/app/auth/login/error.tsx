// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Next.js Error Boundary specifically for the Login route to catch and display unhandled exceptions gracefully.
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Error logged
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-page items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong!</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-primary text-white rounded-lg transition-colors hover:bg-primary-hover">Try again</button>
    </div>
  );
}
