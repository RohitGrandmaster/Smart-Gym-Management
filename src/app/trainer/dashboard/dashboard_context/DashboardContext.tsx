// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides dashboard stats and fetch state to the entire dashboard module hierarchy via React Context.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { DashboardContextType, DashboardStats } from '@/app/trainer/dashboard/dashboard_types/dashboard_types';
import { useDashboardLogic } from '@/app/trainer/dashboard/dashboard_context/useDashboardLogic';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, initialData }: { children: React.ReactNode, initialData?: DashboardStats | null }) {
  const logic = useDashboardLogic(initialData);

  // Memoize with explicit deps to prevent unnecessary re-renders across sub-components
  const value = useMemo<DashboardContextType>(
    () => logic,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [logic.stats, logic.status, logic.error, logic.timeRange]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}

