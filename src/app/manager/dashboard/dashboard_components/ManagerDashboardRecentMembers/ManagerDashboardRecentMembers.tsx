// RESPONSIBILITY: Renders the recent members table on the dashboard with a local search filter.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useDashboardContext } from '@/app/manager/dashboard/dashboard_context/ManagerDashboardContext';
import { DASHBOARD_RECENT_MEMBERS_PAGE_SIZE, RECENT_MEMBERS_HEADERS, DASHBOARD_STATUS_STYLES, formatCurrency } from '@/app/manager/dashboard/dashboard_utils/ManagerDashboardSharedConstants';
import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';

export default function ManagerDashboardRecentMembers() {
  const { stats } = useDashboardContext();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  if (!stats) return null;
  const members = stats.recentMembers || [];

  const filtered = members.filter(m => {
    const planName = typeof m.plan === 'string' ? m.plan : m.plan?.name || '';
    return m.name?.toLowerCase().includes(search.toLowerCase()) ||
           planName?.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / DASHBOARD_RECENT_MEMBERS_PAGE_SIZE) || 1;
  const paginated = filtered.slice((currentPage - 1) * DASHBOARD_RECENT_MEMBERS_PAGE_SIZE, currentPage * DASHBOARD_RECENT_MEMBERS_PAGE_SIZE);

  return (
    <div className="xl:col-span-2 rounded-xl shadow-sm border overflow-hidden bg-card border-border">
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-border">
        <h2 className="font-semibold text-primary">Recent Members</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value);  }}
              placeholder="Search members..."
              className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page w-40 sm:w-52 bg-input text-primary"
            />
          </div>
          <Link href="/manager/members" className="text-sm font-medium hover:underline whitespace-nowrap text-primary">View all</Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/5">
            <tr>
              {RECENT_MEMBERS_HEADERS.map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-6 py-3 text-secondary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map(m => {
              const statusStyle = DASHBOARD_STATUS_STYLES[m.status] || { bg: 'bg-input', text: 'text-secondary' };
              return (
                <tr key={m.id} className="transition-colors hover:bg-primary/5 bg-card">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm bg-primary/10 text-primary">
                        {m.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-primary">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {typeof m.plan === 'string' ? m.plan : m.plan?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {new Date(m.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">{formatCurrency(m.paidAmount)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-secondary">
                  {search ? `No members matching "${search}"` : 'No members yet. Add your first member!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-border mt-2 p-2">
          <ManagerPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    </div>
  );
}

