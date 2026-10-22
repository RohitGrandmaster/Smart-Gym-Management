// RESPONSIBILITY: KPI cards for the Blacklist module.
'use client';

import { Ban, Globe, Building2, CalendarPlus } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminBlacklistLogic } from '@/app/admin/blacklist/blacklist_context/useAdminBlacklistLogic';

export default function AdminBlacklistKPIs() {
  const { kpis } = useAdminBlacklistLogic();
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard title="Total Blacklisted" value={kpis.totalBlacklisted} icon={Ban} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
      <AdminStatCard title="Global Bans" value={kpis.globalBans} change="across all gyms" changeType="neutral" icon={Globe} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
      <AdminStatCard title="Gym-Specific Bans" value={kpis.gymSpecificBans} change="targeted branches" changeType="neutral" icon={Building2} iconBg="rgba(245,158,11,0.15)" iconColor="var(--warning)" />
      <AdminStatCard title="Added This Month" value={kpis.addedThisMonth} icon={CalendarPlus} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
    </div>
  );
}
