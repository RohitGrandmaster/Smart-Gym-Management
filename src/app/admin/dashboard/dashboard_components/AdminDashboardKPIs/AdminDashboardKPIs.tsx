// RESPONSIBILITY: Renders the two rows of KPI metric stat cards on the dashboard using live data from AdminDashboardContext.
'use client';

import { useAdminDashboardLogic } from '@/app/admin/dashboard/dashboard_context/useAdminDashboardLogic';
import { useAdminDashboardStore } from '@/app/admin/dashboard/dashboard_store/useAdminDashboardStore';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { formatCurrency } from '@/app/admin/dashboard/dashboard_utils/AdminDashboardSharedConstants';
import { Users, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, UserCheck, ShoppingCart } from 'lucide-react';
import { useAdminGlobalStore } from '@/app/admin/admin_store/useAdminGlobalStore';

export default function AdminDashboardKPIs() {
  const { stats, status, error } = useAdminDashboardLogic();
  const { timeRange, setTimeRange, startDate, endDate, setCustomDateRange } = useAdminDashboardStore();
  const { selectedBranchId } = useAdminGlobalStore();
  
  if (!stats) return null;
  
  // Simulated API response behavior: scale down metrics if a specific branch is selected.
  const scale = selectedBranchId === 'all' ? 1 : 0.35;
  const s = {
    ...stats,
    totalMembers: Math.floor(stats.totalMembers * scale),
    monthlyRevenue: stats.monthlyRevenue * scale,
    activeMembers: Math.floor(stats.activeMembers * scale),
    pendingPayments: stats.pendingPayments * scale,
    newMembersThisMonth: Math.floor(stats.newMembersThisMonth * scale),
    activeStaff: Math.floor(stats.activeStaff * scale),
    totalProducts: Math.floor(stats.totalProducts * scale),
    lowStockCount: Math.floor(stats.lowStockCount * scale),
    newInquiries: Math.floor(stats.newInquiries * scale),
    totalInquiries: Math.floor(stats.totalInquiries * scale),
    membersByStatus: {
      pending: Math.floor((stats.membersByStatus?.pending || 0) * scale),
      active: Math.floor((stats.membersByStatus?.active || 0) * scale),
      expired: Math.floor((stats.membersByStatus?.expired || 0) * scale)
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard
        title="Total Revenue"
        value={formatCurrency(s.totalRevenue || 0)}
        change="All Time"
        changeType="neutral"
        icon={DollarSign}
        iconBg="bg-primary/20"
        iconColor="text-primary"
      />
      <AdminStatCard
        title="Net Profit"
        value={formatCurrency(s.netProfit || 0)}
        change="All Time"
        changeType="up"
        icon={TrendingUp}
        iconBg="bg-success/20"
        iconColor="text-success"
      />
      <AdminStatCard
        title="Active Members"
        value={(s.activeMembers || 0).toLocaleString()}
        change={`${s.totalMembers ? Math.round((s.activeMembers / s.totalMembers) * 100) : 0}% capacity`}
        changeType="neutral"
        icon={UserCheck}
        iconBg="bg-info/20"
        iconColor="text-info"
      />
      <AdminStatCard
        title="Total Outstanding"
        value={formatCurrency(s.pendingPayments || 0)}
        change={`${s.membersByStatus?.pending || 0} members due`}
        changeType="down"
        icon={AlertCircle}
        iconBg="bg-danger/20"
        iconColor="text-danger"
      />
    </div>
  );
}


