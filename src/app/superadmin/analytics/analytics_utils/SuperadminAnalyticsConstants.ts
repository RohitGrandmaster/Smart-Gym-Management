// RESPONSIBILITY: Centralized mock/fallback data constants for the Analytics module.
// Design §3: All hardcoded UI data lives here — single source of truth until API is ready.
// When backend is integrated, replace these constants with real API calls in useAnalyticsPage.ts.

import type { RevenueMetrics, MonthlyAnalyticsDataPoint } from '@/app/superadmin/analytics/superadmin_analytics_types/superadmin_analytics_types';

export const MOCK_ANALYTICS_METRICS: RevenueMetrics = {
  mrr: 124500,
  arr: 1494000,
  churnRate: 1.2,
  activeTenants: 142,
  ltv: 25000,
  cac: 1200,
};

/** Monthly mock data for MRR area chart and tenant growth bar chart (Design §10) */
export const MOCK_MONTHLY_DATA: MonthlyAnalyticsDataPoint[] = [
  { month: 'Oct', mrr: 85000, tenantCount: 98,  churnedCount: 2 },
  { month: 'Nov', mrr: 92000, tenantCount: 105, churnedCount: 1 },
  { month: 'Dec', mrr: 98000, tenantCount: 112, churnedCount: 3 },
  { month: 'Jan', mrr: 104000, tenantCount: 118, churnedCount: 2 },
  { month: 'Feb', mrr: 110000, tenantCount: 126, churnedCount: 1 },
  { month: 'Mar', mrr: 115000, tenantCount: 132, churnedCount: 2 },
  { month: 'Apr', mrr: 108000, tenantCount: 130, churnedCount: 4 },
  { month: 'May', mrr: 118000, tenantCount: 135, churnedCount: 1 },
  { month: 'Jun', mrr: 120000, tenantCount: 138, churnedCount: 2 },
  { month: 'Jul', mrr: 122000, tenantCount: 140, churnedCount: 1 },
  { month: 'Aug', mrr: 123000, tenantCount: 141, churnedCount: 1 },
  { month: 'Sep', mrr: 124500, tenantCount: 142, churnedCount: 0 },
];
