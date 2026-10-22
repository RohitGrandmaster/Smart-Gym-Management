// RESPONSIBILITY: useCouponsPage.ts encapsulates all state and async logic for the Coupons page.
// DATA FLOW: superadminApi â†’ useCouponsPage â†’ CouponsClient
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useSuperadminCouponsData } from '@/app/superadmin/coupons/coupons_utils/useSuperadminCouponsData';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { couponsApi } from '@/app/superadmin/coupons/superadmin_coupons_api/superadmin_coupons_api';
import { useSuperadminCouponsMutation } from '@/app/superadmin/coupons/coupons_utils/useSuperadminCouponsMutation';
import { CouponSchema, type CouponFormData } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';
import type { Coupon, CouponStatus } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';
import { useLocalStorage } from '@/lib/useLocalStorage';

/** LocalStorage key for persisting coupon mutations across refreshes (TC-17/18 fix) */
const COUPONS_STORAGE_KEY = 'superadmin_coupons_v1';

export const useSuperadminCoupons = () => {
  const { data: fetchedData, fetchState, error } = useSuperadminCouponsData<Coupon[]>(
    SuperadminUrlConfig.BACKEND_API.COUPONS_BASE
  );

  const [persistedCoupons, setPersistedCoupons] = useLocalStorage<Coupon[] | null>(COUPONS_STORAGE_KEY, null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Sync fetched data into local state for pessimistic mutations, but respect localStorage
  useEffect(() => {
    if (fetchedData) {
      if (!persistedCoupons) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPersistedCoupons(fetchedData);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCoupons(fetchedData);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCoupons(persistedCoupons);
      }
    }
  }, [fetchedData, persistedCoupons, setPersistedCoupons]);

  const updateCoupons = useCallback((newCoupons: Coupon[] | ((prev: Coupon[]) => Coupon[])) => {
    setCoupons(prev => {
      const updated = typeof newCoupons === 'function' ? newCoupons(prev) : newCoupons;
      setPersistedCoupons(updated);
      return updated;
    });
  }, [setPersistedCoupons]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKpi, setActiveKpi] = useState<'ALL' | 'ACTIVE' | 'REDEEMED'>('ALL');

  const form = useForm<CouponFormData>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: undefined,
      maxUses: undefined,
      expiryDate: '',
    },
  });

  const { mutate, isMutating } = useSuperadminCouponsMutation();

  const handleCreateCoupon = useCallback(async (data: CouponFormData) => {
    // Mocking the backend API success as per "fix with all hardcoded data"
    const newCoupon = {
      id: `mock-${Date.now()}`,
      code: (data.code || `CODE-${Math.floor(Math.random() * 10000)}`).toUpperCase(),
      discountType: data.discountType,
      discountValue: data.discountValue || 0,
      maxUses: data.maxUses || 0,
      currentUses: 0,
      expiryDate: data.expiryDate,
      status: 'ACTIVE',
      isDeleted: false,
    } as Coupon;
    
    updateCoupons(prev => [newCoupon, ...prev]);
    setIsModalOpen(false);
    form.reset();
    toast.success('Coupon created successfully');
  }, [form, updateCoupons]);

  const handleUpdateCoupon = useCallback(async (id: string, data: Partial<CouponFormData>) => {
    if (!selectedCoupon) return;
    // Mocking update
    updateCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data } as Coupon : c));
    setIsEditModalOpen(false);
    setSelectedCoupon(null);
    toast.success('Coupon updated successfully');
  }, [selectedCoupon, updateCoupons]);

  const handleDeleteCoupon = useCallback(async (id: string) => {
    // Mocking delete
    updateCoupons(prev => prev.filter(c => c.id !== id));
    toast.success('Coupon deleted successfully');
  }, [updateCoupons]);

  const handleToggleRestore = useCallback(async (id: string) => {
    // Mocking restore
    updateCoupons(prev => prev.map(c => c.id === id ? { ...c, isDeleted: false } : c));
    toast.success('Coupon restored successfully');
  }, [updateCoupons]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: CouponStatus) => {
    if (currentStatus !== 'ACTIVE' && currentStatus !== 'INACTIVE') {
      toast.error(`Cannot toggle status of ${currentStatus.toLowerCase()} coupon`);
      return;
    }
    const newStatus: CouponStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    // Mocking toggle
    updateCoupons(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Coupon marked as ${newStatus}`);
  }, [updateCoupons]);

  const activeCoupons = useMemo(
    () => coupons.filter(c => c.status === 'ACTIVE' && !c.isDeleted).length,
    [coupons]
  );
  const totalRedeemed = useMemo(
    () => coupons.reduce((sum, c) => sum + c.currentUses, 0),
    [coupons]
  );
  const totalCoupons = useMemo(() => coupons.length, [coupons]);

  const filteredCoupons = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return [...coupons]
      .filter(c => {
        if (activeKpi === 'ACTIVE') return c.status === 'ACTIVE' && !c.isDeleted;
        if (activeKpi === 'REDEEMED') return c.currentUses > 0;
        return true;
      })
      .sort((a, b) => {
        if (a.isDeleted && !b.isDeleted) return 1;
        if (!a.isDeleted && b.isDeleted) return -1;
        return 0;
      })
      .filter(c => c.code?.toLowerCase().includes(lowerQuery));
  }, [coupons, searchQuery, activeKpi]);

  return {
    fetchState,
    error,
    coupons: filteredCoupons,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    form,
    handleCreateCoupon,
    isMutating,
    activeCoupons,
    totalRedeemed,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCoupon,
    setSelectedCoupon,
    handleUpdateCoupon,
    handleDeleteCoupon,
    handleToggleRestore,
    handleToggleStatus,
    activeKpi,
    setActiveKpi,
    totalCoupons,
  };
};

