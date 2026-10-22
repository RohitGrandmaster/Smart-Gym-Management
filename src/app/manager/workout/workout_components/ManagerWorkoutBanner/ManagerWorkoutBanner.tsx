// RESPONSIBILITY: Renders the top banner/hero section with module title and CTA for the Workout Library.
'use client';

import { Dumbbell } from 'lucide-react';
import { useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';

export default function ManagerWorkoutBanner() {
 const { workouts, exercises } = useWorkoutContext();

 return (
 <div className="rounded-xl p-5 text-white shadow-lg shadow-info/20" style={{ background: 'linear-gradient(135deg, var(--workout-banner-gradient-start), var(--workout-banner-gradient-end))' }}>
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-xl font-bold">Complete Workout Database</h2>
 <p className="text-white/80 mt-1 text-sm font-medium">
 {workouts.length} workout programs · {exercises.length} exercises
 </p>
 </div>
 <Dumbbell size={56} className="text-info/40 transform -rotate-12" />
 </div>
 </div>
 );
}
