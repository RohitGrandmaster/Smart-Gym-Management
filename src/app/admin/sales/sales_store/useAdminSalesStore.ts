// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';

interface AdminSalesStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  filterPlan: string;
  setFilterPlan: (plan: string) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useAdminSalesStore = create<AdminSalesStore>((set) => ({
  activeTab: 'Overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  dateRange: 'This Month',
  setDateRange: (range) => set({ dateRange: range }),
  filterPlan: 'All Plans',
  setFilterPlan: (plan) => set({ filterPlan: plan }),
  toast: null,
  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));

