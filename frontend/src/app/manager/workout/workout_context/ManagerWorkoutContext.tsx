// RESPONSIBILITY: Provides UI orchestration state to the Workout Library module hierarchy. Async data is managed in useManagerWorkoutLogic.
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { WorkoutContextType } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';
import { useManagerWorkoutLogic } from '@/app/manager/workout/workout_context/useManagerWorkoutLogic';

const ManagerWorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
 const logic = useManagerWorkoutLogic();
 const {
    tab, search, levelFilter, currentPage, fetchState, saving, toast,
    workouts, totalWorkouts, exercises, totalExercises
 } = logic;

 const value = useMemo(() => logic, [
    tab, search, levelFilter, currentPage, fetchState, saving, toast,
    workouts, totalWorkouts, exercises, totalExercises
 ]);

 return (
 <ManagerWorkoutContext.Provider value={value}>
 {children}
 </ManagerWorkoutContext.Provider>
 );
}

export function useWorkoutContext() {
 const context = useContext(ManagerWorkoutContext);
 if (context === undefined) {
 throw new Error('useWorkoutContext must be used within a WorkoutProvider');
 }
 return context;
}
