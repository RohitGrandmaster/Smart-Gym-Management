// RESPONSIBILITY: Single source of truth for all URLs used by the Expenses module.
export const ExpensesUrlConfig = {
  PAGES: {
    LIST: '/manager/expenses',
  },
  BACKEND_API: {
    BASE: '/manager/expenses',
    STATS: '/manager/expenses/stats',
    GET_ONE: (id: string) => `/manager/expenses/${id}`,
    UPDATE: (id: string) => `/manager/expenses/${id}`,
    DELETE: (id: string) => `/manager/expenses/${id}`,
  }
};
