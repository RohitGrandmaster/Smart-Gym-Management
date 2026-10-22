// RESPONSIBILITY: TypeScript types for the Reports module.

export interface RevenueRow {
  month: string;
  mrr: number;
  newRevenue: number;
  churnedRevenue: number;
  netRevenue: number;
  tenantCount: number;
}

export interface ChurnRecord {
  id: string;
  gymName: string;
  ownerName: string;
  plan: string;
  churnedAt: string;
  reason: string;
  mrr: number;
  daysActive: number;
}

export interface TenantHealthScore {
  id: string;
  gymName: string;
  plan: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  memberCount: number;
  lastLogin: string;
  paymentHealth: 'GOOD' | 'AT_RISK' | 'OVERDUE';
  featureUsage: number;
  supportTickets: number;
}

/** Tab identifiers for the reports page. */
export type ReportsTab = 'revenue' | 'churn' | 'health';
