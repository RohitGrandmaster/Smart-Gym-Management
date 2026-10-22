// RESPONSIBILITY: Renders the paginated table of all gym memberships with status filter tabs. Receives data via ManagerSalesContext. No API calls.
'use client';

import { useState } from 'react';
import { useSalesContext } from '@/app/manager/sales/sales_context/ManagerSalesContext';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import ManagerSalesEmptyState from '@/app/manager/sales/sales_components/ManagerSalesEmptyState/ManagerSalesEmptyState';
import type { Member } from '@/app/manager/members/members_types/ManagerMembersTypes';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

const MEMBERSHIP_FILTERS = ['All', 'Active', 'Expiring Soon', 'Expired'] as const;
const TABLE_HEADERS = ['Member', 'Plan', 'Start', 'End Date', 'Status', 'Amount', 'Days Left'] as const;

/** Returns the Tailwind text color class for the days-left column based on urgency. */
function getDaysLeftColorClass(daysLeft: number): string {
  if (daysLeft === 0) return 'text-danger';
  if (daysLeft <= 7) return 'text-danger';
  if (daysLeft <= 30) return 'text-warning';
  return 'text-success';
}

export default function ManagerSalesAllMemberships() {
  const [filter, setFilter] = useState('All');
  const { currentPage, setCurrentPage, allMemberships, allMembershipsTotal, fetchState } = useSalesContext();
  const [now] = useState(() => Date.now());

  const totalPages = Math.ceil(allMembershipsTotal / MANAGER_ITEMS_PER_PAGE) || 1;

  const filteredMemberships = allMemberships.filter((m: Member) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return m.status === 'ACTIVE' && new Date(m.expiryDate).getTime() >= now;
    if (filter === 'Expired') return new Date(m.expiryDate).getTime() < now;
    if (filter === 'Expiring Soon') {
      const daysLeft = Math.floor((new Date(m.expiryDate).getTime() - now) / 86400000);
      return daysLeft >= 0 && daysLeft <= 7;
    }
    return true;
  });

  if (fetchState === 'loading') {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="motion-safe:animate-pulse h-12 bg-card rounded border border-border" />
        ))}
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load memberships.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {MEMBERSHIP_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium border transition-colors ${
              f === filter
                ? 'bg-primary text-white border-transparent'
                : 'border-border text-secondary hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-input">
            <tr>
              {TABLE_HEADERS.map(h => (
                <th key={h} className="text-left text-xs font-semibold text-secondary uppercase tracking-wider px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMemberships.map((r: Member) => (
              <tr key={r.id} className="hover:bg-primary-subtle transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-sm text-secondary">{r.plan?.name ?? `Plan #${r.planId}`}</td>
                <td className="px-4 py-3 text-sm text-secondary">{new Date(r.joinDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-secondary">{new Date(r.expiryDate).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    r.status === 'ACTIVE'
                      ? 'bg-success-bg text-success'
                      : 'bg-danger-bg text-danger'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">₹{r.paidAmount?.toLocaleString('en-IN') || 0}</td>
                <td className={`px-4 py-3 text-sm font-medium ${getDaysLeftColorClass(
                  Math.max(0, Math.floor((new Date(r.expiryDate).getTime() - now) / 86400000))
                )}`}>
                  {new Date(r.expiryDate).getTime() < now ? 'Expired' : `${Math.floor((new Date(r.expiryDate).getTime() - now) / 86400000)} days`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredMemberships.length === 0 && (
        <ManagerSalesEmptyState message="No memberships found" subtext="Try adjusting your filters." />
      )}

      <div className="mt-4 pt-4 border-t border-border">
          <ManagerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </div>
  );
}
