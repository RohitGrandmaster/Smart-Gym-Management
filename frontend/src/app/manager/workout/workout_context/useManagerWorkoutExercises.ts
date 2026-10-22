// RESPONSIBILITY: Handles logic and state for Exercises inside the Workout module.
import { useState, useCallback } from 'react';
import { EMPTY_EXERCISE_FORM, ExerciseFormValues } from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';
import type { Exercise } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import { libraryApi } from '@/app/manager/library/library_api/ManagerLibraryApi';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';

export function useManagerWorkoutExercises(
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>,
  setTotalExercises: React.Dispatch<React.SetStateAction<number>>,
  showToast: (msg: string, type: ToastType) => void,
  setSaving: (saving: boolean) => void,
  confirm: (args: { title: string; message: string; confirmText: string; type: 'danger' | 'warning' }) => Promise<boolean>
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
      const { muscle, equipment, ...rest } = data;
      const payload = { 
        ...rest, 
        category: equipment,
        muscleGroup: muscle.split(',').map(s => s.trim()) 
      };
      if (editExId) {
        const res = await libraryApi.updateExercise(editExId, payload as unknown as Partial<Exercise>);
        const updatedEx = res.data || payload;
        setExercises(prev => prev.map(e => String(e.id) === String(editExId) ? { ...e, ...updatedEx } as unknown as Exercise : e));
        showToast(res.message || 'Exercise updated successfully', 'success');
      } else {
        const res = await libraryApi.createExercise(payload as unknown as Partial<Exercise>);
        const newEx = res.data ? res.data : { ...payload, id: `ex-${Date.now()}` } as unknown as Exercise;
        setExercises(prev => [newEx, ...prev]);
        setTotalExercises(prev => prev + 1);
        showToast(res.message || 'Exercise created successfully', 'success');
      }
      setShowExModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editExId, showToast, setExercises, setTotalExercises, setSaving]);
  
  const deleteEx = useCallback(async (id: string) => { 
    const isConfirmed = await confirm({ title: 'Delete Exercise', message: 'Delete this exercise?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await libraryApi.removeExercise(id);
      setExercises(prev => prev.filter(e => String(e.id) !== String(id)));
      setTotalExercises(prev => Math.max(0, prev - 1));
      showToast(res.message || 'Exercise deleted', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [confirm, showToast, setExercises, setTotalExercises]);

  return {
    showExModal, setShowExModal,
    editExId, setEditExId,
    exForm, setExForm,
    openAddEx, openEditEx,
    saveEx, deleteEx
  };
}
