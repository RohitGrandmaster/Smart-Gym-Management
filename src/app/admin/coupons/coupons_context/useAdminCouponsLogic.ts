// RESPONSIBILITY: Custom hook encapsulating all business logic for the Coupons module.
// DATA FLOW: AdminCouponsMain → useAdminCouponsLogic → couponsApi
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponsApi } from '@/app/admin/coupons/coupons_api/coupons_api';
import { useAdminCouponsStore } from '@/app/admin/coupons/coupons_store/useAdminCouponsStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { EMPTY_COUPON_FORM, COUPONS_ITEMS_PER_PAGE } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';
import type { Coupon, CouponFormValues, FetchState } from '@/app/admin/coupons/coupons_types/coupons_types';

export function useAdminCouponsLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const { showModal, setShowModal, editId, setEditId, form, setForm, search, statusFilter, currentPage, setCurrentPage } = useAdminCouponsStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: () => couponsApi.fetchCoupons().then(r => r.data ?? []),
    staleTime: 1000 * 60 * 2,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  // Client-side filter
  const allCoupons = data ?? [];
  const filtered = allCoupons.filter(c => {
    const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / COUPONS_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * COUPONS_ITEMS_PER_PAGE, currentPage * COUPONS_ITEMS_PER_PAGE);

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Coupon>) => couponsApi.createCoupon(payload),
    onSuccess: (res) => { toast.success(res.message); setShowModal(false); qc.invalidateQueries({ queryKey: ['adminCoupons'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Coupon> }) => couponsApi.updateCoupon(id, payload),
    onSuccess: (res) => { toast.success(res.message); setShowModal(false); qc.invalidateQueries({ queryKey: ['adminCoupons'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponsApi.deleteCoupon(id),
    onSuccess: (res) => { toast.success(res.message); qc.invalidateQueries({ queryKey: ['adminCoupons'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => couponsApi.toggleCoupon(id),
    onSuccess: (res) => { toast.success(res.message); qc.invalidateQueries({ queryKey: ['adminCoupons'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const openAdd = useCallback(() => { setEditId(null); setForm(EMPTY_COUPON_FORM); setShowModal(true); }, [setEditId, setForm, setShowModal]);

  const openEdit = useCallback((c: Coupon) => {
    setEditId(c.id);
    setForm({
      code: c.code, description: c.description, type: c.type,
      value: String(c.value), minOrderAmount: String(c.minOrderAmount),
      maxDiscount: String(c.maxDiscount), usageLimit: String(c.usageLimit),
      assignedGyms: c.assignedGyms, validFrom: c.validFrom, validUntil: c.validUntil,
    });
    setShowModal(true);
  }, [setEditId, setForm, setShowModal]);

  const saveCoupon = useCallback(async (data: CouponFormValues) => {
    const payload: Partial<Coupon> = {
      code: data.code.toUpperCase(), description: data.description, type: data.type,
      value: Number(data.value), minOrderAmount: Number(data.minOrderAmount),
      maxDiscount: Number(data.maxDiscount), usageLimit: Number(data.usageLimit),
      assignedGyms: data.assignedGyms,
      assignedGymNames: data.assignedGyms.includes('all') ? ['All Gyms'] : data.assignedGyms,
      validFrom: data.validFrom, validUntil: data.validUntil, status: 'active',
    };
    if (editId) { updateMutation.mutate({ id: editId, payload }); }
    else { createMutation.mutate(payload); }
  }, [editId, createMutation, updateMutation]);

  const deleteCoupon = useCallback(async (id: string) => {
    const ok = await confirm({ title: 'Delete Coupon', message: 'This coupon will be permanently deleted. This action cannot be undone.', confirmText: 'Delete', type: 'danger' });
    if (!ok) return;
    deleteMutation.mutate(id);
  }, [confirm, deleteMutation]);

  const toggleCoupon = useCallback((id: string) => { toggleMutation.mutate(id); }, [toggleMutation]);

  const saving = createMutation.isPending || updateMutation.isPending;

  return { coupons: paginated, allCoupons, fetchState, saving, showModal, setShowModal, editId, form, setForm, openAdd, openEdit, saveCoupon, deleteCoupon, toggleCoupon, currentPage, setCurrentPage, totalPages, totalItems: filtered.length };
}
