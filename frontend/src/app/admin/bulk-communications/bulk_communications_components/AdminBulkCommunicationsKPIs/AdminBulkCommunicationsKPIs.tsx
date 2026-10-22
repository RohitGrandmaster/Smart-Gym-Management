// RESPONSIBILITY: KPI cards for the Bulk Communications module.
'use client';

import { Send, CheckCircle, Clock, Users } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminBulkCommunicationsLogic } from '@/app/admin/bulk-communications/bulk_communications_context/useAdminBulkCommunicationsLogic';

export default function AdminBulkCommunicationsKPIs() {
  const { kpis } = useAdminBulkCommunicationsLogic();
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard title="Total Broadcasts Sent" value={kpis.totalSent} icon={Send} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="Delivery Rate" value={`${kpis.deliveryRate}%`} change="avg across channels" changeType="up" icon={CheckCircle} iconBg="rgba(34,197,94,0.15)" iconColor="var(--success)" />
      <AdminStatCard title="Scheduled Pending" value={kpis.scheduledPending} change="upcoming broadcasts" changeType="neutral" icon={Clock} iconBg="rgba(245,158,11,0.15)" iconColor="var(--warning)" />
      <AdminStatCard title="Total Members Reached" value={kpis.totalReached.toLocaleString('en-IN')} change="all time" changeType="neutral" icon={Users} iconBg="rgba(59,130,246,0.15)" iconColor="var(--info)" />
    </div>
  );
}
