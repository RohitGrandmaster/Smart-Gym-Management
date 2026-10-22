// RESPONSIBILITY: Zustand store — owns all async server state for the Finance module.
import { create } from 'zustand';
import { financeApi } from '@/app/manager/finance/finance_api/ManagerFinanceApi';
import type { Payment, FinanceSummary } from '@/app/manager/finance/finance_types/ManagerFinanceTypes';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

interface FinanceState {
  payments: Payment[];
  summary: FinanceSummary | null;
  totalPayments: number;
  fetchState: FetchState;
  saving: boolean;
  loadAll: (params?: Record<string, string>) => Promise<void>;
  savePayment: (data: Partial<Payment>) => Promise<void>;
}

export const useManagerFinanceStore = create<FinanceState>((set, get) => ({
  payments: [],
  summary: null,
  totalPayments: 0,
  fetchState: 'idle',
  saving: false,

  loadAll: async (params) => {
    set({ fetchState: 'loading' });
    try {
      const [paymentsRes, summaryRes] = await Promise.all([
        financeApi.getPayments(params),
        financeApi.getSummary(),
      ]);
      let fetched = paymentsRes.data?.payments || [];
      if (params?.search) {
        const q = params.search.toLowerCase();
        fetched = fetched.filter((p: Payment) =>
          p.invoiceNo?.toLowerCase().includes(q) ||
          p.member?.name?.toLowerCase().includes(q) ||
          p.method?.toLowerCase().includes(q)
        );
      }
      if (params?.status && params.status !== 'ALL') {
        fetched = fetched.filter((p: Payment) => p.status === params.status);
      }
      if (params?.method && params.method !== 'ALL') {
        fetched = fetched.filter((p: Payment) => p.method === params.method);
      }
      set({
        payments: fetched,
        totalPayments: paymentsRes.data?.total || 0,
        summary: summaryRes.data || null,
        fetchState: 'success',
      });
    } catch {
      set({ fetchState: 'error' });
    }
  },

  savePayment: async (data) => {
    set({ saving: true });
    try {
      await financeApi.createPayment(data);
      await get().loadAll();
    } finally {
      set({ saving: false });
    }
  },
}));
