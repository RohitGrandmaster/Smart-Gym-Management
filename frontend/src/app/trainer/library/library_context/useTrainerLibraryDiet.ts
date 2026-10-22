// RESPONSIBILITY: Encapsulates logic, UI, or types for the trainer module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: Handles the state and logic for managing gym diet plans.
import { useState, useCallback } from 'react';
import { libraryApi } from '@/app/trainer/library/library_api/library_api';
import type { DietPlan } from '@/app/trainer/trainer_types/trainer_types';
import type { ToastType } from '@/app/trainer/trainer_components/TrainerFeedback/TrainerToast';
import { EMPTY_DIET_FORM, type DietFormValues } from '@/app/trainer/library/library_utils/LibrarySharedConstants';

export function useTrainerLibraryDiet(
  setDietPlans: React.Dispatch<React.SetStateAction<DietPlan[]>>,
  showToast: (msg: string, t: ToastType) => void,
  setSaving: (saving: boolean) => void,
  confirm: (opts: any) => Promise<boolean>
) {
  const [showDietModal, setShowDietModal] = useState(false);
  const [editDietId, setEditDietId] = useState<string | null>(null);
  const [editDietData, setEditDietData] = useState<DietFormValues | null>(null);

  const openAddDiet = useCallback(() => { 
    setEditDietId(null); 
    setEditDietData(EMPTY_DIET_FORM as unknown as DietFormValues); 
    setShowDietModal(true); 
  }, []);
  
  const openEditDiet = useCallback((d: DietPlan) => {
    setEditDietId(d.id);
    setEditDietData({ 
      name: d.name, 
      goal: d.goal, 
      calories: d.calories || undefined, 
      protein: d.protein || undefined, 
      carbs: d.carbs || undefined, 
      fats: d.fats || undefined, 
      description: d.description || '', 
      meals: d.meals?.join('\n') 
    });
    setShowDietModal(true);
  }, []);
  
  const saveDietPlan = useCallback(async (data: DietFormValues) => {
    setSaving(true);
    try {
      const payload = { 
        ...data, 
        calories: data.calories ? Number(data.calories) : undefined, 
        protein: data.protein ? Number(data.protein) : undefined, 
        carbs: data.carbs ? Number(data.carbs) : undefined, 
        fats: data.fats ? Number(data.fats) : undefined, 
        meals: data.meals ? data.meals.split('\n').map((s: string) => s.trim()).filter(Boolean) : [] 
      };
      
      if (editDietId) { 
        const res = await libraryApi.updateDietPlan(editDietId, payload as unknown as Partial<DietPlan>) as any; 
        const updatedDiet = res.data || payload;
        setDietPlans(prev => prev.map(d => String(d.id) === String(editDietId) ? { ...d, ...updatedDiet } as unknown as DietPlan : d));
        showToast(res.message || 'Diet plan updated', 'success'); 
      } else { 
        const res = await libraryApi.createDietPlan(payload as unknown as Partial<DietPlan>) as any; 
        const newDiet = res.data ? res.data : { ...payload, id: Math.random().toString(), isActive: true } as unknown as DietPlan;
        setDietPlans(prev => [newDiet, ...prev]);
        showToast(res.message || 'Diet plan created', 'success'); 
      }
      setShowDietModal(false);
    } catch (err) { 
      showToast((err as Error).message, 'error'); 
    } finally { 
      setSaving(false); 
    }
  }, [editDietId, setDietPlans, showToast, setSaving]);
  
  const deleteDietPlan = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Delete Diet Plan', message: 'Delete this diet plan?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try { 
      const res = await libraryApi.removeDietPlan(id) as unknown as { message?: string }; 
      setDietPlans(prev => prev.filter(d => String(d.id) !== String(id)));
      showToast(res.message || 'Diet plan deleted', 'success'); 
    } catch (err) { 
      showToast((err as Error).message, 'error'); 
    }
  }, [confirm, setDietPlans, showToast]);

  const closeDietModal = useCallback(() => setShowDietModal(false), []);

  return {
    showDietModal, editDietId, editDietData, openAddDiet, openEditDiet, closeDietModal, saveDietPlan, deleteDietPlan
  };
}

