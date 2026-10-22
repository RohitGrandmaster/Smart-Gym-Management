// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides strongly-typed network calls for dashboard metrics.
import { apiFetch, ApiResponse } from '@/lib/api';
import { DashboardUrlConfig } from '@/app/trainer/dashboard/dashboard_url_config';
import type { DashboardStats } from '@/app/trainer/dashboard/dashboard_types/dashboard_types';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    // Mocking the backend response since the backend APIs aren't built for these trainer-specific stats yet.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Stats fetched successfully',
          data: {
            todaysSessions: 8,
            completedSessions: 5,
            pendingSessions: 3,
            myMembersCount: 24,
            todaysAttendance: 18,
            pendingWorkoutPlans: 4,
            recentMemberProgress: [
              { id: 'm1', name: 'Aman', detail: 'Logged new PR in Bench Press', time: '2 hours ago' },
              { id: 'm2', name: 'Neha', detail: 'Achieved weekly weight loss goal', time: '5 hours ago' },
              { id: 'm3', name: 'Rohit', detail: 'Completed 10k run', time: '1 day ago' },
            ],
            upcomingSessions: [
              { id: 's1', name: 'Aman', time: '4:00 PM', type: 'Personal Training' },
              { id: 's2', name: 'Rohit', time: '5:00 PM', type: 'Weight Loss' },
              { id: 's3', name: 'Neha', time: '6:00 PM', type: 'Strength Training' },
            ]
          } as DashboardStats,
        });
      }, 500);
    });
  },
};


