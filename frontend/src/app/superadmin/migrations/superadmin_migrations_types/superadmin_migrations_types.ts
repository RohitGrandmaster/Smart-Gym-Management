// RESPONSIBILITY: Defines types and interfaces for the Superadmin Migrations (Schema Rollouts) module.

export type MigrationStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'ROLLED_BACK';

export interface MigrationLog {
  id: string;
  version: string;
  description: string;
  appliedAt: string | null;
  status: MigrationStatus;
  targetTenants: string; // e.g., 'ALL', 'V1.4_ONLY'
  durationMs: number | null;
  errorLog: string | null;
}
