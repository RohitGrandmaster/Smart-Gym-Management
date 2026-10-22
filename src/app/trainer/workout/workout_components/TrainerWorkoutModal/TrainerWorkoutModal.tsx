// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Form modal for creating or editing a workout plan in the Workout Library module.
'use client';

import { useEffect } from 'react';
import { X, Save, Plus, Trash2, Dumbbell } from 'lucide-react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useWorkoutContext } from '@/app/trainer/workout/workout_context/WorkoutContext';
import { WORKOUT_LEVEL_OPTIONS, WorkoutSchema, type WorkoutFormValues, EMPTY_WORKOUT_FORM, INITIAL_EXERCISES } from '@/app/trainer/workout/workout_utils/WorkoutSharedConstants';

export default function TrainerWorkoutModal() {
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
    resolver: zodResolver(WorkoutSchema) as any,
    defaultValues: wkForm || EMPTY_WORKOUT_FORM
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: 'workoutExercises'
  });

  useEffect(() => {
    if (showWkModal) {
      reset(wkForm);
    }
  }, [showWkModal, wkForm, reset]);

  if (!showWkModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">
            {editWkId ? 'Edit Workout Plan' : 'Add Workout Plan'}
          </h3>
          <button 
            type="button"
            onClick={() => setShowWkModal(false)} 
            className="text-secondary hover:text-foreground hover:bg-primary-subtle p-1 rounded-md motion-safe:transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(saveWk as any)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Plan Name *</label>
            <input 
              type="text" 
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
                errors.name ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-warning'
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
                min="1" 
                max="7" 
                {...register('days', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
                  errors.days ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-warning'
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
                className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
                  errors.focus ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-warning'
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
                className={`w-full px-3 py-2 border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page ${
                  errors.duration ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:ring-warning'
                } bg-input text-foreground`} 
              />
              {errors.duration && <p className="text-danger text-xs mt-1">{errors.duration.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Goal</label>
              <input 
                type="text" 
                placeholder="e.g. Weight Loss" 
                {...register('goal')}
                className="w-full px-3 py-2 border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Assigned To (Member ID)</label>
              <input 
                type="text" 
                placeholder="Leave blank for global plan" 
                {...register('assignedMemberId')}
                className="w-full px-3 py-2 border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Start Date</label>
              <input 
                type="date" 
                {...register('startDate')}
                className="w-full px-3 py-2 border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">End Date</label>
              <input 
                type="date" 
                {...register('endDate')}
                className="w-full px-3 py-2 border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Instructions / Notes</label>
            <textarea 
              rows={2}
              placeholder="e.g. Warm up properly before starting..." 
              {...register('instructions')}
              className="w-full px-3 py-2 border border-border rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page focus-visible:ring-warning bg-input text-foreground custom-scrollbar" 
            />
          </div>

          <div className="pt-2 border-t border-border mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-foreground">Workout Exercises</label>
              <button
                type="button"
                onClick={() => appendExercise({ name: '', sets: 3, reps: '10', weight: '', restTime: '60s' })}
                className="text-xs font-semibold text-primary bg-primary-subtle px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-primary/20 motion-safe:transition-colors"
              >
                <Plus size={14} /> Add Exercise
              </button>
            </div>
            
            <div className="space-y-3">
              {exerciseFields.map((field, index) => (
                <div key={field.id} className="bg-input/50 border border-border rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-secondary mb-1">Exercise</label>
                    <select
                      {...register(`workoutExercises.${index}.name`)}
                      className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                    >
                      <option value="">Select from library...</option>
                      {(INITIAL_EXERCISES as any[]).map(ex => (
                        <option key={ex.id} value={ex.name}>{ex.name} ({ex.muscle})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-16">
                    <label className="block text-[10px] uppercase font-bold text-secondary mb-1">Sets</label>
                    <input
                      type="number"
                      {...register(`workoutExercises.${index}.sets`)}
                      className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                    />
                  </div>
                  <div className="w-16">
                    <label className="block text-[10px] uppercase font-bold text-secondary mb-1">Reps</label>
                    <input
                      type="number"
                      {...register(`workoutExercises.${index}.reps`)}
                      className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                    />
                  </div>
                  <div className="flex-1 sm:w-24">
                    <label className="block text-[10px] uppercase font-bold text-secondary mb-1">Weight</label>
                    <input
                      type="text"
                      placeholder="e.g. 60kg"
                      {...register(`workoutExercises.${index}.weight`)}
                      className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                    />
                  </div>
                  <div className="flex-1 sm:w-24">
                    <label className="block text-[10px] uppercase font-bold text-secondary mb-1">Rest</label>
                    <input
                      type="text"
                      placeholder="e.g. 90s"
                      {...register(`workoutExercises.${index}.restTime`)}
                      className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                    />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-2 text-danger hover:bg-danger-bg rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {exerciseFields.length === 0 && (
                <div className="text-center py-6 border border-dashed border-border rounded-xl text-secondary text-sm">
                  <Dumbbell size={24} className="mx-auto mb-2 opacity-50" />
                  No exercises added. Click "Add Exercise" to build the plan.
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowWkModal(false)} 
              className="px-4 py-2 border border-border rounded-lg font-medium text-secondary hover:text-foreground hover:bg-primary-subtle motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 hover:opacity-90 motion-safe:transition-opacity disabled:opacity-70" 
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

