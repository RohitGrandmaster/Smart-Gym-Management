// RESPONSIBILITY: Provides strongly-typed network calls for dashboard metrics.
import type { ApiResponse } from '@/lib/api';
import type { DashboardStats } from '@/app/admin/dashboard/dashboard_types/dashboard_types';

const STATIC_DASHBOARD_DATA: DashboardStats = {
  totalMembers: 320,
  activeMembers: 275,
  newMembersThisMonth: 18,
  totalRevenue: 1850000,
  monthlyRevenue: 200000,
  netProfit: 125000,
  totalExpenses: 75000,
  pendingPayments: 45000,
  totalStaff: 24,
  activeStaff: 22,
  totalProducts: 120,
  lowStockCount: 5,
  totalInquiries: 64,
  newInquiries: 12,
  membersByStatus: { active: 275, pending: 30, expired: 15 },
  memberGrowth: [
    { month: 'Jan', count: 280 },
    { month: 'Feb', count: 290 },
    { month: 'Mar', count: 305 },
    { month: 'Apr', count: 320 },
  ],
  membersByPlan: [
    { plan: 'Basic', count: 140 },
    { plan: 'Pro', count: 120 },
    { plan: 'VIP', count: 60 },
  ],
  revenueTrend: [
    { month: 'Jun', revenue: 120000, profit: 45000 },
    { month: 'Jul', revenue: 150000, profit: 60000 },
    { month: 'Aug', revenue: 180000, profit: 80000 },
    { month: 'Sep', revenue: 160000, profit: 70000 },
    { month: 'Oct', revenue: 200000, profit: 125000 },
  ],
  branchLeaderboard: [
    { id: 'br-1', name: 'Andheri East', revenue: 85000, activeMembers: 120, trend: 'up' },
    { id: 'br-2', name: 'Bandra West', revenue: 65000, activeMembers: 95, trend: 'up' },
    { id: 'br-3', name: 'Powai', revenue: 40000, activeMembers: 60, trend: 'flat' },
    { id: 'br-4', name: 'Thane', revenue: 10000, activeMembers: 20, trend: 'down' },
  ],
  systemAlerts: [
    { id: '1', message: 'Powai Manager has not logged in today.', severity: 'medium', date: new Date().toISOString() },
    { id: '2', message: 'Treadmill #4 in Andheri needs maintenance.', severity: 'high', date: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', message: 'Thane branch operating at a loss this month.', severity: 'high', date: new Date(Date.now() - 172800000).toISOString() },
  ],
};

export const dashboardApi = {
  fetchDashboardStats: async (_branchId?: string): Promise<ApiResponse<DashboardStats>> => {
    return {
      success: true,
      message: 'Stats fetched successfully',
      data: STATIC_DASHBOARD_DATA,
    };
  },
};

