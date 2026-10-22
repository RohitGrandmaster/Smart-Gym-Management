// RESPONSIBILITY: TypeScript types for the Analytics module. No business logic — types only.
// Rule 7: All types isolated here; never inline in components or hooks.

export interface RevenueMetrics {
  mrr: number;
  arr: number;
  churnRate: number;
  ltv: number;
  cac: number;
  activeTenants: number;
}

/** Monthly data point for MRR area chart and tenant growth bar chart */
export interface MonthlyAnalyticsDataPoint {
  month: string;
  mrr: number;
  tenantCount: number;
  churnedCount: number;
}

/** Shape of full analytics API response data */
export interface AnalyticsApiData {
  metrics: RevenueMetrics;
  monthly: MonthlyAnalyticsDataPoint[];
}

/** Canonical async state enum — Rule 42: never use boolean `isLoading` flags */
export type FetchState = 'idle' | 'loading' | 'success' | 'error';
