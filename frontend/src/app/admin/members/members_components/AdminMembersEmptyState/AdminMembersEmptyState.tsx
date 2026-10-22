// RESPONSIBILITY: Renders the empty state for Admin Members when no results match filters.
'use client';

import { Users } from 'lucide-react';

interface AdminMembersEmptyStateProps {
  hasFilters: boolean;
}

export default function AdminMembersEmptyState({ hasFilters }: AdminMembersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-input flex items-center justify-center border border-border">
        <Users size={28} className="text-secondary" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">
          {hasFilters ? 'No members match your filters' : 'No members found'}
        </p>
        <p className="text-sm text-secondary mt-1">
          {hasFilters ? 'Try adjusting your search or filter criteria.' : 'Members will appear here once they are added via branch managers.'}
        </p>
      </div>
    </div>
  );
}
