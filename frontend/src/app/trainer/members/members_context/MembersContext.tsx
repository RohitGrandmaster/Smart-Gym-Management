// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides UI orchestration state to the members module hierarchy. Async data is in Zustand.
// DATA FLOW: useMembersLogic -> MembersContext -> Members components
'use client';

import React, { createContext, useContext } from 'react';
import type { MembersContextType, MembersInitialData } from '@/app/trainer/members/members_types/members_types';
import { useMembersLogic } from '@/app/trainer/members/members_context/useMembersLogic';

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children, initialData }: { children: React.ReactNode, initialData?: MembersInitialData | null }) {
  const logic = useMembersLogic(initialData);

  // No useMemo needed — Context only holds lightweight sync UI state.
  // Async data (members, plans, etc.) is in Zustand and accessed directly by components.
  return (
    <MembersContext.Provider value={logic}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembersContext() {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembersContext must be used within a MembersProvider');
  }
  return context;
}

