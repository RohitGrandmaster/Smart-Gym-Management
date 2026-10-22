// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';
import type { TimeRange } from '@/app/admin/dashboard/dashboard_types/dashboard_types';

export type DetailView = "revenue" | "expenses" | "staff" | "students";

interface AdminBranchesStore {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  detailView: DetailView | null;
  setDetailView: (view: DetailView | null) => void;
}

export const useAdminBranchesStore = create<AdminBranchesStore>((set) => ({
  timeRange: 'monthly',
  setTimeRange: (range) => set({ timeRange: range }),
  startDate: '',
  setStartDate: (date) => set({ startDate: date }),
  endDate: '',
  setEndDate: (date) => set({ endDate: date }),
  selectedBranch: null,
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  detailView: null,
  setDetailView: (view) => set({ detailView: view }),
}));

