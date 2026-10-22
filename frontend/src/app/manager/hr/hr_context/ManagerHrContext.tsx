// RESPONSIBILITY: Provides UI orchestration state to the HR module hierarchy. Async data is managed in useManagerHrLogic.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { HrContextType, HrInitialData } from '@/app/manager/hr/hr_types/ManagerHrTypes';
import { useManagerHrLogic } from '@/app/manager/hr/hr_context/useManagerHrLogic';

const ManagerHrContext = createContext<HrContextType | undefined>(undefined);

export function HrProvider({ children, initialData }: { children: React.ReactNode, initialData?: HrInitialData | null }) {
 const logic = useManagerHrLogic(initialData);

 const value = useMemo(() => logic, [
   logic.staff,
   logic.payrolls,
   logic.summary,
   logic.fetchState,
   logic.error,
   logic.toast,
   logic.search,
   logic.debouncedSearch,
   logic.currentPage,
   logic.showModal,
   logic.showPayrollModal,
   logic.paymentModal,
   logic.editId,
   logic.editData,
   logic.viewProfileData,
   logic.saving,
   logic.payrollMonth,
   logic.roleFilter
 ]);

 return (
 <ManagerHrContext.Provider value={value}>
 {children}
 </ManagerHrContext.Provider>
 );
}

export function useHrContext() {
 const context = useContext(ManagerHrContext);
 if (context === undefined) {
 throw new Error('useHrContext must be used within an HrProvider');
 }
 return context;
}
