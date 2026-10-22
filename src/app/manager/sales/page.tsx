// RESPONSIBILITY: Server Component that fetches initial data and acts as the entry point for the Sales module.
import ManagerSalesMain from '@/app/manager/sales/sales_components/ManagerSalesMain/ManagerSalesMain';
import { ssrSalesApi } from '@/app/manager/sales/sales_api/ManagerSalesServerApi';
import type { SalesInitialData } from '@/app/manager/sales/sales_types/ManagerSalesTypes';

export default async function SalesPage() {
  let initialData: SalesInitialData | null = null;
  
  try {
    const params = { limit: '10', page: '1' };
    const [overviewRes, reportRes, pendingRes, allRes] = await Promise.all([
      ssrSalesApi.getOverview(),
      ssrSalesApi.getMembershipReport(),
      ssrSalesApi.getPendingPayments(params),
      ssrSalesApi.getAllMemberships(params)
    ]);
    initialData = {
      overviewData: Array.isArray(overviewRes.data) ? overviewRes.data : overviewRes.data?.monthlyRevenue || [],
      membershipReport: Array.isArray(reportRes.data) ? reportRes.data : (reportRes.data?.report || []),
      membershipTotals: reportRes.data?.totals || { activeCount: 0, revenue: 0, totalReceivable: 0, totalReceived: 0, remaining: 0, refunds: 0 },
      pendingPayments: pendingRes.data?.members || [],
      pendingTotal: pendingRes.data?.total || 0,
      allMemberships: allRes.data?.members || [],
      allMembershipsTotal: allRes.data?.total || 0
    } as unknown as SalesInitialData;
  } catch {
    // SSR data fetch failed gracefully — client-side hook will re-fetch
  }

  return <ManagerSalesMain initialData={initialData} />;
}
