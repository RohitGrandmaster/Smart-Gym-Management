// RESPONSIBILITY: Centralized fallback/mock data constants for the Audit Logs module. Extracted from component files per Rule 3 (Backend-Ready Centralized Data).
import type { GlobalAuditLog } from '@/app/superadmin/superadmin_types/superadmin_types';

export const AUDIT_LOGS_PAGE_SIZE = 10;

export const AUDIT_LOGS_FALLBACK: GlobalAuditLog[] = [
  { id: 'gal-1', actorName: 'John Admin', actorRole: 'SUPERADMIN', action: 'CREATE_TENANT', targetResource: 'Iron Forge Fitness', timestamp: '2026-07-10T10:00:00Z', ipAddress: '192.168.1.1' },
  { id: 'gal-2', actorName: 'Sarah Support', actorRole: 'SUPPORT_AGENT', action: 'RESET_TENANT_PASSWORD', targetResource: 'Vitality Studio', timestamp: '2026-07-11T11:30:00Z', ipAddress: '192.168.1.15' },
  { id: 'gal-3', actorName: 'John Admin', actorRole: 'SUPERADMIN', action: 'UPDATE_PLAN_PRICE', targetResource: 'PRO Plan', timestamp: '2026-07-11T12:00:00Z', ipAddress: '192.168.1.1' },
  { id: 'gal-4', actorName: 'Mike Billing', actorRole: 'BILLING_ADMIN', action: 'ISSUE_REFUND', targetResource: 'Apex Muscle Gym', timestamp: '2026-07-11T14:45:00Z', ipAddress: '192.168.1.20' },
];
