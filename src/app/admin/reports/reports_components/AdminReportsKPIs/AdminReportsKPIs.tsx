// RESPONSIBILITY: Renders the KPI summary row for the Reports module — total revenue, expenses, profit, members, attendance rate.
'use client';

import { TrendingUp, TrendingDown, Users, IndianRupee, Activity, Wallet } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminReportsLogic } from '@/app/admin/reports/reports_context/useAdminReportsLogic';
import { formatCurrency } from '@/app/admin/reports/reports_utils/AdminReportsSharedConstants';

export default function AdminReportsKPIs() {
  const { reportData } = useAdminReportsLogic();
  const kpis = reportData?.kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard
        title="Total Revenue"
        value={kpis ? formatCurrency(kpis.totalRevenue) : '—'}
        change="vs last period"
        changeType="up"
        icon={IndianRupee}
        iconBg="rgba(250,204,21,0.15)"
        iconColor="var(--primary)"
      />
      <AdminStatCard
        title="Net Profit"
        value={kpis ? formatCurrency(kpis.netProfit) : '—'}
        change={kpis ? `${((kpis.netProfit / kpis.totalRevenue) * 100).toFixed(1)}% margin` : '—'}
        changeType="up"
        icon={TrendingUp}
        iconBg="rgba(34,197,94,0.15)"
        iconColor="var(--success)"
      />
      <AdminStatCard
        title="Total Expenses"
        value={kpis ? formatCurrency(kpis.totalExpenses) : '—'}
        change="across all gyms"
        changeType="neutral"
        icon={TrendingDown}
        iconBg="rgba(239,68,68,0.15)"
        iconColor="var(--danger)"
      />
      <AdminStatCard
        title="Total Members"
        value={kpis ? kpis.totalMembers.toLocaleString('en-IN') : '—'}
        change={kpis ? `+${kpis.newMembers} new` : '—'}
        changeType="up"
        icon={Users}
        iconBg="rgba(59,130,246,0.15)"
        iconColor="var(--info)"
      />
      <AdminStatCard
        title="Total Payroll"
        value={kpis ? formatCurrency(kpis.totalPayroll) : '—'}
        change="this period"
        changeType="neutral"
        icon={Wallet}
        iconBg="rgba(192,132,252,0.15)"
        iconColor="var(--purple)"
      />
      <AdminStatCard
        title="Avg Attendance Rate"
        value={kpis ? `${kpis.avgAttendanceRate}%` : '—'}
        change="across all gyms"
        changeType="up"
        icon={Activity}
        iconBg="rgba(34,197,94,0.15)"
        iconColor="var(--success)"
      />
    </div>
  );
}
