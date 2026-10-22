// RESPONSIBILITY: Centralized URL constants for the Attendance module — frontend page routes and backend API endpoints. Import from here; never hardcode URLs in components.
export const AttendanceUrlConfig = {
  PAGES: {
    LIST: '/manager/attendance',
  },
  BACKEND_API: {
    BASE: '/manager/attendance',
    TODAY_STATS: '/manager/attendance/today-stats',
    HISTORY: '/manager/attendance/history',
  }
};
