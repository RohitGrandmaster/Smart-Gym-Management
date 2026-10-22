// RESPONSIBILITY: Custom hook encapsulating all UI state and API orchestration for the Diet Library module.
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/app/manager/manager_utils/useDebounce';
import { libraryApi } from '@/app/manager/library/library_api/ManagerLibraryApi';
import type { DietPlan } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import type { ToastType } from '@/app/manager/manager_components/ManagerFeedback/ManagerToast';
import { EMPTY_DIET_FORM, type DietFormValues } from '@/app/manager/library/library_utils/ManagerLibrarySharedConstants';
import type { LibraryContextType, LibraryInitialData, FetchState } from '@/app/manager/library/library_types/ManagerLibraryTypes';
import { useConfirm } from '@/app/manager/manager_components/ManagerFeedback/ManagerConfirmProvider';
import { useRouter, useSearchParams } from 'next/navigation';

export function useManagerLibraryLogic(initialData?: LibraryInitialData | null): LibraryContextType {
  const { confirm } = useConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  


  const [dietPlans, setDietPlans] = useState<DietPlan[]>(initialData?.dietPlans || []);
 
 const [fetchState, setFetchState] = useState<FetchState>(initialData ? 'success' : 'loading');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [search, setLocalSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 300);
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) { params.set('search', debouncedSearch); params.set('page', '1'); }
      else { params.delete('search'); params.set('page', '1'); }
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, searchParams, router]);

  const setSearch = useCallback((val: string) => setLocalSearch(val), []);

  const setCurrentPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);


 const [showDietModal, setShowDietModal] = useState(false);
 const [editDietId, setEditDietId] = useState<string | null>(null);
 const [editDietData, setEditDietData] = useState<import("@/app/manager/library/library_types/ManagerLibraryTypes").DietPlan | null>(null);

 const showToast = useCallback((msg: string, t: ToastType) => setToast({ message: msg, type: t }), []);
 const hideToast = useCallback(() => setToast(null), []);

 const loadAll = useCallback(async () => {
 setFetchState('loading');
 try {
 const params: Record<string, string> = {
  page: currentPage.toString(),
  limit: '10'
 };
 if (debouncedSearch) {
  params.search = debouncedSearch;
 }
 const dietRes = await libraryApi.getDietPlans(params);
 let fetchedDiets = dietRes.data?.dietPlans || dietRes.data || [];
 if (debouncedSearch) {
   const q = debouncedSearch.toLowerCase();
   fetchedDiets = fetchedDiets.filter((d: DietPlan) => d.name?.toLowerCase().includes(q));
 }
 setDietPlans(fetchedDiets);
 } catch (e) {
 showToast((e as Error).message, 'error');
 setFetchState('error');
 } finally {
 setFetchState('success');
 }
  }, [showToast, currentPage, debouncedSearch]);

 useEffect(() => { loadAll(); }, [loadAll]);

 // Diet CRUD
  const openAddDiet = useCallback(() => {
    setEditDietId(null);
    setEditDietData(null);
    setShowDietModal(true);
  }, []);
 
 const openEditDiet = useCallback((d: DietPlan) => {
 setEditDietId(d.id);
    setEditDietData(d);
 setShowDietModal(true);
 }, []);
 
  const saveDietPlan = useCallback(async (data: Partial<DietPlan>) => {
    setSaving(true);
    try {
      const formattedData = {
        ...data,
        meals: typeof (data.meals as unknown) === 'string' ? (data.meals as unknown as string).split('\n').map(s => s.trim()).filter(Boolean) : data.meals
      };
      if (editDietId) {
        const res = await libraryApi.updateDietPlan(editDietId, formattedData);
        const updatedDiet = res.data || formattedData;
        setDietPlans(prev => prev.map(d => String(d.id) === String(editDietId) ? { ...d, ...updatedDiet } as unknown as DietPlan : d));
        showToast(res.message || 'Diet plan updated successfully', 'success');
      } else {
        const res = await libraryApi.createDietPlan(formattedData);
        const newDiet = res.data ? res.data : { ...formattedData, id: `diet-${Date.now()}` } as unknown as DietPlan;
        setDietPlans(prev => [newDiet, ...prev]);
        showToast(res.message || 'Diet plan created successfully', 'success');
      }
      setShowDietModal(false);
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  }, [editDietId, showToast]);
 
  const deleteDietPlan = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Remove Diet Plan', message: 'Delete this diet plan?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    try {
      const res = await libraryApi.removeDietPlan(id);
      setDietPlans(prev => prev.filter(d => String(d.id) !== String(id)));
      showToast(res.message || 'Diet plan deleted', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    }
  }, [showToast, confirm]);

  return {
    dietPlans, fetchState, saving, toast,
    search, debouncedSearch, setSearch, currentPage, setCurrentPage,
    showToast, hideToast, loadAll,

 showDietModal, setShowDietModal, editDietId, editDietData, openAddDiet, openEditDiet, saveDietPlan, deleteDietPlan
 };
}
