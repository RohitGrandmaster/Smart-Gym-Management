// RESPONSIBILITY: Table showing blacklisted members with toggle and remove actions.
'use client';

import { Globe, Building2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useAdminBlacklistLogic } from '@/app/admin/blacklist/blacklist_context/useAdminBlacklistLogic';
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import AdminBlacklistEmptyState from '@/app/admin/blacklist/blacklist_components/AdminBlacklistEmptyState/AdminBlacklistEmptyState';

const HEADERS = ['Member', 'Contact', 'Reason', 'Scope', 'Blacklisted By', 'Date', 'Status', 'Actions'];

export default function AdminBlacklistTable() {
  const { members, fetchState, removeFromBlacklist, toggleBlacklist, currentPage, setCurrentPage, totalPages, totalItems } = useAdminBlacklistLogic();

  if (fetchState === 'loading') return <AdminTableSkeleton rows={5} cols={HEADERS.length} />;
  if (members.length === 0) return <AdminBlacklistEmptyState />;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-danger/5">
              {HEADERS.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-danger/5 motion-safe:transition-colors group">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{m.memberName}</p>
                  <p className="text-xs text-secondary">ID: {m.memberId}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-foreground">{m.memberPhone}</p>
                  <p className="text-xs text-secondary truncate max-w-40">{m.memberEmail}</p>
                </td>
                <td className="px-4 py-3 max-w-56">
                  <p className="text-sm text-foreground line-clamp-2">{m.reason}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${m.scope === 'global' ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'}`}>
                    {m.scope === 'global' ? <Globe size={11} /> : <Building2 size={11} />}
                    {m.scope === 'global' ? 'Global' : m.assignedGymNames.join(', ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-secondary">{m.blacklistedBy}</td>
                <td className="px-4 py-3 text-sm text-secondary whitespace-nowrap">{m.blacklistedAt}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.isActive ? 'bg-danger-bg text-danger' : 'bg-input text-secondary'}`}>
                    {m.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity">
                    <button onClick={() => toggleBlacklist(m.id)} className="p-1.5 rounded-lg hover:bg-input text-secondary hover:text-foreground motion-safe:transition-colors" aria-label="Toggle blacklist">
                      {m.isActive ? <ToggleRight size={16} className="text-danger" /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => removeFromBlacklist(m.id, m.memberName)} className="p-1.5 rounded-lg hover:bg-danger-bg text-secondary hover:text-danger motion-safe:transition-colors" aria-label="Remove from blacklist">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border">
        <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={totalItems} itemsPerPage={10} />
      </div>
    </div>
  );
}
