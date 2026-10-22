// RESPONSIBILITY: Provides inquiries state and actions to the entire inquiries module hierarchy via React Context.
// DATA FLOW: useManagerInquiriesLogic -> ManagerInquiriesContext -> ManagerInquiriesKPIs, ManagerInquiriesTable, ManagerInquiriesToolbar, ManagerInquiriesModal
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { InquiriesContextType } from '@/app/manager/inquiries/inquiries_types/ManagerInquiriesTypes';
import { useManagerInquiriesLogic } from '@/app/manager/inquiries/inquiries_context/useManagerInquiriesLogic';

const ManagerInquiriesContext = createContext<InquiriesContextType | undefined>(undefined);

export function InquiriesProvider({ children }: { children: React.ReactNode }) {
  const logic = useManagerInquiriesLogic();

  const {
    inquiries, stats, fetchState, error, toast, totalInquiries,
    search, debouncedSearch, statusFilter, dateFilter, currentPage,
    showModal, editId, editData, saving, msgModal,
    selectedIds, bulkMsgModal, convertLead,
  } = logic;

  // Memoize with explicit primitive deps to prevent re-render chains across micro-components
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => logic, [
    inquiries, stats, fetchState, error, toast, totalInquiries,
    search, debouncedSearch, statusFilter, dateFilter, currentPage,
    showModal, editId, editData, saving, msgModal,
    selectedIds, bulkMsgModal, convertLead,
  ]);

  return (
    <ManagerInquiriesContext.Provider value={value}>
      {children}
    </ManagerInquiriesContext.Provider>
  );
}

export function useInquiriesContext() {
  const context = useContext(ManagerInquiriesContext);
  if (context === undefined) {
    throw new Error('useInquiriesContext must be used within an InquiriesProvider');
  }
  return context;
}
