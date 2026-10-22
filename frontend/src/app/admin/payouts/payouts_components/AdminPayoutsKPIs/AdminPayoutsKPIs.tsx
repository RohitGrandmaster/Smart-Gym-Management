// RESPONSIBILITY: KPI cards for the Payouts module.
'use client';

import { TrendingUp, IndianRupee, TrendingDown, Clock } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminPayoutsLogic } from '@/app/admin/payouts/payouts_context/useAdminPayoutsLogic';
import { fmt } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';

export default function AdminPayoutsKPIs() {
  const { kpis } = useAdminPayoutsLogic();
  if (!kpis) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard title="Net Profit (This Month)" value={fmt(kpis.totalNetProfit)} change="after all deductions" changeType="up" icon={TrendingUp} iconBg="rgba(34,197,94,0.15)" iconColor="var(--success)" />
      <AdminStatCard title="Gross Revenue" value={fmt(kpis.totalGrossRevenue)} change="all gyms combined" changeType="neutral" icon={IndianRupee} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="Total Expenses" value={fmt(kpis.totalExpenses)} change="payroll + ops" changeType="down" icon={TrendingDown} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
      <AdminStatCard title="Pending Payouts" value={kpis.pendingPayouts} change="awaiting transfer" changeType="neutral" icon={Clock} iconBg="rgba(245,158,11,0.15)" iconColor="var(--warning)" />
    </div>
  );
}
