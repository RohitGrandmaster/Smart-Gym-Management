// RESPONSIBILITY: React Context — bridges Zustand finance store with UI state (filters, tab, pagination).
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useManagerFinanceStore } from '@/app/manager/finance/finance_store/useManagerFinanceStore';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export type FinanceTab = 'Payments' | 'Summary';

interface FinanceContextValue {
  tab: FinanceTab;
  setTab: (t: FinanceTab) => void;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  methodFilter: string;
  setMethodFilter: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  payments: ReturnType<typeof useManagerFinanceStore.getState>['payments'];
  summary: ReturnType<typeof useManagerFinanceStore.getState>['summary'];
  totalPayments: number;
  fetchState: ReturnType<typeof useManagerFinanceStore.getState>['fetchState'];
  saving: boolean;
  reload: () => void;
  exportCSV: () => void;
}

const ManagerFinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<FinanceTab>('Payments');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const { payments, summary, totalPayments, fetchState, saving, loadAll } = useManagerFinanceStore();

  const reload = useCallback(() => {
    loadAll({ search, status: statusFilter, method: methodFilter, page: currentPage.toString(), limit: MANAGER_ITEMS_PER_PAGE.toString() });
  }, [search, statusFilter, methodFilter, currentPage, loadAll]);

  useEffect(() => {
    const t = setTimeout(reload, 300);
    return () => clearTimeout(t);
  }, [reload]);

  const exportCSV = useCallback(() => {
    const headers = ['Invoice No', 'Member', 'Plan', 'Amount', 'Method', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.invoiceNo,
      p.member?.name ?? '',
      p.member?.plan?.name ?? '',
      p.amount,
      p.method,
      p.status,
      new Date(p.paidAt).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [payments]);

  return (
    <ManagerFinanceContext.Provider value={{
      tab, setTab,
      search, setSearch,
      statusFilter, setStatusFilter,
      methodFilter, setMethodFilter,
      currentPage, setCurrentPage,
      payments, summary, totalPayments,
      fetchState, saving,
      reload, exportCSV,
    }}>
      {children}
    </ManagerFinanceContext.Provider>
  );
}

export function useFinanceContext() {
  const ctx = useContext(ManagerFinanceContext);
  if (!ctx) throw new Error('useFinanceContext must be used within FinanceProvider');
  return ctx;
}
