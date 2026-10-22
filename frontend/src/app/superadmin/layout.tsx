// RESPONSIBILITY: Root layout for all /superadmin/* routes. Wraps pages in the SuperadminLayout shell (Sidebar + Header). Pure Server Component — no client hooks.

import '@/app/superadmin/superadmin.css';
import SuperadminLayout from '@/app/superadmin/superadmin_components/SuperadminLayout/SuperadminLayout';
import { SuperadminQueryProvider } from '@/app/superadmin/superadmin_components/SuperadminQueryProvider';
import { SuperadminConfirmProvider } from '@/app/superadmin/superadmin_components/SuperadminFeedback/SuperadminConfirmProvider';

export const metadata = {
  title: 'Master Control Panel | GymSmart SaaS',
  description: 'Global SaaS management and tenant administration platform',
};

export default function SaaSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="superadmin-module bg-background text-foreground min-h-screen">
      <SuperadminQueryProvider>
        <SuperadminConfirmProvider>
          <SuperadminLayout>{children}</SuperadminLayout>
        </SuperadminConfirmProvider>
      </SuperadminQueryProvider>
    </div>
  );
}
