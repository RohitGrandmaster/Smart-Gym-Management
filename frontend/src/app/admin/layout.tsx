// RESPONSIBILITY: Root layout for the ADMIN module. Wraps all ADMIN pages with the sidebar layout and feedback providers.
import React from 'react';
import AdminLayout from '@/app/admin/admin_components/AdminLayout/AdminLayout';
import { AdminConfirmProvider } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';

import { AdminQueryProvider } from '@/app/admin/admin_components/AdminQueryProvider';

export const metadata = {
  title: 'GymSmart ADMIN | Gym Management System',
  description: 'Complete gym management platform — members, attendance, finance, HR, and more.',
};

export default function ADMINLayout({ children }: { children: React.ReactNode }) {
 return (
    <AdminQueryProvider>
      <AdminConfirmProvider>
        <AdminLayout>{children}</AdminLayout>
      </AdminConfirmProvider>
    </AdminQueryProvider>
  );
}
