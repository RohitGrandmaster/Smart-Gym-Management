// RESPONSIBILITY: React Context — bridges Zustand plans store with UI state (search, filters, change-request modal).
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useManagerPlansStore } from '@/app/manager/plans/plans_store/useManagerPlansStore';
import toast from 'react-hot-toast';
import type { Plan } from '@/app/manager/plans/plans_types/ManagerPlansTypes';

interface PlansContextValue {
  plans: Plan[];
  fetchState: ReturnType<typeof useManagerPlansStore.getState>['fetchState'];
  saving: boolean;
  search: string;
  setSearch: (v: string) => void;
  tierFilter: string;
  setTierFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  filteredPlans: Plan[];
  // Change-request modal
  requestModalPlan: Plan | null;
  openRequestModal: (plan: Plan) => void;
  closeRequestModal: () => void;
  submitChangeRequest: (note: string) => Promise<void>;
}

const ManagerPlansContext = createContext<PlansContextValue | undefined>(undefined);

export function PlansProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [requestModalPlan, setRequestModalPlan] = useState<Plan | null>(null);

  const { plans, fetchState, saving, loadPlans, requestPlanChange } = useManagerPlansStore();

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const filteredPlans = plans.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.name?.toLowerCase().includes(q) || p.tier?.toLowerCase().includes(q);
    const matchTier = tierFilter === 'ALL' || p.tier === tierFilter;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? p.isActive : !p.isActive);
    return matchSearch && matchTier && matchStatus;
  });

  const openRequestModal = useCallback((plan: Plan) => setRequestModalPlan(plan), []);
  const closeRequestModal = useCallback(() => setRequestModalPlan(null), []);

  const submitChangeRequest = useCallback(async (note: string) => {
    if (!requestModalPlan) return;
    try {
      await requestPlanChange(requestModalPlan.id, note);
      toast.success('Change request sent to admin.');
      setRequestModalPlan(null);
    } catch {
      toast.error('Failed to send request. Try again.');
    }
  }, [requestModalPlan, requestPlanChange]);

  return (
    <ManagerPlansContext.Provider value={{
      plans, fetchState, saving,
      search, setSearch,
      tierFilter, setTierFilter,
      statusFilter, setStatusFilter,
      filteredPlans,
      requestModalPlan, openRequestModal, closeRequestModal, submitChangeRequest,
    }}>
      {children}
    </ManagerPlansContext.Provider>
  );
}

export function usePlansContext() {
  const ctx = useContext(ManagerPlansContext);
  if (!ctx) throw new Error('usePlansContext must be used within PlansProvider');
  return ctx;
}
