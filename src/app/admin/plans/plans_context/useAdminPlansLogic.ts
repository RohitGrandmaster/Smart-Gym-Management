import { useAdminPlansStore } from '@/app/admin/plans/plans_store/useAdminPlansStore';
// RESPONSIBILITY: Custom hook encapsulating all business logic, state, and API interactions for the Plans module.
// DATA FLOW: Centralized store/hook logic mapping API mutations and query state to UI props.
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { plansApi } from '@/app/admin/plans/plans_api/plans_api';
import type { Plan, PlansContextType, PlansInitialData, FetchState } from '@/app/admin/plans/plans_types/plans_types';
import type { ToastType } from '@/app/admin/admin_components/AdminFeedback/AdminToast';
import { EMPTY_PLAN_FORM, type PlanFormValues } from '@/app/admin/plans/plans_utils/AdminPlansSharedConstants';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useAdminPlansLogic(initialData?: PlansInitialData | null): PlansContextType {
  const { confirm } = useAdminConfirm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const search = searchParams.get('search') || '';
  const tierFilter = searchParams.get('tier') || 'All';
  const currentPage = Number(searchParams.get('page')) || 1;

  const setSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) { params.set('search', val); params.set('page', '1'); }
    else { params.delete('search'); params.set('page', '1'); }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const setTierFilter = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val !== 'All') { params.set('tier', val); params.set('page', '1'); }
    else { params.delete('tier'); params.set('page', '1'); }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const setCurrentPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const { showModal, setShowModal, editId, setEditId, form, setForm, showToast, hideToast } = useAdminPlansStore();


  const { data: plansRes, isLoading, isError } = useQuery({
    queryKey: ['adminPlans'],
    queryFn: () => plansApi.fetchAllPlans(),
    initialData: initialData ? { success: true, message: 'SSR', data: initialData.plans } : undefined,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  let fetchedPlans = plansRes?.data || [];
  
  if (tierFilter !== 'All') {
    fetchedPlans = fetchedPlans.filter((p: Plan) => p.tier === tierFilter);
  }

  const openAdd = useCallback(() => {
    setEditId(null);
    setForm(EMPTY_PLAN_FORM);
    setShowModal(true);
  }, []);

  const openEdit = useCallback((p: Plan) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      tier: p.tier,
      price1Month: String(p.price1Month),
      price3Month: String(p.price3Month),
      price6Month: String(p.price6Month),
      price12Month: String(p.price12Month),
      priceCustom: String((p as Plan & { priceCustom?: number }).priceCustom || 0),
      features: p.features.join('\n'),
    });
    setShowModal(true);
  }, []);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Plan>) => plansApi.createPlan(payload),
    onSuccess: (res) => {
      showToast(res.message || 'Plan created', 'success');
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
    onError: (err) => showToast((err as Error).message, 'error')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Partial<Plan> }) => plansApi.updatePlan(id, payload),
    onSuccess: (res) => {
      showToast(res.message || 'Plan updated', 'success');
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
    onError: (err) => showToast((err as Error).message, 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => plansApi.deletePlan(id),
    onSuccess: (res) => {
      showToast(res.message || 'Plan deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['adminPlans'] });
    },
    onError: (err) => showToast((err as Error).message, 'error')
  });

  const savePlan = useCallback(async (data: PlanFormValues) => {
    const payload: Partial<Plan> & { priceCustom?: number } = {
      name: data.name,
      tier: data.tier,
      price1Month: Number(data.price1Month),
      price3Month: Number(data.price3Month),
      price6Month: Number(data.price6Month),
      price12Month: Number(data.price12Month),
      priceCustom: Number(data.priceCustom),
      isActive: true,
      features: data.features.split('\n').map((s: string) => s.trim()).filter(Boolean),
    };

    if (editId) {
      updateMutation.mutate({ id: editId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }, [editId, createMutation, updateMutation]);

  const deletePlan = useCallback(async (id: string) => {
    const isConfirmed = await confirm({ title: 'Delete Plan', message: 'Are you sure you want to delete this plan?', confirmText: 'Delete', type: 'danger' });
    if (!isConfirmed) return;
    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  const saving = createMutation.isPending || updateMutation.isPending;

  return {
    plans: fetchedPlans, fetchState, saving, toast: null,
    search, setSearch, tierFilter, setTierFilter, currentPage, setCurrentPage,
    showModal, setShowModal, editId, form, setForm,
    showToast, hideToast, loadPlans: async () => {}, // Mocked for context
    openAdd, openEdit, savePlan, deletePlan,
  };
}



