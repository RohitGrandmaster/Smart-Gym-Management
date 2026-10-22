// RESPONSIBILITY: Core UI component/route for the admin module orchestrating views and displaying sub-components.
import AdminNotificationsClient from '@/app/admin/notifications/notifications_components/AdminNotificationsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | Admin',
  description: 'View your admin notifications',
};

export default function NotificationsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Notifications</h1>
          <p className="text-secondary mt-1">Manage your alerts and system messages.</p>
        </div>
        
        <AdminNotificationsClient />
      </div>
    </main>
  );
}

