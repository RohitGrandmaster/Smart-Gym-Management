import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';
import type { UsageMeter } from '@/app/superadmin/usage-meters/superadmin_usage-meters_types/superadmin_usage-meters_types';

export const usageMetersApi = {
  fetchUsageMeters: () => apiFetch<ApiResponse<UsageMeter[]>>('/api/superadmin/usage-meters'),
};
