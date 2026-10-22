// RESPONSIBILITY: Zustand store for Payouts module UI state.
import { create } from 'zustand';
import type { PayoutTab } from '@/app/admin/payouts/payouts_types/payouts_types';

interface AdminPayoutsStore {
  activeTab: PayoutTab;
  setActiveTab: (t: PayoutTab) => void;
  monthFilter: string;
  setMonthFilter: (m: string) => void;
  gymFilter: string;
  setGymFilter: (g: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminPayoutsStore = create<AdminPayoutsStore>((set) => ({
  activeTab: 'summary',
  setActiveTab: (t) => set({ activeTab: t }),
  monthFilter: 'all',
  setMonthFilter: (m) => set({ monthFilter: m, currentPage: 1 }),
  gymFilter: 'all',
  setGymFilter: (g) => set({ gymFilter: g, currentPage: 1 }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
