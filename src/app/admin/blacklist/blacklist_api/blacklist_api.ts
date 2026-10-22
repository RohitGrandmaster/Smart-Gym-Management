// RESPONSIBILITY: API client for the Blacklist module.
import type { BlacklistedMember, BlacklistFormValues, BlacklistKPIData } from '@/app/admin/blacklist/blacklist_types/blacklist_types';
import { MOCK_BLACKLIST, MOCK_BLACKLIST_KPI } from '@/app/admin/blacklist/blacklist_utils/AdminBlacklistSharedConstants';

let mockList = [...MOCK_BLACKLIST];

export const blacklistApi = {
  fetchBlacklist: async (): Promise<BlacklistedMember[]> => mockList,
  fetchKPIs: async (): Promise<BlacklistKPIData> => MOCK_BLACKLIST_KPI,
  addToBlacklist: async (payload: BlacklistFormValues): Promise<BlacklistedMember> => {
    const entry: BlacklistedMember = {
      ...payload,
      id: `bl${Date.now()}`,
      blacklistedBy: 'Admin',
      blacklistedAt: new Date().toISOString().slice(0, 10),
      assignedGymNames: payload.assignedGyms.includes('all') ? ['All Gyms'] : payload.assignedGyms,
      isActive: true,
    };
    mockList = [entry, ...mockList];
    return entry;
  },
  removeFromBlacklist: async (id: string): Promise<void> => {
    mockList = mockList.filter(m => m.id !== id);
  },
  toggleBlacklist: async (id: string): Promise<BlacklistedMember> => {
    mockList = mockList.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m);
    return mockList.find(m => m.id === id)!;
  },
};
