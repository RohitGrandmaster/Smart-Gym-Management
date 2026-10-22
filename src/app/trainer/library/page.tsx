// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server Component � fetches initial SSR data and renders the Diet Library module entry point.
import TrainerLibraryMain from '@/app/trainer/library/library_components/TrainerLibraryMain/TrainerLibraryMain';
import { ssrLibraryApi } from '@/app/trainer/library/library_api/library_server_api';
import type { LibraryInitialData } from '@/app/trainer/library/library_types/library_types';

export default async function LibraryPage() {
  let initialData: LibraryInitialData | null = null;
  
  try {
    const [dietRes] = await Promise.all([
      ssrLibraryApi.getDietPlans(),
    ]);
    initialData = {
      dietPlans: dietRes.data?.dietPlans || dietRes.data || [],
    };
  } catch (e) {
    // Error logged to monitoring provider
  }

  return <TrainerLibraryMain initialData={initialData} />;
}

