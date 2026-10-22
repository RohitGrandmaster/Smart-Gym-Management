// RESPONSIBILITY: API client for the Permissions module.
import type { ApiResponse } from '@/lib/api';
import type { PermissionsData, RoleType } from '@/app/admin/permissions/permissions_types/permissions_types';
import { MOCK_PERMISSIONS_DATA } from '@/app/admin/permissions/permissions_utils/AdminPermissionsSharedConstants';

let mockData = JSON.parse(JSON.stringify(MOCK_PERMISSIONS_DATA)) as PermissionsData;

export const permissionsApi = {
  fetchPermissions: async (): Promise<ApiResponse<PermissionsData>> => ({
    success: true, message: 'Permissions fetched', data: mockData,
  }),
  updateRolePermissions: async (role: RoleType, permissions: Record<string, boolean>): Promise<ApiResponse<null>> => {
    mockData.roleDefaults = mockData.roleDefaults.map(r => r.role === role ? { ...r, permissions } : r);
    return { success: true, message: 'Role permissions updated', data: null };
  },
  updateGymOverride: async (gymId: string, role: RoleType, overrides: Record<string, boolean>): Promise<ApiResponse<null>> => {
    const existing = mockData.gymOverrides.find(o => o.gymId === gymId && o.role === role);
    if (existing) {
      mockData.gymOverrides = mockData.gymOverrides.map(o =>
        o.gymId === gymId && o.role === role ? { ...o, overrides } : o
      );
    } else {
      const gymName = gymId === 'b1' ? 'Andheri East' : gymId === 'b2' ? 'Bandra West' : gymId === 'b3' ? 'Powai' : 'Thane';
      mockData.gymOverrides.push({ gymId, gymName, role, overrides });
    }
    return { success: true, message: 'Gym override saved', data: null };
  },
};
