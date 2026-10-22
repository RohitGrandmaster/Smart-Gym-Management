// RESPONSIBILITY: Zustand store for Data Export module UI state.
import { create } from 'zustand';

interface AdminDataExportStore {
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminDataExportStore = create<AdminDataExportStore>((set) => ({
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
