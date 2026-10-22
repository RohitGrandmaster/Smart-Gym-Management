// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized URL constants for the Attendance module — frontend page routes and backend API endpoints. Import from here; never hardcode URLs in components.
export const AttendanceUrlConfig = {
  PAGES: {
    LIST: '/trainer/attendance',
  },
  BACKEND_API: {
    BASE: '/trainer/attendance',
    TODAY_STATS: '/trainer/attendance/today-stats',
  }
};

