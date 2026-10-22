// RESPONSIBILITY: KPI stat cards for the Announcements module.
'use client';

import { Megaphone, CheckCircle, Clock, XCircle, Eye, Pin } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminAnnouncementsLogic } from '@/app/admin/announcements/announcements_context/useAdminAnnouncementsLogic';

export default function AdminAnnouncementsKPIs() {
  const { kpis } = useAdminAnnouncementsLogic();
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      <AdminStatCard title="Total Announcements" value={kpis.total} icon={Megaphone} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="Active Now" value={kpis.active} change="live & visible" changeType="up" icon={CheckCircle} iconBg="rgba(34,197,94,0.15)" iconColor="var(--success)" />
      <AdminStatCard title="Scheduled" value={kpis.scheduled} change="upcoming" changeType="neutral" icon={Clock} iconBg="rgba(99,102,241,0.15)" iconColor="var(--info)" />
      <AdminStatCard title="Expired" value={kpis.expired} icon={XCircle} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
      <AdminStatCard title="Total Views" value={kpis.totalViews.toLocaleString('en-IN')} change="across all" changeType="up" icon={Eye} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="Pinned" value={kpis.pinned} change="always on top" changeType="neutral" icon={Pin} iconBg="rgba(245,158,11,0.15)" iconColor="var(--warning)" />
    </div>
  );
}
