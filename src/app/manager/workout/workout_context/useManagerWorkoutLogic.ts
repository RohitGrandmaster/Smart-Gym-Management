// RESPONSIBILITY: Custom hook encapsulating all UI state and API orchestration for the Workout Library module.
import { useState, useCallback, useEffect } from 'react';
import { 
  EMPTY_WORKOUT_FORM, EMPTY_EXERCISE_FORM, WorkoutFormValues, ExerciseFormValues
} from '@/app/manager/workout/workout_utils/ManagerWorkoutSharedConstants';
import type { WorkoutContextType, Workout } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';
import { useDebounce } from '@/app/manager/manager_utils/useDebounce';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import { workoutApi } from '@/app/manager/workout/workout_api/ManagerWorkoutApi';
import { libraryApi } from '@/app/manager/library/library_api/ManagerLibraryApi';
import type { Exercise } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { useManagerWorkoutExercises } from './useManagerWorkoutExercises';
import { FetchState } from '@/app/manager/workout/workout_types/ManagerWorkoutTypes';
export function useManagerWorkoutLogic(): WorkoutContextType {
  const { confirm } = useConfirm();
  const [tab, setTab] = useState('Workout Plans');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const debouncedSearch = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const [showExModal, setShowExModal] = useState(false);
  const [editExId, setEditExId] = useState<string | null>(null);
  const [exForm, setExForm] = useState(EMPTY_EXERCISE_FORM);

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
        libraryApi.getExercises(params),
      ]);
      let fetchedWorkouts = wkRes.data.workouts || [];
      let fetchedExercises = exRes.data.exercises || [];

      if (debouncedSearch || levelFilter !== 'ALL') {
        const q = debouncedSearch.toLowerCase();
        
        fetchedWorkouts = fetchedWorkouts.filter((w: Workout) => {
          const matchesSearch = !debouncedSearch || w.name?.toLowerCase().includes(q);
          const matchesLevel = levelFilter === 'ALL' || w.level === levelFilter;
          return matchesSearch && matchesLevel;
        });

        if (debouncedSearch) {
          fetchedExercises = fetchedExercises.filter((e: Exercise) => e.name?.toLowerCase().includes(q) || (e.category && e.category?.toLowerCase().includes(q)));
        }
      }

      setWorkouts(fetchedWorkouts);
      setTotalWorkouts(wkRes.data.total || 0);
      setExercises(fetchedExercises);
      setTotalExercises(exRes.data.total || 0);
    } catch (e) {
      showToast((e as Error).message, 'error');
      setFetchState('error');
    } finally {
      setFetchState('success');
    }
  }, [showToast, currentPage, debouncedSearch, levelFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAll(); }, [loadAll]);

  // Derived state

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
      days: Array.isArray(w.days) ? w.days.length : w.days, 
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
      const payload = { 
        ...data, 
        days: Number(data.days), 
        exercises: Number(data.exercises), 
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean) 
      };
      
      if (editWkId) {
        const res = await workoutApi.updateWorkout(editWkId, payload);
        const updatedWk = res.data || payload;
        setWorkouts(prev => prev.map(w => String(w.id) === String(editWkId) ? { ...w, ...updatedWk } as Workout : w));
        showToast(res.message || 'Workout updated successfully', 'success');
      } else {
        const res = await workoutApi.createWorkout(payload);
        const newWk = res.data ? res.data : { ...payload, id: `wk-${Date.now()}` } as Workout;
        setWorkouts(prev => [newWk, ...prev]);
        setTotalWorkouts(prev => prev + 1);
        showToast(res.message || 'Workout created successfully', 'success');
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
      setTotalWorkouts(prev => Math.max(0, prev - 1));
      showToast(res.message || 'Workout plan deleted', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [confirm, showToast]);

  const exerciseLogic = useManagerWorkoutExercises(
    setExercises,
    setTotalExercises,
    showToast,
    setSaving,
    confirm as any
  );

  return {
    tab, setTab,
    search, setSearch,
    levelFilter, setLevelFilter,
    currentPage, setCurrentPage,
    workouts, totalWorkouts,
    exercises, totalExercises,
    fetchState, saving, toast, showToast, hideToast, loadAll,
    showWkModal, setShowWkModal, editWkId, wkForm, setWkForm,
    openAddWk, openEditWk, saveWk, deleteWk,
    ...exerciseLogic
  };
}
