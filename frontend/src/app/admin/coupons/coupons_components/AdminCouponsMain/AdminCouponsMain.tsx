// RESPONSIBILITY: Main entry point for the Coupons module. Composes KPIs, toolbar, table, and modal.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminCouponsKPIs from '@/app/admin/coupons/coupons_components/AdminCouponsKPIs/AdminCouponsKPIs';
import AdminCouponsToolbar from '@/app/admin/coupons/coupons_components/AdminCouponsToolbar/AdminCouponsToolbar';
import AdminCouponsTable from '@/app/admin/coupons/coupons_components/AdminCouponsTable/AdminCouponsTable';
import AdminCouponsModal from '@/app/admin/coupons/coupons_components/AdminCouponsModal/AdminCouponsModal';

export default function AdminCouponsMain() {
  return (
    <div className="min-h-full pb-10">
      <AdminHeader
        title="Coupons"
        subtitle="Create and manage discount coupons across all your gyms"
      />
      <div className="p-6 space-y-5">
        <AdminCouponsKPIs />
        <AdminCouponsToolbar />
        <AdminCouponsTable />
      </div>
      <AdminCouponsModal />
    </div>
  );
}
