// RESPONSIBILITY: Zustand store for Reports module UI state — active tab, date range, gym filter.
import { create } from 'zustand';
import type { ReportTab, ReportDateRange } from '@/app/admin/reports/reports_types/reports_types';

interface AdminReportsStore {
  activeTab: ReportTab;
  setActiveTab: (tab: ReportTab) => void;
  dateRange: ReportDateRange;
  setDateRange: (range: ReportDateRange) => void;
  startDate: string;
  endDate: string;
  setCustomDateRange: (start: string, end: string) => void;
  selectedGymId: string;
  setSelectedGymId: (id: string) => void;
}

export const useAdminReportsStore = create<AdminReportsStore>((set) => ({
  activeTab: 'revenue',
  setActiveTab: (tab) => set({ activeTab: tab }),
  dateRange: 'this_month',
  setDateRange: (range) => set({ dateRange: range }),
  startDate: '',
  endDate: '',
  setCustomDateRange: (startDate, endDate) => set({ startDate, endDate }),
  selectedGymId: 'all',
  setSelectedGymId: (id) => set({ selectedGymId: id }),
}));
