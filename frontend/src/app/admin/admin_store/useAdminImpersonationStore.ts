// RESPONSIBILITY: Zustand store for managing the "Login as Manager" branch impersonation session state.
import { create } from 'zustand';

export interface ImpersonatedBranch {
  id: string;
  name: string;
  location: string;
}

interface AdminImpersonationState {
  impersonatedBranch: ImpersonatedBranch | null;
  startImpersonation: (branch: ImpersonatedBranch) => void;
  stopImpersonation: () => void;
}

export const useAdminImpersonationStore = create<AdminImpersonationState>((set) => ({
  impersonatedBranch: null,
  startImpersonation: (branch) => set({ impersonatedBranch: branch }),
  stopImpersonation: () => set({ impersonatedBranch: null }),
}));
