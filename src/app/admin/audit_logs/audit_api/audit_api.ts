// RESPONSIBILITY: API client for the Audit Logs module — mock data, fetch, export.
import type { AuditLog, AuditKPIData } from '@/app/admin/audit_logs/audit_types/audit_types';
import { MOCK_AUDIT_LOGS, MOCK_AUDIT_KPI } from '@/app/admin/audit_logs/audit_utils/AdminAuditLogsSharedConstants';

export const auditLogsApi = {
  fetchLogs: async (): Promise<AuditLog[]> => {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_AUDIT_LOGS;
  },
  fetchKPIs: async (): Promise<AuditKPIData> => {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_AUDIT_KPI;
  },
};
