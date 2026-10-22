// RESPONSIBILITY: Data logic hook for Admin Usage. Fetches usage data and computes metric cards.
// DATA FLOW: Mock API → useAdminUsageLogic → AdminUsageMain → child components
'use client';

import { useState, useCallback, useMemo } from 'react';
import { MOCK_USAGE_DATA } from '@/app/admin/usage/usage_utils/AdminUsageSharedConstants';
import type { AdminUsageData, AdminUsageMetric, FetchState } from '@/app/admin/usage/usage_types/AdminUsageTypes';

export function useAdminUsageLogic() {
  const [fetchState, setFetchState] = useState<FetchState>('success');
  const [data] = useState<AdminUsageData>(MOCK_USAGE_DATA);

  const loadUsage = useCallback(async () => {
    setFetchState('loading');
    await new Promise((r) => setTimeout(r, 500));
    setFetchState('success');
  }, []);

  const metrics = useMemo((): AdminUsageMetric[] => [
    { label: 'Members', used: data.activeMembers, limit: data.memberLimit, unit: 'members', warningThreshold: 80 },
    { label: 'Staff Seats', used: data.staffCount, limit: data.staffLimit, unit: 'seats', warningThreshold: 90 },
    { label: 'Branches', used: data.branchCount, limit: data.branchLimit, unit: 'branches', warningThreshold: 80 },
    { label: 'SMS This Month', used: data.smsSent, limit: data.smsLimit, unit: 'SMS', warningThreshold: 85 },
    { label: 'Storage Used', used: data.databaseGb + data.mediaGb, limit: data.storageLimitGb, unit: 'GB', warningThreshold: 80 },
    { label: 'API Calls Today', used: data.apiCallsToday, limit: data.apiCallsLimit, unit: 'calls', warningThreshold: 75 },
  ], [data]);

  return { fetchState, data, metrics, loadUsage };
}
