'use client';
// RESPONSIBILITY: Renders the empty state UI for the Backups table when no backups exist.
import { DatabaseBackup } from 'lucide-react';

export default function SuperadminBackupsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
        <DatabaseBackup className="w-8 h-8 text-secondary opacity-50" />
      </div>
      <h3 className="text-base font-semibold text-foreground">No Backups Found</h3>
      <p className="text-sm text-secondary mt-1 max-w-xs">There are no backups available for this instance yet.</p>
    </div>
  );
}
