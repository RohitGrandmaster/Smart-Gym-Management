// RESPONSIBILITY: Orchestrator for the Notifications module.
// DATA FLOW: NotificationsProvider → useNotificationsContext → KPIs + Table
'use client';

import { NotificationsProvider } from '@/app/manager/notifications/notifications_context/ManagerNotificationsContext';
import ManagerHeader from '@/app/manager/manager_components/ManagerLayout/ManagerHeader';
import ManagerNotificationsKPIs from '@/app/manager/notifications/notifications_components/ManagerNotificationsKPIs/ManagerNotificationsKPIs';
import ManagerNotificationsTable from '@/app/manager/notifications/notifications_components/ManagerNotificationsTable/ManagerNotificationsTable';

function NotificationsInner() {
  return (
    <div className="min-h-full pb-10">
      <ManagerHeader title="Notifications" subtitle="System alerts, member expiry warnings, and payment reminders" />
      <div className="p-6 space-y-6">
        <ManagerNotificationsKPIs />
        <ManagerNotificationsTable />
      </div>
    </div>
  );
}

export default function ManagerNotificationsMain() {
  return (
    <NotificationsProvider>
      <NotificationsInner />
    </NotificationsProvider>
  );
}
