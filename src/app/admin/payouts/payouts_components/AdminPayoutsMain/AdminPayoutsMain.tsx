// RESPONSIBILITY: Main entry point for the Payouts module.
'use client';

import AdminHeader from '@/app/admin/admin_components/AdminLayout/AdminHeader';
import AdminPayoutsKPIs from '@/app/admin/payouts/payouts_components/AdminPayoutsKPIs/AdminPayoutsKPIs';
import AdminPayoutsTabs from '@/app/admin/payouts/payouts_components/AdminPayoutsTabs/AdminPayoutsTabs';
import AdminPayoutsSummaryTable from '@/app/admin/payouts/payouts_components/AdminPayoutsSummaryTable/AdminPayoutsSummaryTable';
import AdminPayoutsPnLStatement from '@/app/admin/payouts/payouts_components/AdminPayoutsPnLStatement/AdminPayoutsPnLStatement';
import { useAdminPayoutsLogic } from '@/app/admin/payouts/payouts_context/useAdminPayoutsLogic';

export default function AdminPayoutsMain() {
  const { activeTab } = useAdminPayoutsLogic();
  return (
    <div className="min-h-full pb-10">
      <AdminHeader title="Payouts & Profit" subtitle="Net profit per gym, monthly payout summaries, and tax-ready P&L statements" />
      <div className="p-6 space-y-5">
        <AdminPayoutsKPIs />
        <AdminPayoutsTabs />
        {activeTab === 'summary' ? <AdminPayoutsSummaryTable /> : <AdminPayoutsPnLStatement />}
      </div>
    </div>
  );
}
