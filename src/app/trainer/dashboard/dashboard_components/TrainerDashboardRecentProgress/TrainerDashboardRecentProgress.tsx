'use client';

import { useDashboardContext } from '@/app/trainer/dashboard/dashboard_context/DashboardContext';
import { Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboardRecentProgress() {
  const { stats } = useDashboardContext();
  if (!stats?.recentMemberProgress) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <Activity className="text-info" size={20} />
          Recent Progress
        </h3>
      </div>

      <div className="space-y-4">
        {stats.recentMemberProgress.length === 0 ? (
          <p className="text-secondary text-sm">No recent member progress.</p>
        ) : (
          stats.recentMemberProgress.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{item.name}</span>
                <span className="text-xs text-secondary">{item.time}</span>
              </div>
              <p className="text-sm text-secondary line-clamp-2">{item.detail}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Link href="/trainer/progress-tracking" className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-1">
          View All Progress <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
