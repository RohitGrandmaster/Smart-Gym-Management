// RESPONSIBILITY: Server Component � fetches initial SSR data and renders the HR & Payroll module entry point.
import AdminHrMain from '@/app/admin/hr/hr_components/AdminHrMain/AdminHrMain';
import { ssrHrApi } from '@/app/admin/hr/hr_api/AdminHrServerApi';
import type { HrInitialData } from '@/app/admin/hr/hr_types/AdminHrTypes';

export default async function HrPage() {
  let initialData: HrInitialData | null = null;
  
  try {
    const [staffRes, payrollRes, summaryRes] = await Promise.all([
      ssrHrApi.getStaff(),
      ssrHrApi.getPayrolls(),
      ssrHrApi.getSummary(),
    ]);
    initialData = {
      staff: staffRes.data?.staff || staffRes.data || [],
      payrolls: payrollRes.data?.payrolls || payrollRes.data || [],
      summary: summaryRes.data || null
    };
  } catch {
    // SSR data fetch failed gracefully — client-side hook will re-fetch
  }

  return <AdminHrMain initialData={initialData} />;
}
