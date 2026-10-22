// RESPONSIBILITY: Paginated table of audit log events with severity color coding and row-click detail drawer.
'use client';

import { useState } from 'react';
import {
  Trash2, Edit, PlusCircle, AlertCircle, LogIn, Users, CreditCard, Settings, ShieldAlert, Eye,
} from 'lucide-react';
import AdminPagination from '@/app/admin/admin_components/AdminShared/AdminPagination';
import AdminTableSkeleton from '@/app/admin/admin_components/AdminShared/AdminTableSkeleton';
import AdminAuditLogsDetailDrawer from '@/app/admin/audit_logs/audit_components/AdminAuditLogsDetailDrawer/AdminAuditLogsDetailDrawer';
import { useAdminAuditLogsLogic } from '@/app/admin/audit_logs/audit_context/useAdminAuditLogsLogic';
import type { AuditLog } from '@/app/admin/audit_logs/audit_types/audit_types';

const SEVERITY_STYLES: Record<string, string> = {
  high:   'bg-danger-bg text-danger border border-danger/30',
  medium: 'bg-warning-bg text-warning border border-warning/30',
  low:    'bg-success-bg text-success border border-success/30',
};

function getActionIcon(action: string) {
  if (action.includes('DELETE') || action.includes('REFUND')) return <Trash2 size={14} className="text-danger" />;
  if (action.includes('UPDATE') || action.includes('SETTINGS') || action.includes('CHANGED')) return <Settings size={14} className="text-warning" />;
  if (action.includes('ADD') || action.includes('CREATE') || action.includes('IMPORT')) return <PlusCircle size={14} className="text-success" />;
  if (action.includes('FAIL')) return <AlertCircle size={14} className="text-danger" />;
  if (action.includes('LOGIN') || action.includes('AUTH')) return <LogIn size={14} className="text-info" />;
  if (action.includes('MEMBER') || action.includes('STAFF')) return <Users size={14} className="text-primary" />;
  if (action.includes('PAYMENT') || action.includes('PAYROLL') || action.includes('EXPENSE')) return <CreditCard size={14} className="text-success" />;
  return <Edit size={14} className="text-primary" />;
}

export default function AdminAuditLogsTable() {
  const { paginated, fetchState, currentPage, setCurrentPage, totalPages, totalItems } = useAdminAuditLogsLogic();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (fetchState === 'loading') return <AdminTableSkeleton rows={8} cols={6} />;

  if (fetchState === 'error') return (
    <div className="bg-card border border-border rounded-xl p-10 text-center">
      <ShieldAlert size={32} className="mx-auto mb-3 text-danger opacity-60" />
      <p className="text-sm text-danger font-medium">Failed to load audit logs</p>
    </div>
  );

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-border">
                {['Timestamp', 'Action & Module', 'Performed By', 'Branch', 'Details', 'Severity', ''].map(h => (
                  <th key={h} className="p-4 text-xs font-semibold text-secondary uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <ShieldAlert size={32} className="mx-auto mb-3 opacity-30 text-secondary" />
                    <p className="text-sm text-secondary">No logs match your filters</p>
                  </td>
                </tr>
              ) : paginated.map(log => (
                <tr
                  key={log.id}
                  className="hover:bg-input/40 motion-safe:transition-colors cursor-pointer group"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="p-4 text-xs text-secondary whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-input flex items-center justify-center border border-border shrink-0">
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-secondary">{log.module}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground whitespace-nowrap">{log.user}</td>
                  <td className="p-4 text-xs text-secondary whitespace-nowrap">
                    {log.branchId === 'all' ? 'Global' : log.branchId}
                  </td>
                  <td className="p-4 text-sm text-secondary max-w-xs truncate" title={log.details}>{log.details}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide inline-block ${SEVERITY_STYLES[log.severity]}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedLog(log); }}
                      className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-input motion-safe:transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="View log details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-border">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={10}
            />
          </div>
        )}
      </div>

      {selectedLog && (
        <AdminAuditLogsDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
}
