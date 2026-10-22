// RESPONSIBILITY: Form modal for creating or editing a single exercise entry in the Workout Library module.
'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';
import { EQUIPMENT_OPTIONS, EXERCISE_DIFFICULTY_OPTIONS, ExerciseSchema, type ExerciseFormValues, EMPTY_EXERCISE_FORM } from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';

export default function ManagerWorkoutExerciseModal() {
  const { 
    showExModal, setShowExModal, 
    editExId, exForm, 
    saveEx, saving
  } = useWorkoutContext();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(ExerciseSchema),
    defaultValues: exForm || EMPTY_EXERCISE_FORM
  });

  useEffect(() => {
    if (showExModal) {
      reset(exForm);
    }
  }, [showExModal, exForm, reset]);

  if (!showExModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden border-2 border-warning">
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">
            {editExId ? 'Edit Exercise' : 'Add Exercise'}
          </h3>
          <button 
            type="button"
            onClick={() => setShowExModal(false)} 
            className="text-secondary hover:text-foreground hover:bg-primary-subtle p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit((data) => saveEx(data))} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Exercise Name *</label>
            <input 
              type="text" 
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
              } bg-input text-foreground`} 
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Primary Muscle *</label>
            <input 
              type="text" 
              placeholder="e.g. Chest, Quadriceps" 
              {...register('muscle')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.muscle ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
              } bg-input text-foreground`} 
            />
            {errors.muscle && <p className="text-danger text-xs mt-1">{errors.muscle.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Equipment</label>
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={EQUIPMENT_OPTIONS.map(eq => ({ label: eq, value: eq }))}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Difficulty</label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={EXERCISE_DIFFICULTY_OPTIONS.map(d => ({ label: d, value: d }))}
                  />
                )}
              />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowExModal(false)} 
              className="px-4 py-2 border border-border rounded-lg font-medium text-secondary hover:text-foreground hover:bg-primary-subtle transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70" 
              style={{ background: 'var(--workout-highlight)' }}
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" /> : <><Save size={15} /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
