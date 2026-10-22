// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines strict types for the Dashboard module, including comprehensive KPI stats and recent activity shapes.
export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type TimeRange = 'weekly' | 'monthly' | 'yearly' | 'custom';
export interface DashboardContextType { 
  stats: DashboardStats | null; 
  status: FetchState; 
  error: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: string;
  endDate: string;
  setCustomDateRange: (start: string, end: string) => void;
}

export interface RecentMember {
  id: string; 
  name: string; 
  plan: string | { name: string }; 
  status: string;
  joinDate: string; 
  paidAmount: number;
}

export interface DashboardStats {
  todaysSessions: number;
  completedSessions: number;
  pendingSessions: number;
  myMembersCount: number;
  todaysAttendance: number;
  pendingWorkoutPlans: number;
  recentMemberProgress: { id: string; name: string; detail: string; time: string }[];
  upcomingSessions: { id: string; name: string; time: string; type: string }[];
  membersByPlan?: { plan: string; count: number }[];
  recentMembers?: RecentMember[];
}

