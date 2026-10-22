'use client';
// RESPONSIBILITY: Renders the empty state UI for the Plans table when no plans exist.
import { PackageOpen } from 'lucide-react';
interface PlansEmptyStateProps {
  onAddClick: () => void;
}

export default function SuperadminPlansEmptyState({ onAddClick }: PlansEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-secondary opacity-50" />
      </div>
      <h3 className="text-base font-semibold text-foreground">No Plans Yet</h3>
      <p className="text-sm text-secondary mt-1 max-w-xs">Create your first subscription plan to start onboarding gyms.</p>
      <button
        onClick={onAddClick}
        className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-in-out motion-safe:active:scale-95"
      >
        Create First Plan
      </button>
    </div>
  );
}
