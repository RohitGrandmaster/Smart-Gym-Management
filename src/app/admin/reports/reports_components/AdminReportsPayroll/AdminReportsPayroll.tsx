// RESPONSIBILITY: Renders the Payroll summary report tab — staff count, total payroll, paid, pending, advances per gym.
'use client';

import { useAdminReportsLogic } from '@/app/admin/reports/reports_context/useAdminReportsLogic';
import { formatCurrency } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';

export default function AdminReportsPayroll() {
  const { reportData } = useAdminReportsLogic();
  if (!reportData) return null;

  const totalPayroll = reportData.payrollSummary.reduce((s, r) => s + r.totalPayroll, 0);
  const totalPaid = reportData.payrollSummary.reduce((s, r) => s + r.paid, 0);
  const totalPending = reportData.payrollSummary.reduce((s, r) => s + r.pending, 0);
  const totalAdvances = reportData.payrollSummary.reduce((s, r) => s + r.advances, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Payroll', value: formatCurrency(totalPayroll), color: 'text-foreground' },
          { label: 'Paid', value: formatCurrency(totalPaid), color: 'text-success' },
          { label: 'Pending', value: formatCurrency(totalPending), color: 'text-danger' },
          { label: 'Advances', value: formatCurrency(totalAdvances), color: 'text-warning' },
        ].map(card => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Staff Payroll by Gym</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                {['Gym', 'Staff Count', 'Total Payroll', 'Paid', 'Pending', 'Advances', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.payrollSummary.map((row) => (
                <tr key={row.gymId} className="hover:bg-primary/5 motion-safe:transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{row.gymName}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{row.totalStaff}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(row.totalPayroll)}</td>
                  <td className="px-5 py-4 text-sm text-success">{formatCurrency(row.paid)}</td>
                  <td className="px-5 py-4 text-sm text-danger">{formatCurrency(row.pending)}</td>
                  <td className="px-5 py-4 text-sm text-warning">{formatCurrency(row.advances)}</td>
                  <td className="px-5 py-4">
                    {row.pending === 0
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success">Fully Paid</span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning-bg text-warning">Pending</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
