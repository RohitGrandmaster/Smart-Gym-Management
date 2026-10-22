// RESPONSIBILITY: Renders visual bar charts comparing key metrics across selected gyms.
'use client';

import { useAdminGymComparisonLogic } from '@/app/admin/gym-comparison/gym_comparison_context/useAdminGymComparisonLogic';
import { formatCurrency } from '@/app/admin/gym-comparison/gym_comparison_utils/AdminGymComparisonSharedConstants';

const BAR_COLORS = ['bg-primary', 'bg-info', 'bg-success', 'bg-purple'];

function MetricBarChart({ title, getValue, format }: {
  title: string;
  getValue: (gym: ReturnType<typeof useAdminGymComparisonLogic>['filteredGyms'][0]) => number;
  format: (v: number) => string;
}) {
  const { filteredGyms } = useAdminGymComparisonLogic();
  const max = Math.max(...filteredGyms.map(getValue));

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-3">
        {filteredGyms.map((gym, i) => {
          const val = getValue(gym);
          const pct = max > 0 ? (val / max) * 100 : 0;
          return (
            <div key={gym.gymId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-secondary font-medium">{gym.gymName}</span>
                <span className="text-foreground font-semibold">{format(val)}</span>
              </div>
              <div className="h-2.5 bg-input rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full motion-safe:transition-all motion-safe:duration-500 ${BAR_COLORS[i] ?? 'bg-primary'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminGymComparisonCharts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricBarChart title="Revenue" getValue={(g) => g.revenue} format={formatCurrency} />
      <MetricBarChart title="Active Members" getValue={(g) => g.activeMembers} format={(v) => v.toLocaleString('en-IN')} />
      <MetricBarChart title="Attendance Rate" getValue={(g) => g.attendanceRate} format={(v) => `${v}%`} />
      <MetricBarChart title="Net Profit" getValue={(g) => g.netProfit} format={formatCurrency} />
    </div>
  );
}
