// RESPONSIBILITY: Renders the sticky impersonation banner shown when admin is viewing a branch as manager. Provides exit button.
'use client';

import { LogOut, Building2, Eye } from 'lucide-react';
import { useAdminImpersonationStore } from '@/app/admin/admin_store/useAdminImpersonationStore';

export default function AdminImpersonationBanner() {
  const { impersonatedBranch, stopImpersonation } = useAdminImpersonationStore();

  if (!impersonatedBranch) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-warning/15 border-b-2 border-warning/40 px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-warning/20 rounded-lg">
          <Eye size={16} className="text-warning" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-warning uppercase tracking-wider">Manager View</span>
          <span className="text-secondary text-xs">—</span>
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-secondary" />
            <span className="text-sm font-semibold text-foreground">{impersonatedBranch.name}</span>
            <span className="text-xs text-secondary">({impersonatedBranch.location})</span>
          </div>
        </div>
      </div>
      <button
        onClick={stopImpersonation}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-warning/20 hover:bg-warning/30 border border-warning/40 rounded-lg text-xs font-bold text-warning motion-safe:transition-all motion-safe:duration-200 active:scale-95"
        aria-label="Exit manager view"
      >
        <LogOut size={13} />
        Exit Manager View
      </button>
    </div>
  );
}
