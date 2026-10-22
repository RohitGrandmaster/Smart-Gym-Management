// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the empty state for the members list when no records exist or match filters.
import React from 'react';
import { Users } from 'lucide-react';

export default function TrainerMembersEmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-border">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
        <Users size={32} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {isFiltered ? 'No members found' : 'No members yet'}
      </h3>
      <p className="text-secondary text-center max-w-md">
        {isFiltered 
          ? 'Try adjusting your search or status filter to find the member you are looking for.' 
          : 'Your gym is currently empty. Add your first member to start managing their plans and payments!'}
      </p>
    </div>
  );
}

