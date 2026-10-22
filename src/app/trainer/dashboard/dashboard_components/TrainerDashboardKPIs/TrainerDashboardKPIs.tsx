// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the two rows of KPI metric stat cards on the dashboard using live data from DashboardContext.
'use client';

import { useDashboardContext } from '@/app/trainer/dashboard/dashboard_context/DashboardContext';
import TrainerStatCard from '@/app/trainer/trainer_components/TrainerShared/TrainerStatCard';
import { Users, UserCheck, CalendarCheck, Clock, Dumbbell, Activity } from 'lucide-react';

export default function TrainerDashboardKPIs() {
  const { stats } = useDashboardContext();
  if (!stats) return null;
  const s = stats;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <TrainerStatCard
          title="Today's Sessions"
          value={s.todaysSessions.toLocaleString()}
          change={`${s.completedSessions}/${s.todaysSessions} Completed`}
          changeType="neutral"
          icon={Clock}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <TrainerStatCard
          title="My Members"
          value={s.myMembersCount.toLocaleString()}
          change="Assigned to you"
          changeType="neutral"
          icon={Users}
          iconBg="bg-info-bg"
          iconColor="text-info"
        />
        <TrainerStatCard
          title="Today's Attendance"
          value={s.todaysAttendance.toLocaleString()}
          change="Members present today"
          changeType="neutral"
          icon={CalendarCheck}
          iconBg="bg-success-bg"
          iconColor="text-success"
        />
        <TrainerStatCard
          title="Pending Plans"
          value={s.pendingWorkoutPlans.toLocaleString()}
          change="Workout plans to create"
          changeType="down"
          icon={Dumbbell}
          iconBg="bg-warning-bg"
          iconColor="text-warning"
        />
      </div>
    </>
  );
}

