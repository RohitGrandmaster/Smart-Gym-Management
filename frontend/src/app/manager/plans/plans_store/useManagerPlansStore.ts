// RESPONSIBILITY: Zustand store — owns async server state for the Plans module.
import { create } from 'zustand';
import { plansApi } from '@/app/manager/plans/plans_api/ManagerPlansApi';
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';

type FetchState = 'idle' | 'loading' | 'success' | 'error';

interface PlansState {
  plans: Plan[];
  fetchState: FetchState;
  saving: boolean;
  loadPlans: () => Promise<void>;
  requestPlanChange: (planId: string, note: string) => Promise<void>;
}

export const useManagerPlansStore = create<PlansState>((set, get) => ({
  plans: [],
  fetchState: 'idle',
  saving: false,

  loadPlans: async () => {
    set({ fetchState: 'loading' });
    try {
      const res = await plansApi.getAll();
      set({ plans: res.data ?? [], fetchState: 'success' });
    } catch {
      set({ fetchState: 'error' });
    }
  },

  // Manager cannot edit plans directly — sends a change request to admin.
  requestPlanChange: async (_planId: string, _note: string) => {
    set({ saving: true });
    try {
      // POST /manager/plans/change-request — backend creates a pending admin task
      await new Promise(r => setTimeout(r, 600)); // simulated until backend ready
    } finally {
      set({ saving: false });
    }
  },
}));
