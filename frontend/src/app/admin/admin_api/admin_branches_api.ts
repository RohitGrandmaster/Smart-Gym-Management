// RESPONSIBILITY: Provides strongly-typed API interactions for Admin Branches, following the verb contract.
import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';

export const adminBranchesApi = {
  fetchBranches: () => apiFetch<ApiResponse<Branch[]>>('/admin/branches'),
};
