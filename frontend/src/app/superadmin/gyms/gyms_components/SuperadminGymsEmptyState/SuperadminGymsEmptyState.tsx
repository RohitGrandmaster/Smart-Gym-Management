'use client';
// RESPONSIBILITY: Renders the empty state UI for the Gyms table when no gyms match the current search. Shows icon, message, and search adjustment hint.
import { Ban } from 'lucide-react';

export default function SuperadminGymsEmptyState() {
  return (
    <div className="p-12 flex flex-col items-center text-secondary">
      <div className="bg-card p-4 rounded-full border border-border mb-3">
        <Ban className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="text-base font-medium text-foreground">No gyms found</h3>
      <p className="text-sm mt-1 max-w-sm text-center">We couldn&apos;t find any gyms matching your current search. Try adjusting your filters.</p>
    </div>
  );
}
