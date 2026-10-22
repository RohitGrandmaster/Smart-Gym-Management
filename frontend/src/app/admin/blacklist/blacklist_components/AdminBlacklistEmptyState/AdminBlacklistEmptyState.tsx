// RESPONSIBILITY: Empty state for the Blacklist table.
'use client';

import { Ban } from 'lucide-react';
import { useAdminBlacklistLogic } from '@/app/admin/blacklist/blacklist_context/useAdminBlacklistLogic';

export default function AdminBlacklistEmptyState() {
  const { openAdd } = useAdminBlacklistLogic();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-danger-bg flex items-center justify-center">
        <Ban size={28} className="text-danger" />
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">No blacklisted members</p>
        <p className="text-sm text-secondary mt-1">Blacklist a member to restrict their access across gyms</p>
      </div>
      <button onClick={openAdd} className="px-4 py-2 bg-danger text-white rounded-lg text-sm font-semibold hover:opacity-90 motion-safe:transition-opacity">
        Blacklist Member
      </button>
    </div>
  );
}
