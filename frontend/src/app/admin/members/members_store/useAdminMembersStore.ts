// RESPONSIBILITY: Zustand store for Admin Members UI state — filters, pagination, selected member.
import { create } from 'zustand';
import type { MemberStatus } from '@/app/admin/members/members_types/AdminMembersTypes';

interface AdminMembersStoreState {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: MemberStatus | 'all';
  setStatusFilter: (s: MemberStatus | 'all') => void;
  branchFilter: string;
  setBranchFilter: (s: string) => void;
  expiryFilter: 'all' | 'this_week' | 'this_month';
  setExpiryFilter: (s: 'all' | 'this_week' | 'this_month') => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminMembersStore = create<AdminMembersStoreState>((set) => ({
  search: '',
  setSearch: (s) => set({ search: s, currentPage: 1 }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  branchFilter: 'all',
  setBranchFilter: (s) => set({ branchFilter: s, currentPage: 1 }),
  expiryFilter: 'all',
  setExpiryFilter: (s) => set({ expiryFilter: s, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
