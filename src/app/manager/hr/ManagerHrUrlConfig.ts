// RESPONSIBILITY: Single source of truth for all backend API endpoints used by the HR module.
export const HrUrlConfig = {
  PAGES: {
    STAFF_LIST: '/manager/hr',
    PAYROLL: '/manager/hr',
  },
  BACKEND_API: {
    STAFF_BASE: '/manager/hr/staff',
    STAFF_GET_ONE: (id: string) => `/manager/hr/staff/${id}`,
    STAFF_UPDATE: (id: string) => `/manager/hr/staff/${id}`,
    STAFF_DELETE: (id: string) => `/manager/hr/staff/${id}`,
    PAYROLLS_BASE: '/manager/hr/payrolls',
    PAYROLL_STATUS_UPDATE: (id: string) => `/manager/hr/payrolls/${id}/status`,
    SUMMARY: '/manager/hr/summary',
  }
};
