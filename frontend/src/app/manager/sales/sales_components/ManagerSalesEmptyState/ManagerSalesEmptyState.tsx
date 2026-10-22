// RESPONSIBILITY: Renders the empty state UI for Sales module lists. Receives a message and optional subtext via props. No API calls.
'use client';

import { IndianRupee } from 'lucide-react';

export interface SalesEmptyStateProps {
  message: string;
  subtext?: string;
}

export default function ManagerSalesEmptyState({ message, subtext }: SalesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border border-border rounded-xl bg-card">
      <div className="w-12 h-12 rounded-full bg-primary-subtle flex items-center justify-center mb-3">
        <IndianRupee size={22} className="text-primary" />
      </div>
      <p className="text-base font-medium text-secondary">{message}</p>
      {subtext && <p className="text-sm text-secondary mt-1 opacity-70">{subtext}</p>}
    </div>
  );
}
