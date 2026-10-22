// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Renders the diet plan cards grid with macronutrient info and action buttons.
'use client';

import { useLibraryContext } from '@/app/trainer/library/library_context/LibraryContext';
import TrainerPagination from '@/app/trainer/trainer_components/TrainerShared/TrainerPagination';
import { Apple, Edit2, Trash2, Flame, Loader2 } from 'lucide-react';
import { TRAINER_ITEMS_PER_PAGE } from '@/app/trainer/trainer_utils/TrainerSharedConstants';
import { useConfirm } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerConfirmProvider';

export default function TrainerLibraryDietGrid() {
  const { dietPlans, fetchState, debouncedSearch, currentPage, setCurrentPage, openEditDiet, deleteDietPlan } = useLibraryContext();
  const { confirm } = useConfirm();

  const filtered = dietPlans.filter(d => {
    const s = debouncedSearch.toLowerCase();
    return d.name?.toLowerCase().includes(s) || d.goal?.toLowerCase().includes(s);
  });

  const totalPages = Math.ceil(filtered.length / TRAINER_ITEMS_PER_PAGE);
  const currentData = filtered.slice((currentPage - 1) * TRAINER_ITEMS_PER_PAGE, currentPage * TRAINER_ITEMS_PER_PAGE);

  if (fetchState === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 motion-safe:animate-pulse h-48 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted shrink-0"></div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-muted"></div>
                <div className="w-8 h-8 rounded bg-muted"></div>
              </div>
            </div>
            <div className="w-3/4 h-5 rounded bg-muted mb-2"></div>
            <div className="w-1/2 h-4 rounded bg-muted mb-4"></div>
            <div className="mt-auto pt-3 border-t border-border space-y-2">
              <div className="w-1/3 h-4 rounded bg-muted"></div>
              <div className="w-2/3 h-4 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
        {currentData.map(dp => (
          <div 
            key={dp.id} 
            className="rounded-xl border border-border bg-card p-5 hover:shadow-md motion-safe:transition-shadow flex flex-col cursor-pointer"
            onClick={() => openEditDiet(dp)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-success/10 text-success shrink-0">
                <Apple size={20} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditDiet(dp); }}
                  className="p-1.5 rounded hover:bg-primary/10 motion-safe:transition-colors text-secondary hover:text-primary"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={async (e) => { 
                    e.stopPropagation(); 
                    const ok = await confirm({
                      title: 'Delete Diet Plan',
                      message: `Are you sure you want to delete diet plan "${dp.name}"?`,
                      type: 'danger',
                      confirmText: 'Delete'
                    });
                    if (ok) {
                      deleteDietPlan(dp.id); 
                    }
                  }}
                  className="p-1.5 rounded motion-safe:transition-colors text-danger hover:bg-danger/10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h4 className="font-bold text-foreground line-clamp-1 mb-1">{dp.name}</h4>
            <p className="text-xs text-secondary mb-3">{dp.goal}</p>
            
            <div className="mt-auto pt-3 border-t border-border space-y-1">
              {dp.calories && (
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <Flame size={14} className="text-warning" />
                  <span>{dp.calories} kcal/day</span>
                </div>
              )}
              {dp.protein && (
                <p className="text-xs text-secondary">🥩 Protein: {dp.protein}g · Carbs: {dp.carbs}g · Fats: {dp.fats}g</p>
              )}
            </div>
          </div>
        ))}
        {currentData.length === 0 && (
          <div className="col-span-full py-10 text-center text-secondary text-sm">
            No diet plans found.
          </div>
        )}
      </div>

      <div className="mt-6">
          <TrainerPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={filtered.length} 
            itemsPerPage={TRAINER_ITEMS_PER_PAGE} 
            onPageChange={setCurrentPage} 
          />
        </div>
    </div>
  );
}
