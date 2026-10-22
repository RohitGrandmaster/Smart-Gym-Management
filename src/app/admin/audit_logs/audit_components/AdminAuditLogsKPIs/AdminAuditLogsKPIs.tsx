// RESPONSIBILITY: KPI stat cards for the Audit Logs module.
'use client';

import { ShieldAlert, AlertTriangle, Info, CalendarClock, Users, Activity } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminAuditLogsLogic } from '@/app/admin/audit_logs/audit_context/useAdminAuditLogsLogic';

export default function AdminAuditLogsKPIs() {
  const { kpis } = useAdminAuditLogsLogic();
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      <AdminStatCard title="Total Events" value={kpis.totalEvents} change="all time" changeType="neutral" icon={Activity} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="High Severity" value={kpis.highSeverity} change="requires attention" changeType="down" icon={ShieldAlert} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
      <AdminStatCard title="Medium Severity" value={kpis.mediumSeverity} change="monitor closely" changeType="neutral" icon={AlertTriangle} iconBg="rgba(245,158,11,0.15)" iconColor="var(--warning)" />
      <AdminStatCard title="Low Severity" value={kpis.lowSeverity} change="informational" changeType="up" icon={Info} iconBg="rgba(34,197,94,0.15)" iconColor="var(--success)" />
      <AdminStatCard title="Events Today" value={kpis.eventsToday} icon={CalendarClock} iconBg="rgba(99,102,241,0.15)" iconColor="var(--info)" />
      <AdminStatCard title="Unique Users" value={kpis.uniqueUsers} change="active actors" changeType="neutral" icon={Users} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
    </div>
  );
}
