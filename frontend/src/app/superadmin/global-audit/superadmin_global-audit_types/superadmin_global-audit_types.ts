// RESPONSIBILITY: Defines types and interfaces for the Superadmin Global Audit module.

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}
