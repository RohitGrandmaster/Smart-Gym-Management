// RESPONSIBILITY: Tax-ready P&L statement table per gym.
'use client';

import { useAdminPayoutsLogic } from '@/app/admin/payouts/payouts_context/useAdminPayoutsLogic';
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import { fmt } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';

const HEADERS = ['Gym', 'Month', 'Revenue', 'COGS', 'Gross Profit', 'Staff Cost', 'Rent & Utilities', 'Marketing', 'Misc', 'EBITDA', 'Tax', 'Net Profit'];

export default function AdminPayoutsPnLStatement() {
  const { pnlData, loadingPnL } = useAdminPayoutsLogic();

  if (loadingPnL) return <AdminTableSkeleton rows={4} cols={HEADERS.length} />;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground">Profit & Loss Statement</p>
        <p className="text-xs text-secondary mt-0.5">Tax-ready breakdown per gym per month</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5">
              {HEADERS.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pnlData.map((p) => (
              <tr key={`${p.gymId}-${p.month}`} className="hover:bg-primary/5 motion-safe:transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{p.gymName}</td>
                <td className="px-4 py-3 text-sm text-secondary">{p.month}</td>
                <td className="px-4 py-3 text-sm text-foreground">{fmt(p.revenue)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.cogs)}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{fmt(p.grossProfit)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.staffCost)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.rentUtilities)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.marketing)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.miscExpenses)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-info">{fmt(p.ebitda)}</td>
                <td className="px-4 py-3 text-sm text-danger">{fmt(p.tax)}</td>
                <td className="px-4 py-3 text-sm font-bold text-success">{fmt(p.netProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
