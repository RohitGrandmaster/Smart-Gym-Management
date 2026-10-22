// RESPONSIBILITY: Renders high-level KPIs for the Expenses module.
'use client';

import { useManagerExpensesStore } from '@/app/manager/expenses/expenses_store/useManagerExpensesStore';
import { IndianRupee, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants'; // Reusing formatCurrency

export default function ManagerExpensesKPIs() {
  const stats = useManagerExpensesStore(s => s.stats);
  const fetchState = useManagerExpensesStore(s => s.fetchState);

  if (fetchState === 'loading' || fetchState === 'error') return null; // Let Suspense/Main handle it

  const KPI_CARDS = [
    { label: 'Total Expenses (All Time)', value: formatCurrency(stats.totalAmount), icon: IndianRupee, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Expenses This Month', value: formatCurrency(stats.thisMonthAmount), icon: TrendingDown, color: 'text-info', bg: 'bg-info-bg' },
    { label: 'Pending Dues', value: formatCurrency(stats.pendingAmount), icon: Clock, color: 'text-danger', bg: 'bg-danger-bg' },
    { label: 'Total Paid', value: formatCurrency(stats.paidAmount), icon: CheckCircle, color: 'text-success', bg: 'bg-success-bg' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPI_CARDS.map(kpi => (
        <div key={kpi.label} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
            <kpi.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
