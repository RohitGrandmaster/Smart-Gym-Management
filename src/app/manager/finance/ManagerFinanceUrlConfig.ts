export const FinanceUrlConfig = {
  PAGES: { LIST: '/manager/finance' },
  BACKEND_API: {
    BASE: '/manager/finance',
    PAYMENTS_BASE: '/manager/finance/payments',
    SUMMARY: '/manager/finance/summary',
    PAYMENTS_BY_MEMBER: (memberId: string) => `/manager/finance/payments-by-member/${memberId}`
  }
};
export const ManagerFinanceUrlConfig = FinanceUrlConfig;
