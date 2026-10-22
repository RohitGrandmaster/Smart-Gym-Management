// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Server component that handles initial SSR data fetching for the members module.
import TrainerMembersMain from '@/app/trainer/members/members_components/TrainerMembersMain/TrainerMembersMain';
import { ssrMembersApi } from '@/app/trainer/members/members_api/members_server_api';
import type { MembersInitialData } from '@/app/trainer/members/members_types/members_types';

export default async function MembersPage() {
  let initialData: MembersInitialData = {
    members: [],
    totalMembers: 0,
    stats: { total: 0, active: 0, pending: 0, expired: 0 }
  };
  
  try {
    const [membersRes, statsRes] = await Promise.all([
      ssrMembersApi.fetchMembers({ limit: '10', page: '1' }),
      ssrMembersApi.fetchMemberStats(),
    ]);
    initialData = {
      members: (membersRes.data as any).members || [],
      totalMembers: (membersRes.data as any).total || 0,
      stats: (statsRes.data as any) || { total: 0, active: 0, pending: 0, expired: 0 }
    };
  } catch {
    // SSR data fetch failed gracefully — client-side hook will re-fetch
  }

  return <TrainerMembersMain initialData={initialData} />;
}
