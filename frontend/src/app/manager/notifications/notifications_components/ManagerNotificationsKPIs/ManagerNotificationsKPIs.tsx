// RESPONSIBILITY: KPI stat cards for the Notifications module.
'use client';

import { useNotificationsContext } from '@/app/manager/notifications/notifications_context/ManagerNotificationsContext';
import ManagerStatCard from '@/app/manager/manager_components/ManagerShared/ManagerStatCard';
import { Bell, BellRing, AlertTriangle, CalendarClock } from 'lucide-react';

export default function ManagerNotificationsKPIs() {
  const { kpis } = useNotificationsContext();

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <ManagerStatCard title="Total"         value={kpis.total}        icon={Bell}          iconBg="rgba(100,116,139,0.1)" iconColor="var(--color-secondary)" />
      <ManagerStatCard title="Unread"        value={kpis.unread}       icon={BellRing}      iconBg="rgba(250,204,21,0.1)"  iconColor="var(--color-primary)"   />
      <ManagerStatCard title="High Priority" value={kpis.highPriority} icon={AlertTriangle} iconBg="rgba(239,68,68,0.1)"   iconColor="var(--color-danger)"    />
      <ManagerStatCard title="Today"         value={kpis.todayCount}   icon={CalendarClock} iconBg="rgba(59,130,246,0.1)"  iconColor="var(--color-info)"      />
    </div>
  );
}
