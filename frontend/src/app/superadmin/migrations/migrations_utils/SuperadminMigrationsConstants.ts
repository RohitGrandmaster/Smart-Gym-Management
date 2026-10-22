// RESPONSIBILITY: Centralized mock data constants for the Schema Rollouts Module.
import type { MigrationLog } from '@/app/superadmin/migrations/superadmin_migrations_types/superadmin_migrations_types';

export const MOCK_MIGRATIONS: MigrationLog[] = [
  {
    id: 'mig-1',
    version: 'v1.4.2',
    description: 'Added composite index on tenant members table',
    appliedAt: '2026-09-01T10:00:00Z',
    status: 'COMPLETED',
    targetTenants: 'ALL_ACTIVE',
    durationMs: 4500,
    errorLog: null
  },
  {
    id: 'mig-2',
    version: 'v1.5.0',
    description: 'Migrating legacy billing schemas to Stripe unified model',
    appliedAt: null,
    status: 'PENDING',
    targetTenants: 'LEGACY_TIER',
    durationMs: null,
    errorLog: null
  },
  {
    id: 'mig-3',
    version: 'v1.4.1',
    description: 'Hotfix: alter column type for attendance timestamps',
    appliedAt: '2026-08-15T08:30:00Z',
    status: 'FAILED',
    targetTenants: 'ALL',
    durationMs: 1200,
    errorLog: 'Relation "attendance_logs" is locked by concurrent transaction'
  }
];
