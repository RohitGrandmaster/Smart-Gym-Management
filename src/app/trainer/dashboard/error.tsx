// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the error boundary fallback for the dashboard module.
'use client';

import { useEffect } from "react";

export default function DashboardError({
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
 <div className="min-h-full flex items-center justify-center">
 <div className="text-center">
 <p className="font-medium text-danger">Something went wrong!</p>
 <p className="text-sm mt-1 text-danger">{error.message || 'An unexpected error occurred in the dashboard.'}</p>
 <button
 onClick={() => reset()}
 className="mt-4 px-4 py-2 rounded-md font-medium text-white bg-primary"
 >
 Try again
 </button>
 </div>
 </div>
 );
}

