// RESPONSIBILITY: Renders the Revenue report tab — breakdown by gym, payment method, plan, and monthly trend chart.
'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAdminReportsLogic } from '@/app/admin/reports/reports_context/useAdminReportsLogic';
import { formatCurrency } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';

const TREND_ICON = {
  up: <TrendingUp size={14} className="text-success" />,
  down: <TrendingDown size={14} className="text-danger" />,
  flat: <Minus size={14} className="text-secondary" />,
};

export default function AdminReportsRevenue() {
  const { reportData } = useAdminReportsLogic();

  if (!reportData) return null;

  const maxRevenue = Math.max(...reportData.revenueByGym.map(g => g.revenue));

  return (
    <div className="space-y-6">
      {/* Revenue by Gym */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Revenue by Gym</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                {['Gym', 'Revenue', 'Expenses', 'Net Profit', 'Margin', 'Trend'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.revenueByGym.map((row) => (
                <tr key={row.gymId} className="hover:bg-primary/5 motion-safe:transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{row.gymName}</p>
                      <div className="mt-1 h-1.5 bg-input rounded-full w-32">
                        <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(row.revenue / maxRevenue) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-foreground">{formatCurrency(row.revenue)}</td>
                  <td className="px-5 py-4 text-sm text-danger">{formatCurrency(row.expenses)}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-success">{formatCurrency(row.profit)}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{((row.profit / row.revenue) * 100).toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {TREND_ICON[row.trend]}
                      <span className={`text-xs font-medium ${row.trend === 'up' ? 'text-success' : row.trend === 'down' ? 'text-danger' : 'text-secondary'}`}>
                        {row.trendPercent > 0 ? '+' : ''}{row.trendPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Method + Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Revenue by Payment Method</h2>
          </div>
          <div className="p-5 space-y-3">
            {reportData.revenueByMethod.map((row) => {
              const total = reportData.revenueByMethod.reduce((s, r) => s + r.amount, 0);
              const pct = ((row.amount / total) * 100).toFixed(1);
              return (
                <div key={row.method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{row.method}</span>
                    <span className="text-secondary">{formatCurrency(row.amount)} <span className="text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-input rounded-full">
                    <div className="h-2 bg-primary rounded-full motion-safe:transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Revenue by Plan</h2>
          </div>
          <div className="p-5 space-y-3">
            {reportData.revenueByPlan.map((row) => {
              const total = reportData.revenueByPlan.reduce((s, r) => s + r.amount, 0);
              const pct = ((row.amount / total) * 100).toFixed(1);
              return (
                <div key={row.planName}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{row.planName}</span>
                    <span className="text-secondary">{formatCurrency(row.amount)} <span className="text-xs">({row.count} members)</span></span>
                  </div>
                  <div className="h-2 bg-input rounded-full">
                    <div className="h-2 bg-info rounded-full motion-safe:transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Monthly Revenue Trend</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                {['Month', 'Revenue', 'Expenses', 'Net Profit', 'Margin'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.monthlyRevenue.map((row) => (
                <tr key={row.month} className="hover:bg-primary/5 motion-safe:transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-foreground">{row.month}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{formatCurrency(row.revenue)}</td>
                  <td className="px-5 py-3 text-sm text-danger">{formatCurrency(row.expenses)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-success">{formatCurrency(row.profit)}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{((row.profit / row.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
