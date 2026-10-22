'use client';

import { useDashboardContext } from '@/app/trainer/dashboard/dashboard_context/DashboardContext';
import { Calendar, Clock } from 'lucide-react';

export default function TrainerDashboardUpcomingSessions() {
  const { stats } = useDashboardContext();
  if (!stats?.upcomingSessions) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          <Calendar className="text-primary" size={20} />
          Upcoming Sessions
        </h3>
        <button className="text-sm text-primary font-medium hover:underline">View Schedule</button>
      </div>

      <div className="space-y-3">
        {stats.upcomingSessions.length === 0 ? (
          <p className="text-secondary text-sm">No upcoming sessions today.</p>
        ) : (
          stats.upcomingSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {session.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{session.name}</p>
                  <p className="text-xs text-secondary">{session.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground bg-secondary/10 px-3 py-1.5 rounded-lg">
                <Clock size={14} className="text-secondary" />
                {session.time}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
