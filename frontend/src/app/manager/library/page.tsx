// RESPONSIBILITY: Server Component — fetches initial SSR data and renders the Diet Library module entry point.
import ManagerLibraryMain from '@/app/manager/library/library_components/ManagerLibraryMain/ManagerLibraryMain';
import { ssrLibraryApi } from '@/app/manager/library/library_api/ManagerLibraryServerApi';
import type { LibraryInitialData } from '@/app/manager/library/library_types/ManagerLibraryTypes';

export default async function LibraryPage() {
  let initialData: LibraryInitialData | null = null;
  
  try {
    const dietRes = await ssrLibraryApi.getDietPlans();
    initialData = {
      dietPlans: dietRes.data?.dietPlans || dietRes.data || [],
    };
  } catch (e) {
    // Silently fail and return empty array. Client handles refetch.
  }

  return <ManagerLibraryMain initialData={initialData} />;
}
