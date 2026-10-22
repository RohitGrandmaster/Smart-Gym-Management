'use client';

import { Dumbbell, Utensils, Users, CalendarCheck } from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboardQuickActions() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
          Quick Actions
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/trainer/workout" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-primary-subtle hover:text-primary transition-colors hover:border-primary/30 group">
          <Dumbbell className="text-secondary group-hover:text-primary mb-2 transition-colors" size={24} />
          <span className="text-xs font-semibold text-center text-foreground group-hover:text-primary transition-colors">Add Workout</span>
        </Link>
        <Link href="/trainer/attendance" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-success-bg hover:text-success transition-colors hover:border-success/30 group">
          <CalendarCheck className="text-secondary group-hover:text-success mb-2 transition-colors" size={24} />
          <span className="text-xs font-semibold text-center text-foreground group-hover:text-success transition-colors">View Attendance</span>
        </Link>
        <Link href="/trainer/members" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-info-bg hover:text-info transition-colors hover:border-info/30 group">
          <Users className="text-secondary group-hover:text-info mb-2 transition-colors" size={24} />
          <span className="text-xs font-semibold text-center text-foreground group-hover:text-info transition-colors">View Members</span>
        </Link>
        <Link href="/trainer/diet-plans" className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-warning-bg hover:text-warning transition-colors hover:border-warning/30 group">
          <Utensils className="text-secondary group-hover:text-warning mb-2 transition-colors" size={24} />
          <span className="text-xs font-semibold text-center text-foreground group-hover:text-warning transition-colors">Create Diet Plan</span>
        </Link>
      </div>
    </div>
  );
}
