// RESPONSIBILITY: Zustand store for Audit Logs UI state — filters, pagination, selected log.
import { create } from 'zustand';

interface AdminAuditLogsStore {
  search: string;
  setSearch: (v: string) => void;
  severityFilter: string;
  setSeverityFilter: (v: string) => void;
  moduleFilter: string;
  setModuleFilter: (v: string) => void;
  branchFilter: string;
  setBranchFilter: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
}

export const useAdminAuditLogsStore = create<AdminAuditLogsStore>((set) => ({
  search: '',
  setSearch: (v) => set({ search: v, currentPage: 1 }),
  severityFilter: 'all',
  setSeverityFilter: (v) => set({ severityFilter: v, currentPage: 1 }),
  moduleFilter: 'all',
  setModuleFilter: (v) => set({ moduleFilter: v, currentPage: 1 }),
  branchFilter: 'all',
  setBranchFilter: (v) => set({ branchFilter: v, currentPage: 1 }),
  dateFrom: '',
  setDateFrom: (v) => set({ dateFrom: v, currentPage: 1 }),
  dateTo: '',
  setDateTo: (v) => set({ dateTo: v, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (v) => set({ currentPage: v }),
}));
