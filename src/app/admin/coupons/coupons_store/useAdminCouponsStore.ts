// RESPONSIBILITY: Zustand store for Coupons module UI state — modal, form, filters.
import { create } from 'zustand';
import type { CouponFormValues } from '@/app/admin/coupons/coupons_types/coupons_types';
import { EMPTY_COUPON_FORM } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';

interface AdminCouponsStore {
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  editId: string | null;
  setEditId: (id: string | null) => void;
  form: CouponFormValues;
  setForm: (f: CouponFormValues) => void;
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const useAdminCouponsStore = create<AdminCouponsStore>((set) => ({
  showModal: false,
  setShowModal: (v) => set({ showModal: v }),
  editId: null,
  setEditId: (id) => set({ editId: id }),
  form: EMPTY_COUPON_FORM,
  setForm: (f) => set({ form: f }),
  search: '',
  setSearch: (s) => set({ search: s, currentPage: 1 }),
  statusFilter: 'all',
  setStatusFilter: (s) => set({ statusFilter: s, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (p) => set({ currentPage: p }),
}));
