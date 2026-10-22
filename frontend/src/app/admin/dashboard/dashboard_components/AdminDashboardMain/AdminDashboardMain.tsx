// RESPONSIBILITY: Main entry point for the dashboard module. Renders layout, handles high-level loading/error states, and sets up Context.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import { useAdminDashboardLogic } from '@/app/admin/dashboard/dashboard_context/useAdminDashboardLogic';
import { useAdminDashboardStore } from '@/app/admin/dashboard/dashboard_store/useAdminDashboardStore';
import type { TimeRange } from '@/app/admin/dashboard/dashboard_types/dashboard_types';
import AdminDashboardKPIs from '@/app/admin/dashboard/dashboard_components/AdminDashboardKPIs/AdminDashboardKPIs';
import AdminDashboardBranchLeaderboard from '@/app/admin/dashboard/dashboard_components/AdminDashboardBranchLeaderboard/AdminDashboardBranchLeaderboard';
import AdminDashboardAlerts from '@/app/admin/dashboard/dashboard_components/AdminDashboardAlerts/AdminDashboardAlerts';
import AdminDashboardRevenueTrend from '@/app/admin/dashboard/dashboard_components/AdminDashboardRevenueTrend/AdminDashboardRevenueTrend';
import AdminDashboardExpiringWidget from '@/app/admin/dashboard/dashboard_components/AdminDashboardExpiringWidget/AdminDashboardExpiringWidget';
import AdminDashboardAttendanceTrend from '@/app/admin/dashboard/dashboard_components/AdminDashboardAttendanceTrend/AdminDashboardAttendanceTrend';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';

const TIME_RANGE_OPTIONS = [
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'yearly', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl motion-safe:animate-pulse border border-border" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        <div className="h-80 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-64 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
        <div className="h-64 bg-card rounded-xl motion-safe:animate-pulse border border-border" />
      </div>
    </div>
  );
}

export default function AdminDashboardMain() {
  const { stats, status, error } = useAdminDashboardLogic();
  const { timeRange, setTimeRange, startDate, endDate, setCustomDateRange } = useAdminDashboardStore();

  if (status === 'loading') return <div className="min-h-full"><DashboardSkeleton /></div>;

  if (status === 'error') return (
    <div className="min-h-full flex items-center justify-center">
      <div className="text-center">
        <p className="font-medium text-danger">Failed to load dashboard</p>
        <p className="text-sm mt-1 text-danger">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-full">
      <AdminHeader title="Dashboard" subtitle="Welcome back, Admin! Here's your business overview." />
      <div className="p-6 space-y-6">

        {/* Time Range Selector */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 items-center">
          {timeRange === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
              <label className="text-sm font-medium text-secondary">From:</label>
              <input type="date" value={startDate} onChange={(e) => setCustomDateRange(e.target.value, endDate)}
                className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Start Date"
              />
              <label className="text-sm font-medium text-secondary ml-1">To:</label>
              <input type="date" value={endDate} onChange={(e) => setCustomDateRange(startDate, e.target.value)}
                className="bg-input border border-border text-sm rounded-lg px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="End Date"
              />
            </div>
          )}
          <div className="w-full sm:w-48">
            <AdminSearchableDropdown
              options={TIME_RANGE_OPTIONS}
              value={timeRange}
              onChange={(v) => {
                setTimeRange(v as TimeRange);
                if (v !== 'custom') setCustomDateRange('', '');
              }}
              placeholder="Select range"
            />
          </div>
        </div>

        {/* KPIs */}
        <AdminDashboardKPIs />

        {/* Row 2: Leaderboard + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminDashboardBranchLeaderboard />
          </div>
          <div className="max-h-96">
            <AdminDashboardAlerts />
          </div>
        </div>

        {/* Row 3: Revenue Trend */}
        <AdminDashboardRevenueTrend />

        {/* Row 4: Attendance Trend + Expiring Widget */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AdminDashboardAttendanceTrend />
          </div>
          <div>
            <AdminDashboardExpiringWidget />
          </div>
        </div>

      </div>
    </div>
  );
}
