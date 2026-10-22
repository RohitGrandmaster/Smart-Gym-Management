// RESPONSIBILITY: Main entry point for the Gym Comparison module. Composes selector, charts, table, leaderboard, and alerts.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import { useAdminGymComparisonLogic } from '@/app/admin/gym-comparison/gym_comparison_context/useAdminGymComparisonLogic';
import AdminGymComparisonSelector from '@/app/admin/gym-comparison/gym_comparison_components/AdminGymComparisonSelector/AdminGymComparisonSelector';
import AdminGymComparisonCharts from '@/app/admin/gym-comparison/gym_comparison_components/AdminGymComparisonCharts/AdminGymComparisonCharts';
import AdminGymComparisonTable from '@/app/admin/gym-comparison/gym_comparison_components/AdminGymComparisonTable/AdminGymComparisonTable';
import AdminGymComparisonLeaderboard from '@/app/admin/gym-comparison/gym_comparison_components/AdminGymComparisonLeaderboard/AdminGymComparisonLeaderboard';
import AdminGymComparisonAlerts from '@/app/admin/gym-comparison/gym_comparison_components/AdminGymComparisonAlerts/AdminGymComparisonAlerts';

function ComparisonSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-14 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
    </div>
  );
}

export default function AdminGymComparisonMain() {
  const { fetchState } = useAdminGymComparisonLogic();

  if (fetchState === 'loading') return <ComparisonSkeleton />;

  return (
    <div className="min-h-full pb-10">
      <AdminHeader
        title="Gym Comparison"
        subtitle="Side-by-side performance benchmarking across your gyms"
      />
      <div className="p-6 space-y-6">
        <AdminGymComparisonSelector />
        <AdminGymComparisonCharts />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminGymComparisonTable />
          </div>
          <div className="space-y-6">
            <AdminGymComparisonLeaderboard />
            <AdminGymComparisonAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}
