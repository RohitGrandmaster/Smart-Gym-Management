// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Entry component for the Workout Library module. Wraps the UI in the context provider and handles page layout.
'use client';

import TrainerHeader from '@/app/trainer/trainer_components/TrainerLayout/TrainerHeader';
import { WorkoutProvider, useWorkoutContext } from '@/app/trainer/workout/workout_context/WorkoutContext';
import TrainerWorkoutBanner from '@/app/trainer/workout/workout_components/TrainerWorkoutBanner/TrainerWorkoutBanner';
import TrainerWorkoutToolbar from '@/app/trainer/workout/workout_components/TrainerWorkoutToolbar/TrainerWorkoutToolbar';
import TrainerWorkoutPlansGrid from '@/app/trainer/workout/workout_components/TrainerWorkoutPlansGrid/TrainerWorkoutPlansGrid';
import TrainerWorkoutExerciseTable from '@/app/trainer/workout/workout_components/TrainerWorkoutExerciseTable/TrainerWorkoutExerciseTable';


function WorkoutContent() {
 const { tab } = useWorkoutContext();

 return (
 <div className="min-h-full pb-10 workout-module bg-background text-foreground">
 <TrainerHeader title="Workout Library" subtitle="Comprehensive exercise and workout plan database" />
 
 <div className="p-6 space-y-5">
 <TrainerWorkoutBanner />

 <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
 <TrainerWorkoutToolbar />

 <div className="p-5">
 {tab === 'Workout Plans' ? <TrainerWorkoutPlansGrid /> : <TrainerWorkoutExerciseTable />}
 </div>
 </div>
 </div>

 </div>
 );
}

export default function TrainerWorkoutMain() {
 return (
 <WorkoutProvider>
 <WorkoutContent />
 </WorkoutProvider>
 );
}

