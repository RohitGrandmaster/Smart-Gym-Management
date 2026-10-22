// RESPONSIBILITY: Provides strongly-typed network calls for dashboard metrics.
import { apiFetch, ApiResponse } from '@/lib/api';
import { DashboardUrlConfig } from '@/app/manager/dashboard/ManagerDashboardUrlConfig';
import type { DashboardStats } from '@/app/manager/dashboard/dashboard_types/ManagerDashboardTypes';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const [kpiRes, chartsRes, recentRes] = await Promise.all([
      apiFetch<ApiResponse<Partial<DashboardStats>>>(DashboardUrlConfig.BACKEND_API.STATS),
      apiFetch<ApiResponse<Partial<DashboardStats>>>(DashboardUrlConfig.BACKEND_API.CHARTS),
      apiFetch<ApiResponse<Partial<DashboardStats>>>(DashboardUrlConfig.BACKEND_API.RECENT),
    ]);
    return {
      success: true,
      message: 'Stats fetched successfully',
      data: {
        ...(kpiRes.data || {}),
        ...(chartsRes.data || {}),
        ...(recentRes.data || {}),
      } as DashboardStats,
    };
  },
};

