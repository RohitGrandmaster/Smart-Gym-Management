'use client';
import { CreditCard } from 'lucide-react';

export default function AdminSubscriptionsError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <CreditCard size={40} className="text-danger opacity-60" />
      <p className="text-foreground font-semibold">Failed to load Subscription data</p>
      <button onClick={reset} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors">
        Try Again
      </button>
    </div>
  );
}
