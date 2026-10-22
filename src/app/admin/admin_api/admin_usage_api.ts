import { apiFetch } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export interface AdminUsageData {
  tenantId: string;
  smsSent: number;
  smsLimit: number;
  databaseGb: number;
  mediaGb: number;
  storageLimitGb: number;
  activeMembers: number;
  totalMembers: number;
  memberLimit: number;
  staffCount: number;
  staffLimit: number;
  billingCycleEnd: string;
}

// RESPONSIBILITY: Provides API calls for the Admin to fetch their own usage data against limits.
export const adminUsageApi = {
  fetchMyUsage: async (): Promise<ApiResponse<AdminUsageData>> => {
    // Mocking an API call for usage limits
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Usage data fetched successfully',
          data: {
            tenantId: 'gym-1234',
            smsSent: 9500, // Near limit
            smsLimit: 10000,
            databaseGb: 8.0,
            mediaGb: 11.5, // 19.5 total
            storageLimitGb: 20, // Near limit
            activeMembers: 1950,
            totalMembers: 2100,
            memberLimit: 2000,
            staffCount: 15,
            staffLimit: 15,
            billingCycleEnd: 'Oct 15, 2026'
          }
        });
      }, 500);
    });
  }
};
