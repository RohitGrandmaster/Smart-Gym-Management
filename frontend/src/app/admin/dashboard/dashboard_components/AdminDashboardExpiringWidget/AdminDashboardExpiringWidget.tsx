// RESPONSIBILITY: Renders the expiring memberships widget showing members expiring this week and month across all branches.
'use client';

import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const EXPIRING_MOCK = [
  { id: 'm10', name: 'Pooja Iyer', branch: 'Downtown Core', plan: 'Silver Plan', expiryDate: '2025-01-20', daysLeft: 3 },
  { id: 'm11', name: 'Suresh Kumar', branch: 'Uptown Plaza', plan: 'Gold Plan', expiryDate: '2025-01-18', daysLeft: 1 },
  { id: 'm2', name: 'Priya Patel', branch: 'Uptown Plaza', plan: 'Silver Plan', expiryDate: '2025-01-28', daysLeft: 11 },
  { id: 'm6', name: 'Divya Singh', branch: 'Westside Mall', plan: 'Silver Plan', expiryDate: '2025-02-14', daysLeft: 28 },
  { id: 'm1', name: 'Rahul Sharma', branch: 'Downtown Core', plan: 'Gold Plan', expiryDate: '2025-02-10', daysLeft: 24 },
];

export default function AdminDashboardExpiringWidget() {
  const critical = EXPIRING_MOCK.filter((m) => m.daysLeft <= 7);
  const upcoming = EXPIRING_MOCK.filter((m) => m.daysLeft > 7);

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-warning/20 rounded-xl">
            <Clock size={18} strokeWidth={2} className="text-warning" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Expiring Memberships</h2>
            <p className="text-xs text-secondary">Needs attention</p>
          </div>
        </div>
        {critical.length > 0 && (
          <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {critical.length} This Week
          </span>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {critical.length > 0 && (
          <p className="text-xs font-bold text-danger uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle size={11} /> Expiring This Week
          </p>
        )}
        {EXPIRING_MOCK.map((m) => (
          <div key={m.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 motion-safe:transition-colors ${
            m.daysLeft <= 7 ? 'bg-danger/10 border-danger/20' : 'bg-warning/5 border-warning/10'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                <p className="text-xs text-secondary truncate">{m.branch} · {m.plan}</p>
              </div>
            </div>
            <span className={`text-xs font-bold whitespace-nowrap flex-shrink-0 ${m.daysLeft <= 7 ? 'text-danger' : 'text-warning'}`}>
              {m.daysLeft}d left
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/admin/members?expiryFilter=this_month"
        className="w-full mt-4 py-2 border border-border rounded-lg text-xs font-bold text-secondary hover:text-foreground hover:bg-primary/5 motion-safe:transition-colors flex items-center justify-center gap-1"
      >
        View All Expiring <ChevronRight size={13} />
      </Link>
    </div>
  );
}
