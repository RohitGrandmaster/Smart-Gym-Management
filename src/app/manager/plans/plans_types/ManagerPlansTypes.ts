// RESPONSIBILITY: Defines all TypeScript types and interfaces for the Plans module. Single source of truth for plan data shapes.

import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import type { PlanFormValues } from '@/app/manager/plans/plans_utils/ManagerPlansSharedConstants';
import React from 'react';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface PlansInitialData {
  plans: Plan[];
}

export interface PlansContextType {
  plans: Plan[];
  fetchState: FetchState;
  saving: boolean;
  toast: { message: string; type: ToastType } | null;

  search: string;
  setSearch: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;

  showModal: boolean;
  setShowModal: (show: boolean) => void;
  editId: string | null;
  form: PlanFormValues;
  setForm: React.Dispatch<React.SetStateAction<PlanFormValues>>;

  showToast: (msg: string, t: ToastType) => void;
  hideToast: () => void;

  loadPlans: () => Promise<void>;
  openAdd: () => void;
  openEdit: (p: Plan) => void;
  savePlan: (data: PlanFormValues) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export interface Plan {
  id: string; name: string; tier: string;
  price1Month: number; price3Month: number;
  price6Month: number; price12Month: number;
  features: string[]; isActive: boolean;
}
