// RESPONSIBILITY: Provides the implementation for finance_url_config.ts functionality within its module.
export const FinanceUrlConfig = {
  PAGES: {
    LIST: '/admin/finance',
  },
  BACKEND_API: {
    PAYMENTS_BASE: '/admin/finance/payments',
    SUMMARY: '/admin/finance/summary',
    PAYMENTS_BY_MEMBER: (memberId: string) => `/admin/finance/payments/member/${memberId}`,
  }
};
