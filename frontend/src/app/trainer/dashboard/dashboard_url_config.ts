// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized URL configuration for all Dashboard module API endpoints and page routes.
export const DashboardUrlConfig = {
  PAGES: {
    HOME: '/trainer/dashboard',
  },
  BACKEND_API: {
    STATS: '/trainer/dashboard/kpi',
    CHARTS: '/trainer/dashboard/charts',
    RECENT: '/trainer/dashboard/recent',
  }
};


