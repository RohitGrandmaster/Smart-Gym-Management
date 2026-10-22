// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Handles the state and logic for managing gym exercises in the trainer workout library.
import { useState, useCallback } from 'react';
import { workoutApi } from '@/app/trainer/workout/workout_api/workout_api';
import type { Exercise } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import { EMPTY_EXERCISE_FORM, ExerciseFormValues } from '@/app/trainer/workout/workout_utils/WorkoutSharedConstants';

export function useTrainerWorkoutExercises(
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>,
  showToast: (msg: string, t: ToastType) => void,
  setSaving: (saving: boolean) => void,
  confirm: (opts: any) => Promise<boolean>
) {
  const [showExModal, setShowExModal] = useState(false);
  const [editExId, setEditExId] = useState<string | null>(null);
  const [exForm, setExForm] = useState(EMPTY_EXERCISE_FORM);

  const openAddEx = useCallback(() => { 
    setEditExId(null); 
    setExForm(EMPTY_EXERCISE_FORM); 
    setShowExModal(true); 
  }, []);
  
  const openEditEx = useCallback((ex: Exercise) => { 
    setEditExId(ex.id); 
    setExForm({ 
      name: ex.name, 
      muscle: ex.muscleGroup?.join(', ') || '', 
      equipment: ex.category || '', 
      difficulty: ex.difficulty 
    }); 
    setShowExModal(true); 
  }, []);
  
  const saveEx = useCallback(async (data: ExerciseFormValues) => {
    setSaving(true);
    try {
      // adapt to Exercise backend payload shape
      const { muscle, equipment, ...rest } = data;
      const payload = { 
        ...rest, 
        category: equipment,
        muscleGroup: muscle.split(',').map(s => s.trim()) 
      };
      if (editExId) {
        const res = await workoutApi.updateExercise(editExId, payload);
        setExercises(prev => prev.map(e => String(e.id) === String(editExId) ? { ...e, ...payload } as unknown as Exercise : e));
        showToast((res as { message?: string }).message || 'Success', 'success');
      } else {
        const res = await workoutApi.createExercise(payload);
        const newEx = { ...payload, id: Math.random().toString(), isActive: true } as unknown as Exercise;
        setExercises(prev => [newEx, ...prev]);
        showToast((res as { message?: string }).message || 'Success', 'success');
      }
      setShowExModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editExId, setExercises, showToast, setSaving]);
  
  const deleteEx = useCallback(async (id: string) => { 
    const isConfirmed = await confirm({ title: 'Delete Exercise', message: 'Delete this exercise?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await workoutApi.removeExercise(id);
      setExercises(prev => prev.filter(e => String(e.id) !== String(id)));
      showToast((res as { message?: string }).message || 'Success', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [confirm, setExercises, showToast]);

  return {
    showExModal, setShowExModal, editExId, exForm, setExForm, openAddEx, openEditEx, saveEx, deleteEx
  };
}

