// RESPONSIBILITY: Zustand store for Subscriptions UI state.
import { create } from 'zustand';

interface AdminSubscriptionsStore {
  activeTab: 'overview' | 'plans' | 'invoices' | 'payment';
  setActiveTab: (t: 'overview' | 'plans' | 'invoices' | 'payment') => void;
  showUpgradeConfirm: string | null;
  setShowUpgradeConfirm: (planId: string | null) => void;
}

export const useAdminSubscriptionsStore = create<AdminSubscriptionsStore>((set) => ({
  activeTab: 'overview',
  setActiveTab: (t) => set({ activeTab: t }),
  showUpgradeConfirm: null,
  setShowUpgradeConfirm: (planId) => set({ showUpgradeConfirm: planId }),
}));
