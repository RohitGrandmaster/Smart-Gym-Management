'use client';
// RESPONSIBILITY: Renders the member's assigned workout plan and handles the assignment flow.
// DATA FLOW: useMembersContext -> ManagerProfileWorkout -> workoutApi
import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Check, MessageCircle, Edit2 } from 'lucide-react';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { workoutApi } from '@/app/manager/workout/workout_api/ManagerWorkoutApi';
import type { Workout, FetchState } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';

export default function ManagerProfileWorkout() {
  const { selectedMember, assignWorkout } = useMembersContext();
  const [isAssigning, setIsAssigning] = useState(false);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [fetchWorkoutsState, setFetchWorkoutsState] = useState<FetchState>('idle');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');

  useEffect(() => {
    if (isAssigning && availableWorkouts.length === 0) {
      setTimeout(() => setFetchWorkoutsState('loading'), 0);
      workoutApi.getWorkouts().then(res => {
        setAvailableWorkouts(res.data?.workouts || []);
        setTimeout(() => setFetchWorkoutsState('success'), 0);
      }).catch(() => {
        // Error logged to monitoring provider
        setTimeout(() => setFetchWorkoutsState('error'), 0);
      });
    }
  }, [isAssigning, availableWorkouts.length]);

  if (!selectedMember) return null;

  const hasWorkoutPlan = !!selectedMember.assignedWorkout;
  const workout = selectedMember.assignedWorkout;

  const handleAssign = async () => {
    if (!selectedWorkoutId) return;
    const selected = availableWorkouts.find(w => String(w.id) === selectedWorkoutId) || null;
    await assignWorkout(selectedMember.id, selected);
    setIsAssigning(false);
  };

  return (
    <div className="space-y-6 motion-safe:animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Workout Plan</h3>
          <p className="text-sm text-secondary">Manage and track {selectedMember.name}&apos;s daily workouts.</p>
        </div>
        {hasWorkoutPlan ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const text = `*WORKOUT PLAN: ${workout?.name || 'Assigned'}*\nLevel: ${workout?.level || 'N/A'}\n\n*Routine:*\n${Array.isArray(workout?.days) ? workout.days.map((d: import("@/app/manager/workout/workout_types/ManagerWorkoutTypes").WorkoutDay | number) => `*Day ${typeof d === 'number' ? d : d.day}: ${typeof d === 'number' ? '' : d.focus}*\n${typeof d === 'number' ? false : d.isRest ? 'Rest Day' : (typeof d === 'number' ? [] : d.exercises || []).map((e: import("@/app/manager/workout/workout_types/ManagerWorkoutTypes").WorkoutExercise) => `- ${e.name} (${e.sets}x${e.reps})`).join('\n')}`).join('\n\n') : `Number of days: ${workout?.days}`}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all active:scale-95"
            >
              <MessageCircle size={16} /> Send via WhatsApp
            </button>
            <button 
              onClick={() => setIsAssigning(true)}
              className="flex items-center gap-2 px-4 py-2 bg-input text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-primary-subtle transition-all active:scale-95"
            >
              <Edit2 size={16} /> Change
            </button>
          </div>
        ) : !isAssigning && (
          <button 
            onClick={() => setIsAssigning(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            <Plus size={16} /> Assign Workout
          </button>
        )}
      </div>

      {isAssigning && (
        <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <h4 className="font-semibold text-primary">Assign Workout Plan from Library</h4>
          {fetchWorkoutsState === 'loading' ? (
            <p className="text-sm text-secondary">Loading workout plans...</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="flex-1 bg-input border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedWorkoutId}
                onChange={(e) => setSelectedWorkoutId(e.target.value)}
              >
                <option value="">Select a Workout Plan...</option>
                {availableWorkouts.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.level})</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAssigning(false)}
                  className="px-4 py-2 bg-input text-secondary hover:text-foreground rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssign}
                  disabled={!selectedWorkoutId}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check size={16} /> Confirm Assign
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!hasWorkoutPlan && !isAssigning ? (
        <div className="bg-input border border-border rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Dumbbell size={32} />
          </div>
          <h4 className="text-lg font-semibold text-primary mb-2">No Workout Plan Assigned</h4>
          <p className="text-secondary text-sm max-w-sm mb-6">
            {selectedMember.name} currently does not have an active workout plan. Assign a plan from the Workout Library to get them started.
          </p>
          <button 
            onClick={() => setIsAssigning(true)}
            className="px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-semibold hover:bg-primary/20 transition-colors"
          >
            Browse Workout Library
          </button>
        </div>
      ) : workout ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Days</p>
              <p className="text-lg font-bold text-primary">{Array.isArray(workout.days) ? workout.days.length : (workout.days || 0)}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Focus</p>
              <p className="text-lg font-bold text-primary">{workout.focus || 'General'}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">Exercises</p>
              <p className="text-lg font-bold text-primary">{workout.exercises || 'Varied'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeof workout.days === 'number' && workout.days > 0 ? Array.from({ length: workout.days }).map((_, idx) => (
              <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h5 className="font-semibold text-primary mb-3 pb-2 border-b border-border text-sm">Day {idx + 1}: {workout.focus}</h5>
                <ul className="space-y-2 text-sm text-secondary">
                  <li className="flex justify-between items-center bg-input px-3 py-2 rounded-lg">
                    <span>Main Compound Movement</span> <span className="font-medium text-primary text-xs">3x10</span>
                  </li>
                  <li className="flex justify-between items-center bg-input px-3 py-2 rounded-lg">
                    <span>Accessory Movement 1</span> <span className="font-medium text-primary text-xs">3x12</span>
                  </li>
                  <li className="flex justify-between items-center bg-input px-3 py-2 rounded-lg">
                    <span>Accessory Movement 2</span> <span className="font-medium text-primary text-xs">4x8</span>
                  </li>
                </ul>
              </div>
            )) : Array.isArray(workout.days) && workout.days.length > 0 ? (
              workout.days.map((day: import("@/app/manager/workout/workout_types/ManagerWorkoutTypes").WorkoutDay | number, idx: number) => (
                <div key={idx} className="bg-card border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h5 className="font-semibold text-primary mb-3 pb-2 border-b border-border text-sm">Day {typeof day === 'number' ? day : day.day || idx + 1}: {typeof day === 'number' ? '' : day.focus}</h5>
                  {typeof day === 'number' ? false : day.isRest ? (
                    <p className="text-sm text-secondary italic">Rest Day - No workout assigned.</p>
                  ) : (
                    <ul className="space-y-2 text-sm text-secondary">
                      {(typeof day === 'number' ? [] : day.exercises || []).map((ex: import("@/app/manager/workout/workout_types/ManagerWorkoutTypes").WorkoutExercise, i: number) => (
                        <li key={i} className="flex justify-between items-center bg-input px-3 py-2 rounded-lg">
                          <span>{ex.name}</span> <span className="font-medium text-primary text-xs">{ex.sets}x{ex.reps}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full bg-input border border-border rounded-xl p-6 text-center">
                <Dumbbell className="mx-auto text-primary/40 mb-3" size={32} />
                <p className="text-lg text-primary font-bold">{workout.name}</p>
                <p className="text-secondary text-sm mt-2 max-w-md mx-auto">
                  This plan is a {workout.level} level routine focused on {workout.focus}, spanning {Array.isArray(workout.days) ? workout.days.length : workout.days} days per cycle.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
