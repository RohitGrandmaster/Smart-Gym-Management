// RESPONSIBILITY: Renders the side-by-side metrics comparison table for selected gyms.
'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAdminGymComparisonLogic } from '@/app/admin/gym-comparison/gym_comparison_context/useAdminGymComparisonLogic';
import { formatCurrency } from '@/app/admin/gym-comparison/gym_comparison_utils/AdminGymComparisonSharedConstants';

function TrendBadge({ value, suffix = '%', inverse = false }: { value: number; suffix?: string; inverse?: boolean }) {
  const isPositive = inverse ? value < 0 : value > 0;
  const isNeutral = value === 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isNeutral ? 'text-secondary' : isPositive ? 'text-success' : 'text-danger'}`}>
      {isNeutral ? <Minus size={11} /> : isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {value > 0 ? '+' : ''}{value}{suffix}
    </span>
  );
}

const ROWS: { label: string; key: keyof ReturnType<typeof useAdminGymComparisonLogic>['filteredGyms'][0]; format: (v: number) => string; changeKey?: string; inverse?: boolean }[] = [
  { label: 'Revenue', key: 'revenue', format: formatCurrency, changeKey: 'revenueChange' },
  { label: 'Net Profit', key: 'netProfit', format: formatCurrency },
  { label: 'Profit Margin', key: 'profitMargin', format: (v) => `${v.toFixed(1)}%` },
  { label: 'Active Members', key: 'activeMembers', format: (v) => v.toLocaleString('en-IN'), changeKey: 'membersChange' },
  { label: 'New Members', key: 'newMembers', format: (v) => `+${v}` },
  { label: 'Attendance Rate', key: 'attendanceRate', format: (v) => `${v}%`, changeKey: 'attendanceChange' },
  { label: 'Churn Rate', key: 'churnRate', format: (v) => `${v}%`, changeKey: 'churnChange', inverse: true },
  { label: 'Avg Rev / Member', key: 'avgRevenuePerMember', format: formatCurrency },
  { label: 'Staff Count', key: 'staffCount', format: (v) => String(v) },
];

export default function AdminGymComparisonTable() {
  const { filteredGyms } = useAdminGymComparisonLogic();

  if (filteredGyms.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Side-by-Side Metrics</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5">
              <th className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider w-44">Metric</th>
              {filteredGyms.map((gym) => (
                <th key={gym.gymId} className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  {gym.gymName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ROWS.map((row) => {
              // Find best value for highlighting
              const values = filteredGyms.map((g) => g[row.key] as number);
              const best = row.inverse ? Math.min(...values) : Math.max(...values);

              return (
                <tr key={row.label} className="hover:bg-primary/5 motion-safe:transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-secondary">{row.label}</td>
                  {filteredGyms.map((gym) => {
                    const val = gym[row.key] as number;
                    const isBest = val === best;
                    const changeVal = row.changeKey ? (gym[row.changeKey as keyof typeof gym] as number) : undefined;
                    return (
                      <td key={gym.gymId} className={`px-5 py-3 ${isBest ? 'bg-primary/5' : ''}`}>
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-sm font-semibold ${isBest ? 'text-primary' : 'text-foreground'}`}>
                            {row.format(val)}
                            {isBest && <span className="ml-1.5 text-xs text-primary">★</span>}
                          </span>
                          {changeVal !== undefined && (
                            <TrendBadge value={changeVal} inverse={row.inverse} />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2 border-t border-border">
        <p className="text-xs text-secondary">★ Best performing gym for each metric</p>
      </div>
    </div>
  );
}
