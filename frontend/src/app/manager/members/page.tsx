// RESPONSIBILITY: Server component that handles initial SSR data fetching for the members module.
import ManagerMembersMain from '@/app/manager/members/members_components/ManagerMembersMain/ManagerMembersMain';
import { ssrMembersApi } from '@/app/manager/members/members_api/ManagerMembersServerApi';
import { ssrPlansApi } from '@/app/manager/plans/plans_api/ManagerPlansServerApi';
import type { MembersInitialData } from '@/app/manager/members/members_types/ManagerMembersTypes';

export default async function MembersPage() {
  let initialData: MembersInitialData | null = null;
  
  try {
    const [membersRes, plansRes, statsRes] = await Promise.all([
      ssrMembersApi.getAll({ limit: '10', page: '1' }),
      ssrPlansApi.getAll(),
      ssrMembersApi.getStats(),
    ]);
    initialData = {
      members: membersRes.data.members || [],
      totalMembers: membersRes.data.total || 0,
      plans: plansRes.data || [],
      stats: statsRes.data || { total: 0, active: 0, pending: 0, expired: 0 }
    } as unknown as MembersInitialData;
  } catch {
    // SSR data fetch failed gracefully — client-side hook will re-fetch
  }

  return <ManagerMembersMain initialData={initialData} />;
}
