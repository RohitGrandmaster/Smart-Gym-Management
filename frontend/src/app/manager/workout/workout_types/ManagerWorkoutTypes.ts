// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Workout Library module.
import { EMPTY_WORKOUT_FORM, EMPTY_EXERCISE_FORM } from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';
import React from 'react';

import type { Exercise } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface WorkoutContextType {
 tab: string;
 setTab: (tab: string) => void;
 search: string;
 setSearch: (s: string) => void;
 levelFilter: string;
 setLevelFilter: (s: string) => void;
 currentPage: number;
 setCurrentPage: (p: number) => void;
 
 workouts: Workout[];
 totalWorkouts: number;
 exercises: Exercise[];
 totalExercises: number;
 
 fetchState: FetchState;
 saving: boolean;
 toast: { message: string; type: ToastType } | null;
 showToast: (msg: string, type: ToastType) => void;
 hideToast: () => void;
 loadAll: () => Promise<void>;

 showWkModal: boolean;
 setShowWkModal: (show: boolean) => void;
 editWkId: string | null;
 wkForm: typeof EMPTY_WORKOUT_FORM;
 setWkForm: React.Dispatch<React.SetStateAction<typeof EMPTY_WORKOUT_FORM>>;
 
 showExModal: boolean;
 setShowExModal: (show: boolean) => void;
 editExId: string | null;
 exForm: typeof EMPTY_EXERCISE_FORM;
 setExForm: React.Dispatch<React.SetStateAction<typeof EMPTY_EXERCISE_FORM>>;
 
 openAddWk: () => void;
 openEditWk: (w: Workout) => void;
 saveWk: (data: typeof EMPTY_WORKOUT_FORM) => void;
 deleteWk: (id: string) => void;
 
 openAddEx: () => void;
 openEditEx: (ex: Exercise) => void;
 saveEx: (data: typeof EMPTY_EXERCISE_FORM) => void;
 deleteEx: (id: string) => void;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number | string;
}

export interface WorkoutDay {
  day: number;
  focus: string;
  isRest: boolean;
  exercises?: WorkoutExercise[];
}

export interface Workout {
  id: string; name: string; level: string; days: number | WorkoutDay[];
  exercises: number; focus: string; duration: string; tags: string[]; isActive?: boolean;
}
