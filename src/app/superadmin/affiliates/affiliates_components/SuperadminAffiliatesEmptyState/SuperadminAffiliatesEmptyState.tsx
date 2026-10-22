'use client';
// RESPONSIBILITY: Renders the empty state UI for the Affiliates table when no affiliates exist. Shows icon, message, and CTA to add first affiliate.
import { Users } from 'lucide-react';
interface AffiliatesEmptyStateProps {
  onAddClick: () => void;
}

export default function SuperadminAffiliatesEmptyState({ onAddClick }: AffiliatesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-secondary opacity-50" />
      </div>
      <h3 className="text-base font-semibold text-foreground">No Affiliates Yet</h3>
      <p className="text-sm text-secondary mt-1 max-w-xs">Add your first affiliate partner to start tracking referrals and commissions.</p>
      <button
        onClick={onAddClick}
        className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:active:scale-95"
      >
        Add First Affiliate
      </button>
    </div>
  );
}
