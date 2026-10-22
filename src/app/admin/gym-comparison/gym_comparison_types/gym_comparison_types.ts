// RESPONSIBILITY: Defines all TypeScript types for the Gym Comparison module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface GymMetrics {
  gymId: string;
  gymName: string;
  revenue: number;
  revenueChange: number;
  activeMembers: number;
  membersChange: number;
  attendanceRate: number;
  attendanceChange: number;
  churnRate: number;
  churnChange: number;
  newMembers: number;
  netProfit: number;
  profitMargin: number;
  avgRevenuePerMember: number;
  staffCount: number;
  trend: 'up' | 'down' | 'flat';
  rank: number;
}

export interface UnderperformingAlert {
  gymId: string;
  gymName: string;
  alertType: 'revenue_drop' | 'high_churn' | 'low_attendance' | 'no_new_members';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface GymComparisonData {
  gyms: GymMetrics[];
  alerts: UnderperformingAlert[];
  lastUpdated: string;
}
