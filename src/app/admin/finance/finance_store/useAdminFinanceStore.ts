// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';

interface AdminFinanceStore {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useAdminFinanceStore = create<AdminFinanceStore>((set) => ({
  showModal: false,
  setShowModal: (show) => set({ showModal: show }),
  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));

