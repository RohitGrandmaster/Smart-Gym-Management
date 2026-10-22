// RESPONSIBILITY: Core data logic hook for the admin module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { create } from 'zustand';
import type { TimeRange } from '@/app/admin/dashboard/dashboard_types/dashboard_types';

interface AdminDashboardStore {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  startDate: string;
  endDate: string;
  setCustomDateRange: (start: string, end: string) => void;
}

export const useAdminDashboardStore = create<AdminDashboardStore>((set) => ({
  timeRange: 'monthly',
  setTimeRange: (range) => set({ timeRange: range, ...(range !== 'custom' ? { startDate: '', endDate: '' } : {}) }),
  startDate: '',
  endDate: '',
  setCustomDateRange: (startDate, endDate) => set({ startDate, endDate }),
}));

