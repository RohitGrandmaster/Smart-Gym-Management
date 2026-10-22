// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the HR module.
export const HrUrlConfig = {
  PAGES: {
    STAFF_LIST: '/Admin/hr',
    PAYROLL: '/Admin/hr',
  },
  BACKEND_API: {
    STAFF_BASE: '/Admin/hr/staff',
    STAFF_GET_ONE: (id: string) => `/Admin/hr/staff/${id}`,
    STAFF_UPDATE: (id: string) => `/Admin/hr/staff/${id}`,
    STAFF_DELETE: (id: string) => `/Admin/hr/staff/${id}`,
    PAYROLLS_BASE: '/Admin/hr/payrolls',
    PAYROLL_STATUS_UPDATE: (id: string) => `/Admin/hr/payrolls/${id}/status`,
    SUMMARY: '/Admin/hr/summary',
  }
};
