// RESPONSIBILITY: Centralized route constants for the GymSmart frontend.
// Used by middleware.ts to protect authenticated pages and redirect unauthenticated users.
// All page navigation in the app must use these constants — never hardcode route strings.
export const ROUTES = {
  LOGIN: '/auth/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  MANAGER_DASHBOARD: '/manager/dashboard',
  TRAINER_DASHBOARD: '/trainer/dashboard',
  SUPERADMIN_DASHBOARD: '/superadmin/dashboard',
  ADMIN_PREFIXES: [
    '/admin/dashboard',
    '/admin/members',
    '/admin/plans',
    '/admin/finance',
    '/admin/hr',
    '/admin/attendance',
    '/admin/store',
    '/admin/workout',
    '/admin/inquiries',
    '/admin/settings',
    '/admin/library',
    '/admin/sales',
    '/admin/audit',
  ],
  MANAGER_PREFIXES: [
    '/manager/dashboard',
    '/manager/members',
    '/manager/plans',
    '/manager/finance',
    '/manager/hr',
    '/manager/attendance',
    '/manager/store',
    '/manager/workout',
    '/manager/inquiries',
    '/manager/settings',
    '/manager/library',
    '/manager/sales',
    '/manager/audit',
  ],
  TRAINER_PREFIXES: [
    '/trainer/dashboard',
    '/trainer/members',
    '/trainer/attendance',
    '/trainer/workout',
    '/trainer/library',
  ]
};
