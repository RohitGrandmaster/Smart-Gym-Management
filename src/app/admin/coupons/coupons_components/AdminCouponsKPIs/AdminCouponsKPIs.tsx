// RESPONSIBILITY: Renders the 4 KPI cards for the Coupons module — total, active, redeemed, revenue lost. Derived from live coupon data.
'use client';

import { Tag, CheckCircle, BarChart2, TrendingDown } from 'lucide-react';
import AdminStatCard from '@/app/admin/admin_components/AdminShared/AdminStatCard';
import { useAdminCouponsLogic } from '@/app/admin/coupons/coupons_context/useAdminCouponsLogic';
import { formatCurrency } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';

export default function AdminCouponsKPIs() {
  const { allCoupons } = useAdminCouponsLogic();

  const totalCoupons = allCoupons.length;
  const activeCoupons = allCoupons.filter(c => c.status === 'active').length;
  const totalRedeemed = allCoupons.reduce((sum, c) => sum + c.usedCount, 0);
  const revenueLost = allCoupons.reduce((sum, c) => {
    const avgDiscount = c.type === 'flat' ? c.value : Math.min(c.value * 10, c.maxDiscount || c.value * 10);
    return sum + c.usedCount * avgDiscount;
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <AdminStatCard title="Total Coupons" value={totalCoupons} icon={Tag} iconBg="rgba(250,204,21,0.15)" iconColor="var(--primary)" />
      <AdminStatCard title="Active Coupons" value={activeCoupons} change="currently live" changeType="up" icon={CheckCircle} iconBg="rgba(34,197,94,0.15)" iconColor="var(--success)" />
      <AdminStatCard title="Total Redeemed" value={totalRedeemed.toLocaleString('en-IN')} change="all time" changeType="neutral" icon={BarChart2} iconBg="rgba(59,130,246,0.15)" iconColor="var(--info)" />
      <AdminStatCard title="Revenue Lost" value={formatCurrency(revenueLost)} change="to discounts" changeType="down" icon={TrendingDown} iconBg="rgba(239,68,68,0.15)" iconColor="var(--danger)" />
    </div>
  );
}
