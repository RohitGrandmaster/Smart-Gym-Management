// RESPONSIBILITY: TypeScript types for the Admin Usage & Subscription module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface AdminUsageData {
  tenantId: string;
  planName: string;
  planTier: 'Starter' | 'Growth' | 'Pro' | 'Enterprise';
  billingCycleEnd: string;
  monthlyPrice: number;
  smsSent: number;
  smsLimit: number;
  databaseGb: number;
  mediaGb: number;
  storageLimitGb: number;
  activeMembers: number;
  memberLimit: number;
  staffCount: number;
  staffLimit: number;
  branchCount: number;
  branchLimit: number;
  apiCallsToday: number;
  apiCallsLimit: number;
}

export interface AdminUsageMetric {
  label: string;
  used: number;
  limit: number;
  unit: string;
  warningThreshold: number; // percentage at which to show warning color
}
