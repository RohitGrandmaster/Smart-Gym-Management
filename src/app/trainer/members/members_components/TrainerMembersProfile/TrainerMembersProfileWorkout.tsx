'use client';
// RESPONSIBILITY: Renders the member's assigned workout plan and provides plan assignment capabilities for trainers.
// DATA FLOW: useMembersContext -> TrainerMembersProfileWorkout -> workoutApi

import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Check, MessageCircle, RefreshCw, Calendar, Flame, Target } from 'lucide-react';
import { useMembersContext } from '@/app/trainer/members/members_context/MembersContext';
import { workoutApi } from '@/app/trainer/workout/workout_api/workout_api';
import type { Workout, FetchState } from '@/app/trainer/trainer_types/trainer_types';

export default function TrainerMembersProfileWorkout() {
  const { selectedMember, assignWorkout } = useMembersContext();
  const [isAssigning, setIsAssigning] = useState(false);
  const [availableWorkouts, setAvailableWorkouts] = useState<Workout[]>([]);
  const [fetchWorkoutsState, setFetchWorkoutsState] = useState<FetchState>('idle');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAssigning && availableWorkouts.length === 0) {
      setFetchWorkoutsState('loading');
      workoutApi.getWorkouts()
        .then(res => {
          setAvailableWorkouts(res.data?.workouts || []);
          setFetchWorkoutsState('success');
        })
        .catch(() => {
          setFetchWorkoutsState('error');
        });
    }
  }, [isAssigning, availableWorkouts.length]);

  if (!selectedMember) return null;

  const workout = selectedMember.assignedWorkout;
  const hasWorkoutPlan = !!workout;

  const handleAssign = async () => {
    if (!selectedWorkoutId) return;
    const selected = availableWorkouts.find(w => String(w.id) === selectedWorkoutId) || null;
    setSaving(true);
    try {
      await assignWorkout(selectedMember.id, selected);
      setIsAssigning(false);
      setSelectedWorkoutId('');
    } finally {
      setSaving(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!workout) return;
    const text = `*GYMSMART WORKOUT PLAN FOR ${selectedMember.name.toUpperCase()}*\n` +
      `Plan: *${workout.name}* (${workout.level || 'Standard'})\n` +
      `Duration: ${workout.duration || '45 mins'}\n` +
      `Focus: ${workout.focus || 'General Fitness'}\n\n` +
      (workout.workoutExercises && workout.workoutExercises.length > 0
        ? `*Exercises:*\n` + workout.workoutExercises.map((e, idx) => `${idx + 1}. ${e.name} - ${e.sets} sets x ${e.reps} (Rest: ${e.restTime || '60s'})`).join('\n')
        : `Stay consistent and train hard! Contact your trainer for guidance.`);
    window.open(`https://wa.me/${selectedMember.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 motion-safe:animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Workout Plan</h3>
          <p className="text-sm text-secondary">Assign or update daily workout routines for {selectedMember.name}.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasWorkoutPlan ? (
            <>
              <button 
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm transition-all active:scale-95"
              >
                <MessageCircle size={16} /> Share via WhatsApp
              </button>
              <button 
                onClick={() => {
                  setSelectedWorkoutId(workout.id || '');
                  setIsAssigning(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-input text-foreground border border-border rounded-xl text-sm font-semibold hover:bg-primary-subtle transition-all active:scale-95"
              >
                <RefreshCw size={15} /> Change Plan
              </button>
            </>
          ) : !isAssigning ? (
            <button 
              onClick={() => setIsAssigning(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
            >
              <Plus size={16} /> Assign Workout Plan
            </button>
          ) : null}
        </div>
      </div>

      {/* Plan Assignment Box */}
      {isAssigning && (
        <div className="bg-card border border-primary/30 p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Dumbbell size={18} /> Select Workout Plan from Library
            </h4>
            <button 
              onClick={() => setIsAssigning(false)}
              className="text-xs text-secondary hover:text-foreground font-medium"
            >
              Cancel
            </button>
          </div>

          {fetchWorkoutsState === 'loading' ? (
            <p className="text-sm text-secondary py-3">Loading available workout plans...</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedWorkoutId}
                onChange={(e) => setSelectedWorkoutId(e.target.value)}
              >
                <option value="">-- Choose a Workout Plan --</option>
                {availableWorkouts.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} · {w.level} ({w.duration || '45m'})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button 
                  onClick={handleAssign}
                  disabled={!selectedWorkoutId || saving}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={16} /> {saving ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Workout Display */}
      {hasWorkoutPlan ? (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  Active Plan
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info-bg text-info">
                  {workout.level || 'Intermediate'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">{workout.name}</h3>
              <p className="text-sm text-secondary mt-1">{workout.focus || 'Targeted strength and muscle conditioning'}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-secondary">Session Duration</p>
                <p className="text-base font-bold text-foreground flex items-center gap-1">
                  <Calendar size={14} className="text-primary" /> {workout.duration || '45-60 mins'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary">Frequency</p>
                <p className="text-base font-bold text-foreground flex items-center gap-1">
                  <Flame size={14} className="text-warning" /> {workout.days || 5} days/week
                </p>
              </div>
            </div>
          </div>

          {/* Exercises Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Exercises Routine</h4>
            {workout.workoutExercises && workout.workoutExercises.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workout.workoutExercises.map((ex, idx) => (
                  <div key={idx} className="bg-input/60 border border-border rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">{ex.name}</p>
                        <p className="text-xs text-secondary">Rest: {ex.restTime || '60s'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-primary">{ex.sets} sets × {ex.reps}</span>
                      {ex.weight && <p className="text-xs text-secondary">{ex.weight}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-input/40 border border-dashed border-border rounded-xl p-6 text-center text-secondary text-sm">
                Custom routine assigned. Review standard exercise instructions in the Workout Library.
              </div>
            )}
          </div>
        </div>
      ) : !isAssigning ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Dumbbell size={26} />
          </div>
          <h4 className="text-lg font-bold text-foreground">No Workout Plan Assigned</h4>
          <p className="text-sm text-secondary max-w-md mx-auto">
            {selectedMember.name} has not been assigned a workout plan yet. Choose an appropriate plan from the library based on their fitness level.
          </p>
          <button
            onClick={() => setIsAssigning(true)}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:shadow-md transition-all"
          >
            <Plus size={16} /> Assign Workout Plan
          </button>
        </div>
      ) : null}

      {/* Workout History Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mt-6">
        <h4 className="text-lg font-bold text-foreground mb-4">Workout History</h4>
        <div className="space-y-3">
          {[
            { name: 'Full Body Strength', date: 'Aug 2026 - Sep 2026', level: 'Beginner', status: 'Completed' },
            { name: 'HIIT Fat Burn', date: 'Jul 2026 - Aug 2026', level: 'Beginner', status: 'Completed' },
          ].map((historyItem, idx) => (
            <div key={idx} className="bg-input rounded-xl p-4 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-sm text-foreground">{historyItem.name}</h5>
                <p className="text-xs text-secondary">{historyItem.date} · {historyItem.level}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-bg text-success flex items-center gap-1">
                <Check size={12} /> {historyItem.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
