// RESPONSIBILITY: Zustand store for Bulk Communications module UI state.
import { create } from 'zustand';
import type { BroadcastTab } from '@/app/admin/bulk-communications/bulk_communications_types/bulk_communications_types';

interface AdminBulkCommunicationsStore {
  activeTab: BroadcastTab;
  setActiveTab: (t: BroadcastTab) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  channelFilter: string;
  setChannelFilter: (c: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminBulkCommunicationsStore = create<AdminBulkCommunicationsStore>((set) => ({
  activeTab: 'compose',
  setActiveTab: (t) => set({ activeTab: t }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  channelFilter: 'all',
  setChannelFilter: (c) => set({ channelFilter: c, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
