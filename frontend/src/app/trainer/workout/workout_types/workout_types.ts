// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Defines all TypeScript types, interfaces, and the FetchState enum for the Workout Library module.
import { EMPTY_WORKOUT_FORM, EMPTY_EXERCISE_FORM } from '@/app/trainer/workout/workout_utils/WorkoutSharedConstants';
import React from 'react';
import type { FetchState } from '@/app/trainer/trainer_types/trainer_types';

import type { Exercise, Workout } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';

export interface WorkoutContextType {
 tab: string;
 setTab: (tab: string) => void;
 search: string;
 setSearch: (s: string) => void;
 filterCategory: string;
 setFilterCategory: (c: string) => void;
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



