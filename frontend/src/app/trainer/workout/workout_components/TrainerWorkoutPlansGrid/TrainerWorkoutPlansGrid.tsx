// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the grid of workout plan cards with exercises count and action buttons.
'use client';

import { Dumbbell } from 'lucide-react';
import { useWorkoutContext } from '@/app/trainer/workout/workout_context/WorkoutContext';

import TrainerPagination from '@/app/trainer/trainer_components/TrainerShared/TrainerPagination';
import { TRAINER_ITEMS_PER_PAGE } from '@/app/trainer/trainer_utils/TrainerSharedConstants';

export default function TrainerWorkoutPlansGrid() {
  const { workouts, totalWorkouts, currentPage, setCurrentPage, fetchState, search } = useWorkoutContext();

  const totalPages = Math.ceil(totalWorkouts / TRAINER_ITEMS_PER_PAGE) || 1;

  if (fetchState === 'loading') {
    return (
      <div className="flex justify-center py-10">
        <div className="motion-safe:animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchState === 'error') {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-danger/30">
        <p className="text-danger font-medium">Failed to load workout plans.</p>
        <p className="text-sm mt-1 text-secondary">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-96">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 content-start">
        {workouts.map(w => (
          <div 
            key={w.id} 
            className="border border-border rounded-xl p-4 hover:border-info dark:hover:border-info hover:shadow-sm motion-safe:transition-all bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-info-bg dark:bg-info-bg rounded-xl flex items-center justify-center">
                <Dumbbell size={17} className="text-info dark:text-info" />
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  w.level === 'Beginner' 
                    ? 'bg-success-bg text-success dark:bg-success-bg dark:text-success' 
                    : w.level === 'Intermediate' 
                    ? 'bg-warning-bg text-warning dark:bg-warning-bg dark:text-warning' 
                    : 'bg-danger-bg text-danger dark:bg-danger-bg dark:text-danger'
                }`}>
                  {w.level}
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-foreground mb-3">{w.name}</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { l: 'Days', v: w.days }, 
                { l: 'Exercises', v: w.exercises }, 
                { l: 'Duration', v: w.duration }
              ].map(s => (
                <div key={s.l} className="bg-input rounded-lg p-2 text-center border border-border">
                  <p className="text-sm font-bold text-foreground">{s.v}</p>
                  <p className="text-xs text-secondary">{s.l}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {(Array.isArray(w.tags) ? w.tags : (typeof w.tags === 'string' ? (w.tags as string).split(',').filter(Boolean) : [])).map((tag: string) => (
                <span key={tag.trim()} className="text-xs bg-input text-secondary px-2 py-0.5 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
            
            <p className="text-xs text-secondary">
              Focus: <span className="font-medium text-foreground">{w.focus}</span>
            </p>
          </div>
        ))}
        {workouts.length === 0 && (
          <div className="col-span-full text-center py-10 text-secondary">
            No workout plans found matching &quot;{search}&quot;.
          </div>
        )}
      </div>
      <div className="mt-6">
        <TrainerPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={totalWorkouts} 
          itemsPerPage={TRAINER_ITEMS_PER_PAGE} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}

