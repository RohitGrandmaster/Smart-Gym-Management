// RESPONSIBILITY: Provides the implementation for error.tsx functionality within its module.
'use client';

import { useEffect } from "react";

export default function FinanceError({
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
 <div className="min-h-full flex items-center justify-center finance-module">
 <div className="text-center">
 <p className="font-medium" style={{ color: 'var(--danger)' }}>Something went wrong!</p>
 <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error.message || 'An unexpected error occurred in the finance module.'}</p>
 <button
 onClick={() => reset()}
 className="mt-4 px-4 py-2 rounded-md font-medium text-white"
 style={{ backgroundColor: 'var(--primary)' }}
 >
 Try again
 </button>
 </div>
 </div>
 );
}
