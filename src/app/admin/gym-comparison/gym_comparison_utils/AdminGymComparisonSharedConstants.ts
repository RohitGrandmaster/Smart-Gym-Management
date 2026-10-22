// RESPONSIBILITY: Centralized constants and mock data for the Gym Comparison module.
import type { GymComparisonData } from '@/app/admin/gym-comparison/gym_comparison_types/gym_comparison_types';

export const formatCurrency = (n: number) => '₹' + (n || 0).toLocaleString('en-IN');

export const COMPARISON_METRICS = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'activeMembers', label: 'Active Members' },
  { key: 'attendanceRate', label: 'Attendance Rate' },
  { key: 'churnRate', label: 'Churn Rate' },
  { key: 'netProfit', label: 'Net Profit' },
  { key: 'newMembers', label: 'New Members' },
] as const;

export const MOCK_GYM_COMPARISON_DATA: GymComparisonData = {
  lastUpdated: new Date().toISOString(),
  gyms: [
    {
      gymId: 'b1', gymName: 'Andheri East', rank: 1,
      revenue: 1850000, revenueChange: 12.4,
      activeMembers: 420, membersChange: 8.1,
      attendanceRate: 72.4, attendanceChange: 3.2,
      churnRate: 4.3, churnChange: -1.1,
      newMembers: 52, netProfit: 1270000, profitMargin: 68.6,
      avgRevenuePerMember: 4405, staffCount: 8, trend: 'up',
    },
    {
      gymId: 'b2', gymName: 'Bandra West', rank: 2,
      revenue: 1420000, revenueChange: 8.1,
      activeMembers: 340, membersChange: 5.9,
      attendanceRate: 68.2, attendanceChange: 1.8,
      churnRate: 3.5, churnChange: -0.5,
      newMembers: 41, netProfit: 930000, profitMargin: 65.5,
      avgRevenuePerMember: 4176, staffCount: 7, trend: 'up',
    },
    {
      gymId: 'b3', gymName: 'Powai', rank: 3,
      revenue: 980000, revenueChange: 0.5,
      activeMembers: 220, membersChange: 1.2,
      attendanceRate: 65.8, attendanceChange: -0.4,
      churnRate: 6.8, churnChange: 1.2,
      newMembers: 28, netProfit: 600000, profitMargin: 61.2,
      avgRevenuePerMember: 4455, staffCount: 5, trend: 'flat',
    },
    {
      gymId: 'b4', gymName: 'Thane', rank: 4,
      revenue: 600000, revenueChange: -5.2,
      activeMembers: 180, membersChange: -2.8,
      attendanceRate: 58.1, attendanceChange: -4.1,
      churnRate: 12.2, churnChange: 3.4,
      newMembers: 21, netProfit: 430000, profitMargin: 71.7,
      avgRevenuePerMember: 3333, staffCount: 4, trend: 'down',
    },
  ],
  alerts: [
    { gymId: 'b4', gymName: 'Thane', alertType: 'revenue_drop', message: 'Revenue dropped 5.2% vs last period', severity: 'high' },
    { gymId: 'b4', gymName: 'Thane', alertType: 'high_churn', message: 'Churn rate at 12.2% — 3x above average', severity: 'high' },
    { gymId: 'b4', gymName: 'Thane', alertType: 'low_attendance', message: 'Attendance rate at 58.1% — lowest across all gyms', severity: 'medium' },
    { gymId: 'b3', gymName: 'Powai', alertType: 'high_churn', message: 'Churn rate increased by 1.2% this period', severity: 'medium' },
  ],
};
