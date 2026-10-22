// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Centralized URL configuration for the Auth module containing all internal routes, external API endpoints, and proxy routes to prevent hardcoded magic strings.
export const AuthUrlConfig = {
  PAGES: {
    LOGIN: '/auth/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    MANAGER_DASHBOARD: '/manager/dashboard',
    TRAINER_DASHBOARD: '/trainer/dashboard',
  },
  PROXY_API: {
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    SET_COOKIE: '/auth/set-cookie',
    TOKEN: '/auth/token',
  },
  BACKEND_API: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  }
};


