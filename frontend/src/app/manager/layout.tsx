// RESPONSIBILITY: Root layout for the MANAGER module. Wraps all MANAGER pages with the sidebar layout and feedback providers.
import React from 'react';
import ManagerLayout from '@/app/manager/manager_components/ManagerLayout/ManagerLayout';
import { ManagerConfirmProvider } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';

export const metadata = {
  title: 'GymSmart MANAGER | Gym Management System',
  description: 'Complete gym management platform — members, attendance, finance, HR, and more.',
};

export default function MANAGERLayout({ children }: { children: React.ReactNode }) {
 return (
    <ManagerConfirmProvider>
      <ManagerLayout>{children}</ManagerLayout>
    </ManagerConfirmProvider>
  );
}
