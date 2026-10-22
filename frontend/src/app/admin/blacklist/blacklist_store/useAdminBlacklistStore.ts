// RESPONSIBILITY: Zustand store for Blacklist module UI state.
import { create } from 'zustand';
import type { BlacklistFormValues } from '@/app/admin/blacklist/blacklist_types/blacklist_types';
import { EMPTY_BLACKLIST_FORM } from '@/app/admin/blacklist/blacklist_utils/AdminBlacklistSharedConstants';

interface AdminBlacklistStore {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  form: BlacklistFormValues;
  setForm: (f: BlacklistFormValues) => void;
  search: string;
  setSearch: (s: string) => void;
  scopeFilter: string;
  setScopeFilter: (s: string) => void;
  gymFilter: string;
  setGymFilter: (g: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminBlacklistStore = create<AdminBlacklistStore>((set) => ({
  showModal: false,
  setShowModal: (v) => set({ showModal: v }),
  form: EMPTY_BLACKLIST_FORM,
  setForm: (f) => set({ form: f }),
  search: '',
  setSearch: (s) => set({ search: s, currentPage: 1 }),
  scopeFilter: 'all',
  setScopeFilter: (s) => set({ scopeFilter: s, currentPage: 1 }),
  gymFilter: 'all',
  setGymFilter: (g) => set({ gymFilter: g, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
