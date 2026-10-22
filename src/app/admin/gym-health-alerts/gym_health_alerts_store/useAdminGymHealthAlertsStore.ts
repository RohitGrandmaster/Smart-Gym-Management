// RESPONSIBILITY: Zustand store for Gym Health Alerts module UI state.
import { create } from 'zustand';

interface AdminGymHealthAlertsStore {
  severityFilter: string;
  setSeverityFilter: (s: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  gymFilter: string;
  setGymFilter: (g: string) => void;
  resolvedFilter: string;
  setResolvedFilter: (r: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminGymHealthAlertsStore = create<AdminGymHealthAlertsStore>((set) => ({
  severityFilter: 'all',
  setSeverityFilter: (s) => set({ severityFilter: s, currentPage: 1 }),
  typeFilter: 'all',
  setTypeFilter: (t) => set({ typeFilter: t, currentPage: 1 }),
  gymFilter: 'all',
  setGymFilter: (g) => set({ gymFilter: g, currentPage: 1 }),
  resolvedFilter: 'active',
  setResolvedFilter: (r) => set({ resolvedFilter: r, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
