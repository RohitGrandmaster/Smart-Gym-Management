// RESPONSIBILITY: Server Component � fetches initial SSR data and renders the HR & Payroll module entry point.
import ManagerHrMain from '@/app/manager/hr/hr_components/ManagerHrMain/ManagerHrMain';
import { ssrHrApi } from '@/app/manager/hr/hr_api/ManagerHrServerApi';
import type { HrInitialData } from '@/app/manager/hr/hr_types/ManagerHrTypes';

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
  } catch (e) {
    // Silently fail and return empty data. Client handles refetch.
  }

  return <ManagerHrMain initialData={initialData} />;
}
