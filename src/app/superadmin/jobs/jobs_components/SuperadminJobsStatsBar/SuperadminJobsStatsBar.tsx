'use client';
// RESPONSIBILITY: Renders the 4 KPI metric cards at the top of the Jobs page.
// Pure view component — no state, no API calls. Receives all data via props (Rule 34).

import { Play, Activity, XCircle, AlertTriangle } from 'lucide-react';

interface JobsMetrics {
  activeJobs: number;
  completed24h: number;
  failed24h: number;
  delayed: number;
}

interface SuperadminJobsStatsBarProps {
  metrics: JobsMetrics;
}

/**
 * Renders 4 KPI stat cards: Active Jobs, Completed (24h), Failed (24h), Delayed.
 * Applies gold gradient bg per Design §5a.
 */
export default function SuperadminJobsStatsBar({ metrics }: SuperadminJobsStatsBarProps) {
  const stats = [
    { label: 'Active Jobs',     value: metrics.activeJobs,   icon: Play,          color: 'text-primary',  iconBg: 'bg-primary/10' },
    { label: 'Completed (24h)', value: metrics.completed24h, icon: Activity,      color: 'text-success',  iconBg: 'bg-success/10' },
    { label: 'Failed (24h)',    value: metrics.failed24h,    icon: XCircle,       color: 'text-danger',   iconBg: 'bg-danger-bg'  },
    { label: 'Delayed',         value: metrics.delayed,      icon: AlertTriangle, color: 'text-warning',  iconBg: 'bg-warning/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform"
            style={{ background: 'linear-gradient(180deg, rgba(250,204,21,0.06), rgba(255,255,255,0.01))' }}
          >
            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={stat.color} />
            </div>
            <div>
              <p className="text-xs text-secondary font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
