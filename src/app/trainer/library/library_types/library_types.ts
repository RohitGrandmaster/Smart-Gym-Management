// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Diet Library module.
import type { DietPlan, FetchState } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import { type DietFormValues } from '@/app/trainer/library/library_utils/LibrarySharedConstants';
import React from 'react';

export interface LibraryInitialData {
  dietPlans: DietPlan[];
}

export interface LibraryContextType {
  dietPlans: DietPlan[];
  fetchState: FetchState;
  saving: boolean;
  toast: { message: string; type: ToastType } | null;
  
  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  filterGoal: string;
  setFilterGoal: (g: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;

  showToast: (msg: string, type: ToastType) => void;
  hideToast: () => void;
  loadAll: () => Promise<void>;

  // Diet Modal State
  showDietModal: boolean;
  editDietId: string | null;
  editDietData: DietFormValues | null;
  openAddDiet: () => void;
  openEditDiet: (d: DietPlan) => void;
  closeDietModal: () => void;
  saveDietPlan: (data: DietFormValues) => Promise<void>;
  deleteDietPlan: (id: string) => Promise<void>;
}
