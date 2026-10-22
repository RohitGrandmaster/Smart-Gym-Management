// RESPONSIBILITY: Renders the grid of workout plan cards with exercises count and action buttons.
'use client';

import { Dumbbell, Edit2, Trash2 } from 'lucide-react';
import { useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';

import ManagerPagination from '@/app/manager/manager_components/ManagerShared/ManagerPagination';
import { MANAGER_ITEMS_PER_PAGE } from '@/app/manager/manager_utils/ManagerSharedConstants';

export default function ManagerWorkoutPlansGrid() {
  const { workouts, totalWorkouts, search, currentPage, setCurrentPage, openEditWk, deleteWk } = useWorkoutContext();
  const { confirm } = useConfirm();
  
  const totalPages = Math.ceil(totalWorkouts / MANAGER_ITEMS_PER_PAGE) || 1;

  return (
    <div className="flex flex-col h-full min-h-96">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 content-start">
        {workouts.map(w => (
          <div 
            key={w.id} 
            className="border border-border rounded-xl p-4 hover:border-info dark:hover:border-info hover:shadow-sm transition-all bg-card"
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
                <button 
                  onClick={() => openEditWk(w)} 
                  className="p-1.5 text-info hover:text-info hover:bg-info-bg dark:hover:bg-info-bg rounded-lg transition-colors"
                >
                  <Edit2 size={13} />
                </button>
                <button 
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'Delete Workout Plan',
                      message: `Are you sure you want to delete workout plan "${w.name}"?`,
                      type: 'danger',
                      confirmText: 'Delete'
                    });
                    if (ok) {
                      deleteWk(w.id);
                    }
                  }}
                  className="p-1.5 text-danger hover:text-danger hover:bg-danger-bg dark:hover:bg-danger-bg rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
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
                  <p className="text-sm font-bold text-foreground">{Array.isArray(s.v) ? s.v.length : s.v}</p>
                  <p className="text-xs text-secondary">{s.l}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {w.tags?.map((tag: string) => (
                <span key={tag} className="text-xs bg-input text-secondary px-2 py-0.5 rounded-full">
                  {tag}
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
        <ManagerPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          totalItems={totalWorkouts} 
          itemsPerPage={MANAGER_ITEMS_PER_PAGE} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
