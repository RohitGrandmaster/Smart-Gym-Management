// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Custom hook encapsulating all UI state and API orchestration for the Workout Library module.
import { useState, useCallback, useEffect } from 'react';
import { 
  EMPTY_WORKOUT_FORM, WorkoutFormValues
} from '@/app/trainer/workout/workout_utils/WorkoutSharedConstants';
import type { WorkoutContextType } from '@/app/trainer/workout/workout_types/workout_types';
import type { Workout } from '@/app/trainer/trainer_types/trainer_types';
import { useDebounce } from '@/app/trainer/trainer_utils/useDebounce';
import { useConfirm } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerConfirmProvider';
import { workoutApi } from '@/app/trainer/workout/workout_api/workout_api';
import { trainerSharedApi } from '@/app/trainer/trainer_api/trainer_api';
import type { Exercise, FetchState } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { useTrainerWorkoutExercises } from './useTrainerWorkoutExercises';

export function useWorkoutLogic(): WorkoutContextType {
  const { confirm } = useConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tab = searchParams.get('tab') || 'Workout Plans';
  const search = searchParams.get('search') || '';
  const filterCategory = searchParams.get('category') || 'All';
  const currentPage = Number(searchParams.get('page')) || 1;
  const debouncedSearch = useDebounce(search, 300);

  const setUrlParam = useCallback((key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) current.set(key, value);
    else current.delete(key);
    if (key !== 'page' && key !== 'tab') current.set('page', '1');
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setTab = useCallback((val: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('tab', val);
    current.delete('category'); // Reset filter when switching tabs
    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setSearch = useCallback((val: string) => setUrlParam('search', val || null), [setUrlParam]);
  const setFilterCategory = useCallback((val: string) => setUrlParam('category', val), [setUrlParam]);
  const setCurrentPage = useCallback((val: number) => setUrlParam('page', val.toString()), [setUrlParam]);
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [totalExercises, setTotalExercises] = useState(0);

  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [showWkModal, setShowWkModal] = useState(false);
  const [editWkId, setEditWkId] = useState<string | null>(null);
  const [wkForm, setWkForm] = useState(EMPTY_WORKOUT_FORM);

  const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
  const hideToast = useCallback(() => setToast(null), []);

  const loadAll = useCallback(async () => {
    setFetchState('loading');
    try {
      const params: Record<string, string> = {
        limit: '12',
        page: currentPage.toString()
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const [wkRes, exRes] = await Promise.all([
        workoutApi.getWorkouts(params),
        trainerSharedApi.fetchExercises(params) as Promise<any>,
      ]);
      
      let fetchedWorkouts = wkRes.data.workouts || [];
      let fetchedExercises = exRes.data.exercises || [];
      
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        fetchedWorkouts = fetchedWorkouts.filter((w: Workout) => 
          w.name?.toLowerCase().includes(q) || w.focus?.toLowerCase().includes(q) || (w.tags && w.tags.some(t => t?.toLowerCase().includes(q)))
        );
        fetchedExercises = fetchedExercises.filter((e: Exercise) => 
          e.name?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) || (e.muscleGroup && e.muscleGroup.some(m => m?.toLowerCase().includes(q)))
        );
      }
      
      if (filterCategory !== 'All') {
        if (tab === 'Workout Plans') {
          fetchedWorkouts = fetchedWorkouts.filter((w: Workout) => w.focus === filterCategory);
        } else {
          fetchedExercises = fetchedExercises.filter((e: Exercise) => e.muscleGroup?.includes(filterCategory) || e.category === filterCategory);
        }
      }
      
      setWorkouts(fetchedWorkouts);
      setTotalWorkouts(wkRes.data.total || fetchedWorkouts.length || 0);
      setExercises(fetchedExercises);
      setTotalExercises(exRes.data.total || fetchedExercises.length || 0);
      setFetchState('success');
    } catch (e) {
      showToast((e as Error).message, 'error');
      setFetchState('error');
    }
  }, [showToast, currentPage, debouncedSearch]);

  useEffect(() => { setTimeout(() => loadAll(), 0); }, [loadAll]);

  // Workout CRUD
  const openAddWk = useCallback(() => { 
    setEditWkId(null); 
    setWkForm(EMPTY_WORKOUT_FORM); 
    setShowWkModal(true); 
  }, []);
  
  const openEditWk = useCallback((w: Workout) => { 
    setEditWkId(w.id); 
    setWkForm({ 
      name: w.name, 
      level: w.level, 
      days: w.days, 
      exercises: w.exercises, 
      focus: w.focus, 
      duration: w.duration, 
      tags: w.tags.join(', ') 
    }); 
    setShowWkModal(true); 
  }, []);
  
  const saveWk = useCallback(async (data: WorkoutFormValues) => {
    setSaving(true);
    try {
      const mappedExercises = data.workoutExercises?.map(ex => ({
        exerciseId: ex.exerciseId || `ex-${Date.now()}-${Math.random()}`,
        name: ex.name,
        sets: ex.sets,
        reps: String(ex.reps),
        weight: ex.weight || '',
        restTime: ex.restTime || ''
      })) || [];

      const payload = { 
        ...data, 
        days: Number(data.days), 
        exercises: Number(data.exercises), 
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : (data.tags || []),
        workoutExercises: mappedExercises
      };
      
      if (editWkId) {
        const res = await workoutApi.updateWorkout(editWkId, payload);
        setWorkouts(prev => prev.map(w => String(w.id) === String(editWkId) ? { ...w, ...payload } as unknown as Workout : w));
        showToast((res as { message?: string }).message || 'Success', 'success');
      } else {
        const res = await workoutApi.createWorkout(payload);
        const newWk = { ...payload, id: Math.random().toString(), isActive: true } as unknown as Workout;
        setWorkouts(prev => [newWk, ...prev]);
        showToast((res as { message?: string }).message || 'Success', 'success');
      }
      setShowWkModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editWkId, showToast]);
  
  const deleteWk = useCallback(async (id: string) => { 
    const isConfirmed = await confirm({ title: 'Delete Workout', message: 'Delete this workout plan?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await workoutApi.removeWorkout(id);
      setWorkouts(prev => prev.filter(w => String(w.id) !== String(id)));
      showToast((res as { message?: string }).message || 'Success', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [confirm, showToast]);

  const exerciseLogic = useTrainerWorkoutExercises(setExercises, showToast, setSaving, confirm as any);

  return {
    tab, setTab, search, setSearch, filterCategory, setFilterCategory, currentPage, setCurrentPage,
    workouts, totalWorkouts, exercises, totalExercises,
    fetchState, saving, toast, showToast, hideToast, loadAll,
    showWkModal, setShowWkModal, editWkId, wkForm, setWkForm,
    openAddWk, openEditWk, saveWk, deleteWk,
    ...exerciseLogic
  };
}

