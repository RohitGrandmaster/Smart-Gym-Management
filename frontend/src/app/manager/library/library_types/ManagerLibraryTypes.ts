// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Diet Library module.
import type { } from '@/lib/api';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { EMPTY_DIET_FORM } from '@/app/manager/library/library_utils/ManagerLibrarySharedConstants';

export interface LibraryInitialData {

  dietPlans: DietPlan[];
}

 export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface LibraryContextType {

 dietPlans: DietPlan[];
 fetchState: FetchState;
 saving: boolean;
  toast: { message: string; type: ToastType } | null;
  
  search: string;
  debouncedSearch: string;
  setSearch: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  
  showToast: (msg: string, t: ToastType) => void;
 hideToast: () => void;
 
 loadAll: () => Promise<void>;
 
 
 // Diet Modal State
 showDietModal: boolean;
 setShowDietModal: (show: boolean) => void;
 editDietId: string | null;
 editDietData: DietPlan | null;
 openAddDiet: () => void;
 openEditDiet: (d: DietPlan) => void;
 saveDietPlan: (data: Partial<DietPlan>) => Promise<void>;
 deleteDietPlan: (id: string) => Promise<void>;
}


export interface DietMeal {
  time?: string;
  name?: string;
  calories?: number;
  foods?: string[];
}

export interface DietPlan {
  id: string; name: string; goal: string;
  calories?: number; protein?: number; carbs?: number; fats?: number;
  description?: string; meals: (string | DietMeal)[]; isActive: boolean;
}

export interface Exercise {
  id: string; name: string; category: string; muscleGroup?: string[];
  sets?: number; reps?: number; duration?: number; difficulty: string;
  description?: string; videoUrl?: string; isActive: boolean;
}
