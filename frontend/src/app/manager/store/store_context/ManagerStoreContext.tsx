// RESPONSIBILITY: Provides UI orchestration state to the Store module hierarchy. Async data is managed in useManagerStoreLogic.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { StoreContextType, StoreInitialData } from '@/app/manager/store/store_types/ManagerStoreTypes';
import { useManagerStoreLogic } from '@/app/manager/store/store_context/useManagerStoreLogic';

const ManagerStoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children, initialData }: { children: React.ReactNode, initialData?: StoreInitialData }) {
 const logic = useManagerStoreLogic(initialData);

 const {
   tab, products, orders, totalOrders, summary, fetchState, saving,
   toast, printData, search, debouncedSearch, currentPage,
   categoryFilter, stockFilter,
   showProductModal, editProductId, editProductData,
   showOrderModal, orderItems, orderMethod, orderTotal,
   customerPhone, sendViaWhatsapp,
   startDate, endDate, sortOrder
 } = logic;

 // eslint-disable-next-line react-hooks/exhaustive-deps
 const value = useMemo(() => logic, [
   tab, products, orders, totalOrders, summary, fetchState, saving,
   toast, printData, search, debouncedSearch, currentPage,
   categoryFilter, stockFilter,
   showProductModal, editProductId, editProductData,
   showOrderModal, orderItems, orderMethod, orderTotal,
   customerPhone, sendViaWhatsapp,
   startDate, endDate, sortOrder
 ]);

 return (
 <ManagerStoreContext.Provider value={value}>
 {children}
 </ManagerStoreContext.Provider>
 );
}

export function useStoreContext() {
 const context = useContext(ManagerStoreContext);
 if (context === undefined) {
 throw new Error('useStoreContext must be used within a StoreProvider');
 }
 return context;
}
