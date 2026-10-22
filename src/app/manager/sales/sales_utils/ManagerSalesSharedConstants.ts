// RESPONSIBILITY: Provides the implementation for ManagerSalesSharedConstants.ts functionality within its module.
export const DATE_FILTERS = ['Today', 'This Week', 'This Month', 'This Year', 'Custom'] as const;
export type DateFilter = typeof DATE_FILTERS[number];

export const SALES_TABS = ['Collect Payment', 'Due Collection', 'Partial Payment', 'Generate Receipt', 'Payment History', 'Daily Collection Report', 'Print Receipt'] as const;
export type SalesTab = typeof SALES_TABS[number];


