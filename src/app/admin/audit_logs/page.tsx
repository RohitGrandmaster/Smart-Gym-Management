import type { Metadata } from 'next';
import AdminAuditLogsMain from '@/app/admin/audit_logs/audit_components/AdminAuditLogsMain/AdminAuditLogsMain';

export const metadata: Metadata = {
  title: 'Audit Logs | Admin - GymSmart',
  description: 'Monitor system activity, security events, and audit trails.',
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsMain />;
}
