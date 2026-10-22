// RESPONSIBILITY: Provides the Context wrapper for the Members module.
// DATA FLOW: useManagerMembersLogic -> ManagerMembersContext -> Members components
'use client';

import React, { createContext, useContext } from 'react';
import type { MembersContextType, MembersInitialData } from '@/app/manager/members/members_types/ManagerMembersTypes';
import { useManagerMembersLogic } from '@/app/manager/members/members_context/useManagerMembersLogic';

const ManagerMembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children, initialData }: { children: React.ReactNode, initialData?: MembersInitialData | null }) {
  const { 
    search, debouncedSearch, setSearch, statusFilter, setStatusFilter, currentPage, setCurrentPage,
    toast, showToast, hideToast, selectedMember, setSelectedMember, profileTab, setProfileTab, trainers,
    showAddModal, setShowAddModal, editId, editData, showRenewModal, setShowRenewModal,
    showPaymentModal, setShowPaymentModal,
    openAdd, openEdit, saveMember, deleteMember, assignDiet, assignWorkout, renewMember, recordPayment, freezeMember, toggleSuspend, assignTrainer,
    msgModal, openMsg, closeMsg, printData, handlePrint, handleSharePaymentWhatsApp, setPrintData
  } = useManagerMembersLogic(initialData);

  const value = React.useMemo(() => ({
    search, debouncedSearch, setSearch, statusFilter, setStatusFilter, currentPage, setCurrentPage,
    toast, showToast, hideToast, selectedMember, setSelectedMember, profileTab, setProfileTab, trainers,
    showAddModal, setShowAddModal, editId, editData, showRenewModal, setShowRenewModal,
    showPaymentModal, setShowPaymentModal,
    openAdd, openEdit, saveMember, deleteMember, assignDiet, assignWorkout, renewMember, recordPayment, freezeMember, toggleSuspend, assignTrainer,
    msgModal, openMsg, closeMsg, printData, handlePrint, handleSharePaymentWhatsApp, setPrintData
  }), [search, debouncedSearch, statusFilter, currentPage, toast, selectedMember, profileTab, trainers, showAddModal, editId, editData, showRenewModal, showPaymentModal, msgModal, printData]);

  return (
    <ManagerMembersContext.Provider value={value}>
      {children}
    </ManagerMembersContext.Provider>
  );
}

export function useMembersContext() {
  const context = useContext(ManagerMembersContext);
  if (context === undefined) {
    throw new Error('useMembersContext must be used within a MembersProvider');
  }
  return context;
}
