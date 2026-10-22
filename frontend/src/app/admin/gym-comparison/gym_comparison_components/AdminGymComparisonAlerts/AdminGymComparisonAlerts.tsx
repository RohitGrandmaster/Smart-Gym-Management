// RESPONSIBILITY: Renders underperforming gym alerts panel for the Gym Comparison module.
'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useAdminGymComparisonLogic } from '@/app/admin/gym-comparison/gym_comparison_context/useAdminGymComparisonLogic';

const SEVERITY_MAP = {
  high: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-bg', border: 'border-danger/20' },
  medium: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning-bg', border: 'border-warning/20' },
  low: { icon: Info, color: 'text-info', bg: 'bg-info-bg', border: 'border-info/20' },
};

export default function AdminGymComparisonAlerts() {
  const { comparisonData } = useAdminGymComparisonLogic();
  const alerts = comparisonData?.alerts ?? [];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Underperforming Alerts</h2>
        {alerts.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-danger-bg text-danger">{alerts.length}</span>
        )}
      </div>
      <div className="divide-y divide-border max-h-72 overflow-y-auto custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-secondary">All gyms performing well 🎉</div>
        ) : alerts.map((alert, i) => {
          const cfg = SEVERITY_MAP[alert.severity];
          const Icon = cfg.icon;
          return (
            <div key={i} className={`px-5 py-3 flex items-start gap-3 ${cfg.bg} border-l-2 ${cfg.border}`}>
              <Icon size={15} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
              <div>
                <p className="text-xs font-bold text-foreground">{alert.gymName}</p>
                <p className="text-xs text-secondary mt-0.5">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
