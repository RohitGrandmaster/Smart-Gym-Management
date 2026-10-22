// RESPONSIBILITY: Provides sales module state (revenue data, membership reports, pending payments) to all Sales components via React Context. Sync UI state only — async data must migrate to Zustand (see useManagerSalesLogic.ts).
// DATA FLOW: useManagerSalesLogic → ManagerSalesContext → Sales components
'use client';

import React, { createContext, useContext } from 'react';
import type { SalesContextType, SalesInitialData } from '@/app/manager/sales/sales_types/ManagerSalesTypes';
import { useManagerSalesLogic } from '@/app/manager/sales/sales_context/useManagerSalesLogic';

const ManagerSalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children, initialData }: { children: React.ReactNode, initialData?: SalesInitialData | null }) {
 const logic = useManagerSalesLogic(initialData);

 const value = logic;

 return (
 <ManagerSalesContext.Provider value={value}>
 {children}
 </ManagerSalesContext.Provider>
 );
}

export function useSalesContext() {
 const context = useContext(ManagerSalesContext);
 if (context === undefined) {
 throw new Error('useSalesContext must be used within a SalesProvider');
 }
 return context;
}
