// RESPONSIBILITY: Renders a single usage metric bar card (label, used/limit, progress bar with color coding).
'use client';

import type { AdminUsageMetric } from '@/app/admin/usage/usage_types/AdminUsageTypes';

interface AdminUsageMetricCardProps {
  metric: AdminUsageMetric;
}

export default function AdminUsageMetricCard({ metric }: AdminUsageMetricCardProps) {
  const pct = Math.min(100, Math.round((metric.used / metric.limit) * 100));
  const isCritical = pct >= metric.warningThreshold + 10;
  const isWarning = pct >= metric.warningThreshold && !isCritical;

  const barColor = isCritical ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-success';
  const textColor = isCritical ? 'text-danger' : isWarning ? 'text-warning' : 'text-success';

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3 hover:border-primary motion-safe:transition-all motion-safe:duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{metric.label}</p>
        <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-input rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary">
          {metric.used.toLocaleString('en-IN')} / {metric.limit.toLocaleString('en-IN')} {metric.unit}
        </span>
        {isCritical && (
          <span className="text-xs font-bold text-danger bg-danger-bg px-2 py-0.5 rounded-full">At Limit</span>
        )}
        {isWarning && !isCritical && (
          <span className="text-xs font-bold text-warning bg-warning-bg px-2 py-0.5 rounded-full">Near Limit</span>
        )}
      </div>
    </div>
  );
}
