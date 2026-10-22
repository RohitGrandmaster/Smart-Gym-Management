// RESPONSIBILITY: Modularized API client for the Superadmin module. All methods import apiFetch from src/lib/api.ts and define only superadmin-scoped endpoints. No UI logic.
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { apiFetch } from '@/lib/api';
import type { 
  ApiResponse, 
  Tenant, 
  SubscriptionPlan, 
  CreatePlanPayload, 
  UpdatePlanPayload,
  BackgroundJob,
  SaaSDashboardMetrics,
  PlatformSetting,
  MigrationsPageData,
  InfrastructureNode,
  GlobalAuditLog,
} from '@/app/superadmin/superadmin_types/superadmin_types';

/**
 * Superadmin API Client
 * Provides strictly typed methods for all 16 superadmin modules.
 */
export const superadminApi = {
  gyms: {
    fetchGyms: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<ApiResponse<Tenant[]>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}${q}`);
    },
    fetchGymById: (id: string) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`),
    createGym: (body: Partial<Tenant>) => apiFetch<ApiResponse<Tenant>>(SuperadminUrlConfig.BACKEND_API.GYMS_BASE, { method: 'POST', body: JSON.stringify(body) }),
    updateGym: (id: string, body: Partial<Tenant>) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    changeGymStatus: (id: string, status: string) => apiFetch<ApiResponse<Tenant>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    impersonateTenant: (id: string) => apiFetch<ApiResponse<{ token: string }>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/impersonate`, { method: 'POST' }),
    deleteGym: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}`, { method: 'DELETE' }),
    fetchGymStats: () => apiFetch<ApiResponse<unknown>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/stats`),
    emailGymOwner: (id: string, body: { subject: string; message: string; [key: string]: unknown }) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.GYMS_BASE}/${id}/email`, { method: 'POST', body: JSON.stringify(body) }),
  },
  plans: {
    fetchPlans: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<ApiResponse<SubscriptionPlan[]>>(`${SuperadminUrlConfig.BACKEND_API.PLANS_BASE}${q}`);
    },
    fetchPlanById: (id: string) => apiFetch<ApiResponse<SubscriptionPlan>>(`${SuperadminUrlConfig.BACKEND_API.PLANS_BASE}/${id}`),
    createPlan: (body: CreatePlanPayload) => apiFetch<ApiResponse<SubscriptionPlan>>(SuperadminUrlConfig.BACKEND_API.PLANS_BASE, { method: 'POST', body: JSON.stringify(body) }),
    updatePlan: (id: string, body: UpdatePlanPayload) => apiFetch<ApiResponse<SubscriptionPlan>>(`${SuperadminUrlConfig.BACKEND_API.PLANS_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    deletePlan: (id: string) => apiFetch<ApiResponse<void>>(`${SuperadminUrlConfig.BACKEND_API.PLANS_BASE}/${id}`, { method: 'DELETE' }),
  },




  jobs: {
    fetchJobs: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<ApiResponse<BackgroundJob[]>>(`${SuperadminUrlConfig.BACKEND_API.JOBS_BASE}${q}`);
    },
  },

  migrations: {
    fetchMigrations: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<ApiResponse<MigrationsPageData>>(`${SuperadminUrlConfig.BACKEND_API.MIGRATIONS_BASE}${q}`);
    },
  },

  auditLogs: {
    fetchGlobalLogs: (params?: Record<string, string>) => {
      const q = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch<ApiResponse<GlobalAuditLog[]>>(`${SuperadminUrlConfig.BACKEND_API.AUDIT_LOGS_BASE}${q}`);
    },
  },
  broadcasts: {
    sendBroadcast: (message: string) => apiFetch<ApiResponse<void>>(SuperadminUrlConfig.BACKEND_API.BROADCASTS_BASE, { method: 'POST', body: JSON.stringify({ message }) }),
  },

  dashboard: {
    fetchDashboardData: () => apiFetch<ApiResponse<SaaSDashboardMetrics>>(SuperadminUrlConfig.BACKEND_API.DASHBOARD_BASE),
    fetchDashboardMetrics: () => apiFetch<ApiResponse<SaaSDashboardMetrics>>(`${SuperadminUrlConfig.BACKEND_API.DASHBOARD_BASE}/metrics`),
  },
  settings: {
    fetchSettings: () => apiFetch<ApiResponse<PlatformSetting[]>>(SuperadminUrlConfig.BACKEND_API.SETTINGS_BASE),
    updateSetting: (id: string, body: Record<string, unknown>) => apiFetch<ApiResponse<PlatformSetting>>(`${SuperadminUrlConfig.BACKEND_API.SETTINGS_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },
  system: {
    fetchSystemInfo: () => apiFetch<ApiResponse<unknown>>(SuperadminUrlConfig.BACKEND_API.SYSTEM_BASE),
    fetchHealthProbe: () => apiFetch<ApiResponse<unknown>>(`${SuperadminUrlConfig.BACKEND_API.SYSTEM_BASE}/health`),
  },
  infrastructure: {
    fetchInfrastructureNodes: () => apiFetch<ApiResponse<InfrastructureNode[]>>(SuperadminUrlConfig.BACKEND_API.INFRASTRUCTURE_BASE),
    fetchRedisTelemetry: () => apiFetch<ApiResponse<any>>(SuperadminUrlConfig.BACKEND_API.REDIS_TELEMETRY),
    flushGlobalCache: () => apiFetch<ApiResponse<void>>(SuperadminUrlConfig.BACKEND_API.REDIS_FLUSH_GLOBAL, { method: 'POST' }),
    flushTenantCache: (tenantIds: string[]) => apiFetch<ApiResponse<void>>(SuperadminUrlConfig.BACKEND_API.REDIS_FLUSH_TENANT, { method: 'POST', body: JSON.stringify({ tenantIds }) }),
  },
};
