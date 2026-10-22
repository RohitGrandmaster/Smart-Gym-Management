// RESPONSIBILITY: React Context — bridges Zustand reports store with UI state (active tab, date range).
// DATA FLOW: ReportsProvider → useReportsContext → KPIs + Charts + Export
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useManagerReportsStore } from '@/app/manager/reports/reports_store/useManagerReportsStore';
import type { ReportTab } from '@/app/manager/reports/reports_types/ManagerReportsTypes';

interface ReportsContextValue {
  tab: ReportTab;
  setTab: (t: ReportTab) => void;
  dateRange: string;
  setDateRange: (v: string) => void;
  summary: ReturnType<typeof useManagerReportsStore.getState>['summary'];
  fetchState: ReturnType<typeof useManagerReportsStore.getState>['fetchState'];
  exporting: boolean;
  handleExportCSV: () => Promise<void>;
  reload: () => void;
}

const ManagerReportsContext = createContext<ReportsContextValue | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<ReportTab>('Revenue');
  const [dateRange, setDateRange] = useState('12m');

  const { summary, fetchState, exporting, loadSummary, exportCSV } = useManagerReportsStore();

  const reload = useCallback(() => {
    loadSummary({ range: dateRange });
  }, [dateRange, loadSummary]);

  // Re-fetch when date range changes.
  useEffect(() => { reload(); }, [reload]);

  const handleExportCSV = useCallback(async () => {
    await exportCSV(tab, { range: dateRange });
  }, [exportCSV, tab, dateRange]);

  const value = useMemo<ReportsContextValue>(() => ({
    tab, setTab,
    dateRange, setDateRange,
    summary, fetchState, exporting,
    handleExportCSV, reload,
  }), [tab, dateRange, summary, fetchState, exporting, handleExportCSV, reload]);

  return (
    <ManagerReportsContext.Provider value={value}>
      {children}
    </ManagerReportsContext.Provider>
  );
}

export function useReportsContext() {
  const ctx = useContext(ManagerReportsContext);
  if (!ctx) throw new Error('useReportsContext must be used within ReportsProvider');
  return ctx;
}
