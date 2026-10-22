// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Provides UI orchestration state to the Workout Library module hierarchy. Async data is managed in useWorkoutLogic.
'use client';

import React, { createContext, useContext } from 'react';
import type { WorkoutContextType } from '@/app/trainer/workout/workout_types/workout_types';
import { useWorkoutLogic } from '@/app/trainer/workout/workout_context/useWorkoutLogic';

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
 const logic = useWorkoutLogic();

 return (
 <WorkoutContext.Provider value={logic}>
 {children}
 </WorkoutContext.Provider>
 );
}

export function useWorkoutContext() {
 const context = useContext(WorkoutContext);
 if (context === undefined) {
 throw new Error('useWorkoutContext must be used within a WorkoutProvider');
 }
 return context;
}

