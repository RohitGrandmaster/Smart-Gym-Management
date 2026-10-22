// RESPONSIBILITY: Server Component entry point for the Dashboard page. Delegates rendering to SuperadminDashboardView.
import SuperadminDashboardView from '@/app/superadmin/dashboard/dashboard_components/SuperadminDashboardView/SuperadminDashboardView';

export default function SaaSDashboardPage() {
  return <SuperadminDashboardView />;
}
