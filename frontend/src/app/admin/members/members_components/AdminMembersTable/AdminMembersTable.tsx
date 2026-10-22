// RESPONSIBILITY: Renders the paginated members table with clickable rows, status badges, and branch info.
'use client';

import { useAdminMembersLogic } from '@/app/admin/members/members_context/useAdminMembersLogic';
import { useAdminMembersStore } from '@/app/admin/members/members_store/useAdminMembersStore';
import AdminMembersEmptyState from '@/app/admin/members/members_components/AdminMembersEmptyState/AdminMembersEmptyState';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { formatCurrency } from '@/lib/formatters';
import { ADMIN_MEMBERS_ITEMS_PER_PAGE } from '@/app/admin/members/members_utils/AdminMembersSharedConstants';

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-success-bg text-success',
  expired: 'bg-danger-bg text-danger',
  pending: 'bg-warning-bg text-warning',
  frozen: 'bg-info-bg text-info',
};

const TABLE_HEADERS = ['Member', 'Branch', 'Plan', 'Status', 'Expiry', 'Outstanding'];

export default function AdminMembersTable() {
  const { members, allFilteredCount, totalPages, selectedMember, setSelectedMember } = useAdminMembersLogic();
  const { search, statusFilter, branchFilter, expiryFilter, currentPage, setCurrentPage } = useAdminMembersStore();

  const hasFilters = search !== '' || statusFilter !== 'all' || branchFilter !== 'all' || expiryFilter !== 'all';

  if (members.length === 0) {
    return <AdminMembersEmptyState hasFilters={hasFilters} />;
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-border">
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className="hover:bg-primary/5 cursor-pointer motion-safe:transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-secondary">{m.phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{m.branchName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{m.planName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLES[m.status] ?? 'bg-input text-secondary'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground whitespace-nowrap">
                    {new Date(m.expiryDate).toLocaleDateString('en-IN')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${m.pendingAmount > 0 ? 'text-danger' : 'text-success'}`}>
                    {m.pendingAmount > 0 ? formatCurrency(m.pendingAmount) : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border">
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={allFilteredCount}
          itemsPerPage={ADMIN_MEMBERS_ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
