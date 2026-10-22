// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function TrainerLibraryEmptyState({ type = 'Exercises' }: { type?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-input rounded-full flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No {type} Found</h3>
      <p className="text-secondary text-sm text-center max-w-md">
        No {type.toLowerCase()} exist in your library yet.
      </p>
    </div>
  );
}
