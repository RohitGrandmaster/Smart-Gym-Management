// RESPONSIBILITY: Defines all TypeScript types and interfaces for the Dashboard module.
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type TimeRange = 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface DashboardContextType { 
  stats: unknown | null; 
  status: FetchState; 
  error: string;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

export interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  adminEmail: string;
  phone: string;
  status: TenantStatus;
  plan: string;
  createdAt: string;
  memberCount: number;
  monthlyRevenue: number;
  databaseVersion: string;
}

export interface SaaSDashboardMetrics {
  totalGyms: number;
  activeGyms: number;
  suspendedGyms: number;
  totalEndUsers: number;
  monthlyRecurringRevenue: number;
  recentOnboards: Tenant[];
}

export interface RevenueChartData {
  month: string;
  mrr: number;
}

export interface GrowthChartData {
  month: string;
  gyms: number;
}
