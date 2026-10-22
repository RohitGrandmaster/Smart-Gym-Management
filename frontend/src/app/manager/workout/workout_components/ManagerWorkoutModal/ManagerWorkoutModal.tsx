// RESPONSIBILITY: Form modal for creating or editing a workout plan in the Workout Library module.
'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useWorkoutContext } from '@/app/manager/workout/workout_context/ManagerWorkoutContext';
import { WorkoutSchema, type WorkoutFormValues, EMPTY_WORKOUT_FORM } from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';

export default function ManagerWorkoutModal() {
  const { 
    showWkModal, setShowWkModal, 
    editWkId, wkForm, 
    saveWk, saving 
  } = useWorkoutContext();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: wkForm || EMPTY_WORKOUT_FORM
  });

  useEffect(() => {
    if (showWkModal) {
      reset(wkForm);
    }
  }, [showWkModal, wkForm, reset]);

  if (!showWkModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden border-2 border-warning">
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">
            {editWkId ? 'Edit Workout Plan' : 'Add Workout Plan'}
          </h3>
          <button 
            type="button"
            onClick={() => setShowWkModal(false)} 
            className="text-secondary hover:text-foreground hover:bg-primary-subtle p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit((data) => saveWk(data))} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Plan Name *</label>
            <input 
              type="text" 
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
              } bg-input text-foreground`} 
            />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-secondary mb-1">Level</label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={['Beginner', 'Intermediate', 'Advanced'].map(l => ({ label: l, value: l }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Level..."
                />
              )}
            />
          </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Days per week</label>
              <input 
                type="number"
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                min="1" 
                max="7" 
                {...register('days', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.days ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
                } bg-input text-foreground`} 
              />
              {errors.days && <p className="text-danger text-xs mt-1">{errors.days.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Focus Area</label>
              <input 
                type="text" 
                placeholder="e.g. Hypertrophy" 
                {...register('focus')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.focus ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
                } bg-input text-foreground`} 
              />
              {errors.focus && <p className="text-danger text-xs mt-1">{errors.focus.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 60 min" 
                {...register('duration')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.duration ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
                } bg-input text-foreground`} 
              />
              {errors.duration && <p className="text-danger text-xs mt-1">{errors.duration.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">No. of Exercises</label>
              <input 
                type="number"
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                min="1" 
                {...register('exercises', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.exercises ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-warning'
                } bg-input text-foreground`} 
              />
              {errors.exercises && <p className="text-danger text-xs mt-1">{errors.exercises.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. PPL, Classic" 
                {...register('tags')}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-warning bg-input text-foreground" 
              />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowWkModal(false)} 
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
