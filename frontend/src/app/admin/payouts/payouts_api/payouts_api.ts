// RESPONSIBILITY: API client for the Payouts module.
import type { GymPayout, PnLEntry, PayoutsKPIData } from '@/app/admin/payouts/payouts_types/payouts_types';
import { MOCK_PAYOUTS, MOCK_PNL, MOCK_PAYOUTS_KPI } from '@/app/admin/payouts/payouts_utils/AdminPayoutsSharedConstants';

export const payoutsApi = {
  fetchPayouts: async (): Promise<GymPayout[]> => MOCK_PAYOUTS,
  fetchPnL: async (): Promise<PnLEntry[]> => MOCK_PNL,
  fetchKPIs: async (): Promise<PayoutsKPIData> => MOCK_PAYOUTS_KPI,
  markPaid: async (gymId: string, month: string): Promise<void> => {
    const entry = MOCK_PAYOUTS.find(p => p.gymId === gymId && p.month === month);
    if (entry) { entry.payoutStatus = 'paid'; entry.paidOn = new Date().toISOString().slice(0, 10); }
  },
};
