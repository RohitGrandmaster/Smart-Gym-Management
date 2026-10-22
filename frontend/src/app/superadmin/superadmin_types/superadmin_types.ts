// RESPONSIBILITY: Single source of truth for all TypeScript types, interfaces, and enums used across the entire Superadmin module. No business logic — types only.
// Removed SaaSPlanTier enum

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: unknown;
}

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';

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

export interface AuditLog {
  id: string;
  tenantId: string;
  tenantName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  targetId: string;
  timestamp: string;
  details: string;
}

export interface SaaSDashboardMetrics {
  totalGyms: number;
  activeGyms: number;
  suspendedGyms: number;
  totalEndUsers: number;
  monthlyRecurringRevenue: number;
  recentOnboards: Tenant[];
}

// Phase 2 Types
export interface RevenueChartData {
  month: string;
  mrr: number;
}

export interface GrowthChartData {
  month: string;
  gyms: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  maxMembers: number;
  maxStaff: number;
  dbLimitGb: number;
  binaryLimitGb: number;
  features: string[];
  activeTenants: number;
}

export type CreatePlanPayload = Omit<SubscriptionPlan, 'id' | 'activeTenants'>;
export type UpdatePlanPayload = Partial<CreatePlanPayload>;

export type FetchState = 'idle' | 'loading' | 'success' | 'error';



export interface BackgroundJob {
  id: string;
  queueName: string;
  jobName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'DELAYED';
  attempts: number;
  error?: string;
  createdAt: string;
}

export interface JobsMetrics {
  activeJobs: number;
  completed24h: number;
  failed24h: number;
  delayed: number;
}







export interface SchemaMigration {
  id: string;
  name: string;
  appliedAt: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}







export interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  dataType: 'string' | 'number' | 'boolean';
}

export interface InfrastructureNode {
  id: string;
  name: string;
  cpuPercent: number | null;
  memoryPercent: number | null;
  diskPercent: number | null;
  status: string;
}

export interface GlobalAuditLog {
  id: string;
  timestamp: string;
  targetResource: string;
  actorName: string;
  actorRole: string;
  action: string;
  ipAddress?: string;
}

export interface MigrationsPageData {
  migrations: SchemaMigration[];
  tenants: Tenant[];
}

export interface RedisTelemetry {
  memoryUsagePercent: number;
  hitRatioPercent: number;
  totalKeysCached: number;
  uptimeHours: number;
}
