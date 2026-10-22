// RESPONSIBILITY: Renders the pending payments list on the dashboard with a local search filter.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, BellRing } from 'lucide-react';
import { useDashboardContext } from '@/app/manager/dashboard/dashboard_context/ManagerDashboardContext';
import { formatCurrency } from '@/app/manager/dashboard/dashboard_utils/ManagerDashboardSharedConstants';

export default function PendingPayments() {
  const { stats } = useDashboardContext();
  const [search, setSearch] = useState('');
  const [remindedId, setRemindedId] = useState<string | null>(null);

  if (!stats) return null;
  const list = stats.pendingPaymentsList || [];

  const filtered = list.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl shadow-sm border p-5 bg-card border-border">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-semibold text-primary">Pending Dues</h2>
        <span className="bg-danger/10 text-danger px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          {filtered.length}
        </span>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page bg-input text-primary"
        />
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 6).map(p => (
          <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0 border-border group">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-danger-bg text-danger">
                {p.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{p.name}</p>
                <p className="text-xs text-secondary">
                  Expires: {new Date(p.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-danger">{formatCurrency(p.pendingAmount)}</p>
              <button
                onClick={() => setRemindedId(p.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  remindedId === p.id 
                    ? 'text-success bg-success-bg' 
                    : 'text-secondary hover:text-warning hover:bg-warning-bg opacity-0 group-hover:opacity-100 focus:opacity-100 motion-safe:transition-opacity'
                }`}
                title="Send Reminder"
              >
                <BellRing size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-center py-4 text-secondary">
            {search ? `No results for "${search}"` : 'No pending payments 🎉'}
          </p>
        )}
      </div>

      <Link href="/manager/finance" className="mt-3 block w-full text-center text-sm font-medium text-primary">
        View all pending
      </Link>
    </div>
  );
}
