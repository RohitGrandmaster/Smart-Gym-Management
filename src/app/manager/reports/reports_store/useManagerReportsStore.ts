// RESPONSIBILITY: Zustand store — owns async server state for the Manager Reports module.
import { create } from 'zustand';
import { reportsApi } from '@/app/manager/reports/reports_api/ManagerReportsApi';
import type { ReportSummary, FetchState } from '@/app/manager/reports/reports_types/ManagerReportsTypes';

interface ReportsState {
  summary: ReportSummary | null;
  fetchState: FetchState;
  exporting: boolean;
  loadSummary: (params?: Record<string, string>) => Promise<void>;
  exportCSV: (tab: string, params?: Record<string, string>) => Promise<void>;
}

export const useManagerReportsStore = create<ReportsState>((set) => ({
  summary: null,
  fetchState: 'idle',
  exporting: false,

  loadSummary: async (params) => {
    set({ fetchState: 'loading' });
    try {
      const data = await reportsApi.fetchSummary(params);
      set({ summary: data, fetchState: 'success' });
    } catch {
      set({ fetchState: 'error' });
    }
  },

  exportCSV: async (tab, params) => {
    set({ exporting: true });
    try {
      const blob = await reportsApi.exportReportCSV(tab, params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tab.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      set({ exporting: false });
    }
  },
}));
