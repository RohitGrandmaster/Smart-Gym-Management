// RESPONSIBILITY: Centralized mock data constants for the Global Audit Module.
import type { AuditLog } from '@/app/superadmin/global-audit/superadmin_global-audit_types/superadmin_global-audit_types';

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'evt-9901',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actor: 'sysadmin@gymsmart.com',
    action: 'RESTORE_SNAPSHOT_TRIGGERED',
    resource: 'db_tenant_1234',
    details: 'Manual override to restore snapshot mig-1',
    ipAddress: '192.168.1.45',
    severity: 'CRITICAL'
  },
  {
    id: 'evt-9902',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actor: 'SYSTEM',
    action: 'SCHEMA_ROLLOUT_COMPLETED',
    resource: 'global_schema',
    details: 'Version v1.6.0 successfully applied to ALL_ACTIVE tenants',
    ipAddress: '127.0.0.1',
    severity: 'INFO'
  },
  {
    id: 'evt-9903',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actor: 'api_gateway',
    action: 'RATE_LIMIT_EXCEEDED',
    resource: 'endpoint: /api/v1/auth/login',
    details: 'Excessive login attempts detected from single origin',
    ipAddress: '45.33.22.11',
    severity: 'WARNING'
  },
  {
    id: 'evt-9904',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actor: 'billing@gymsmart.com',
    action: 'TENANT_SUSPENDED',
    resource: 'tenant_5678',
    details: 'Automated suspension due to failed invoice payment',
    ipAddress: '10.0.0.5',
    severity: 'WARNING'
  }
];
