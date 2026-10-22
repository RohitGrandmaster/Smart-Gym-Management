// RESPONSIBILITY: Server Component that fetches initial data and acts as the entry point for the Finance module.
import AdminFinanceMain from '@/app/admin/finance/finance_components/AdminFinanceMain/AdminFinanceMain';
import { ssrFinanceApi } from '@/app/admin/finance/finance_api/finance_server_api';
import type { FinanceInitialData } from '@/app/admin/finance/finance_types/finance_types';

export default async function FinancePage() {
  let initialData: FinanceInitialData | null = null;
  
  try {
    const [paymentsRes, summaryRes] = await Promise.all([
      ssrFinanceApi.getPayments({ limit: '10', page: '1' }),
      ssrFinanceApi.getSummary(),
    ]);
    initialData = {
      payments: paymentsRes.data?.payments || [],
      totalPayments: paymentsRes.data?.total || 0,
      summary: summaryRes.data || null
    };
  } catch {
    // SSR data fetch failed gracefully — client-side hook will re-fetch
  }

  return <AdminFinanceMain initialData={initialData} />;
}
