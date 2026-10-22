// RESPONSIBILITY: Table showing monthly payout summary per gym with mark-as-paid action.
'use client';

import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useAdminPayoutsLogic } from '@/app/admin/payouts/payouts_context/useAdminPayoutsLogic';
import { AdminTableSkeleton } from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import { fmt } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';
import { PAYOUT_MONTH_OPTIONS, PAYOUT_GYM_OPTIONS, PAYOUT_STATUS_OPTIONS } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-success-bg text-success',
  pending: 'bg-warning-bg text-warning',
  processing: 'bg-info-bg text-info',
};

const HEADERS = ['Gym', 'Month', 'Gross Revenue', 'Payroll', 'Expenses', 'Platform Fee', 'Net Profit', 'Status', 'Actions'];

export default function AdminPayoutsSummaryTable() {
  const { payouts, fetchState, markPaid, currentPage, setCurrentPage, totalPages, totalItems, monthFilter, setMonthFilter, gymFilter, setGymFilter, statusFilter, setStatusFilter } = useAdminPayoutsLogic();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <div className="w-44"><AdminSearchableDropdown options={PAYOUT_MONTH_OPTIONS} value={monthFilter} onChange={(v) => setMonthFilter(v as string)} placeholder="All Months" /></div>
        <div className="w-40"><AdminSearchableDropdown options={PAYOUT_GYM_OPTIONS} value={gymFilter} onChange={(v) => setGymFilter(v as string)} placeholder="All Gyms" /></div>
        <div className="w-40"><AdminSearchableDropdown options={PAYOUT_STATUS_OPTIONS} value={statusFilter} onChange={(v) => setStatusFilter(v as string)} placeholder="All Status" /></div>
      </div>

      {fetchState === 'loading' ? <AdminTableSkeleton rows={6} cols={HEADERS.length} /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5">
                  {HEADERS.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payouts.map((p) => (
                  <tr key={`${p.gymId}-${p.month}`} className="hover:bg-primary/5 motion-safe:transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.gymName}</td>
                    <td className="px-4 py-3 text-sm text-secondary">{p.month}</td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">{fmt(p.grossRevenue)}</td>
                    <td className="px-4 py-3 text-sm text-danger">{fmt(p.staffPayroll)}</td>
                    <td className="px-4 py-3 text-sm text-danger">{fmt(p.operationalExpenses)}</td>
                    <td className="px-4 py-3 text-sm text-secondary">{fmt(p.platformFee)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-success">{fmt(p.netProfit)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[p.payoutStatus] ?? 'bg-input text-secondary'}`}>
                        {p.payoutStatus === 'paid' ? <CheckCircle size={11} /> : p.payoutStatus === 'processing' ? <Loader2 size={11} className="animate-spin" /> : <Clock size={11} />}
                        {p.payoutStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.payoutStatus === 'pending' && (
                        <button
                          onClick={() => markPaid(p.gymId, p.month)}
                          className="px-3 py-1 bg-primary text-black rounded-lg text-xs font-semibold hover:bg-primary-hover motion-safe:transition-colors active:scale-95"
                        >
                          Mark Paid
                        </button>
                      )}
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
      )}
    </div>
  );
}
