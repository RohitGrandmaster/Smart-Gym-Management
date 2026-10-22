// RESPONSIBILITY: TypeScript types for the Audit Logs module.

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
export type AuditSeverity = 'high' | 'medium' | 'low';
export type AuditModule = 'Finance' | 'Members' | 'HR' | 'Plans' | 'Auth' | 'Settings' | 'Branches' | 'Store' | 'Attendance';

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  branchId: string;
  details: string;
  severity: AuditSeverity;
  ip: string;
  module: AuditModule;
  userAgent?: string;
  affectedRecordId?: string;
}

export interface AuditKPIData {
  totalEvents: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  eventsToday: number;
  uniqueUsers: number;
}

export interface AuditFilters {
  search: string;
  severity: string;
  module: string;
  branchId: string;
  dateFrom: string;
  dateTo: string;
}
