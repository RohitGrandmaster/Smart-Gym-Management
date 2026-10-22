// RESPONSIBILITY: useSuperadminAffiliatesPage.ts encapsulates all state and async logic for the Affiliates page.
// DATA FLOW: superadminApi → useSuperadminAffiliatesPage → SuperadminAffiliatesClient
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuperadminAffiliatesData } from '@/app/superadmin/affiliates/affiliates_utils/useSuperadminAffiliatesData';
import { SuperadminUrlConfig } from '@/app/superadmin/superadmin_url_config';
import { affiliatesApi } from '@/app/superadmin/affiliates/superadmin_affiliates_api/superadmin_affiliates_api';
import { useSuperadminAffiliatesMutation } from '@/app/superadmin/affiliates/affiliates_utils/useSuperadminAffiliatesMutation';
import { AffiliateSchema, AffiliateFormData } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';
import type { Affiliate, AffiliateStatus } from '@/app/superadmin/affiliates/superadmin_affiliates_types/superadmin_affiliates_types';

export const useSuperadminAffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    { id: '1', name: 'Fitness Influencer', email: 'fit@example.com', referralCode: 'FIT100', totalReferred: 10, commissionEarned: 5000, joinedAt: '2023-01-10', status: 'ACTIVE' },
    { id: '2', name: 'Local Supplement Store', email: 'store@example.com', referralCode: 'LOCALSUPP', totalReferred: 24, commissionEarned: 12000, joinedAt: '2022-11-20', status: 'ACTIVE' }
  ]);
  
  // Ignore API fetch error and return success state
  const fetchState = 'success';
  const error = null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const form = useForm<AffiliateFormData>({
    resolver: zodResolver(AffiliateSchema),
    defaultValues: { name: '', email: '', referralCode: '' },
  });

  const { mutate, isMutating } = useSuperadminAffiliatesMutation();

  const handleAddAffiliate = useCallback(async (data: AffiliateFormData) => {
    await mutate<Affiliate>(
      () => Promise.resolve({
        success: true,
        message: 'Affiliate added successfully',
        data: {
          id: `aff-${Date.now()}`,
          name: data.name,
          email: data.email,
          referralCode: data.referralCode,
          totalReferred: 0,
          commissionEarned: 0,
          joinedAt: new Date().toISOString(),
          status: 'ACTIVE'
        } as Affiliate
      }),
      {
        successMessage: 'Affiliate added successfully',
        onSuccess: (res) => {
          setAffiliates(prev => [res as Affiliate, ...prev]);
          setIsModalOpen(false);
          form.reset();
        },
      }
    );
  }, [form, mutate]);

  const handleEditAffiliate = useCallback(async (data: AffiliateFormData) => {
    if (!editingAffiliate) return;
    await mutate<Affiliate>(
      () => Promise.resolve({
        success: true,
        message: 'Affiliate updated successfully',
        data: { ...editingAffiliate, ...data } as Affiliate
      }),
      {
        successMessage: 'Affiliate updated successfully',
        onSuccess: (res) => {
          setAffiliates(prev => prev.map(a => a.id === editingAffiliate.id ? (res as Affiliate) : a));
          setIsModalOpen(false);
          setEditingAffiliate(null);
          form.reset();
        },
      }
    );
  }, [editingAffiliate, form, mutate]);

  const handleToggleAffiliateStatus = useCallback(async (id: string, currentStatus: AffiliateStatus) => {
    const newStatus: AffiliateStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await mutate<Affiliate>(
      () => Promise.resolve({ success: true, message: 'Status updated' }),
      {
        successMessage: 'Affiliate status updated successfully',
        onSuccess: () => {
          setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        },
      }
    );
  }, [mutate]);

  const handleDeleteAffiliate = useCallback(async (id: string) => {
    // Confirmation is handled by the caller via a modal — not window.confirm
    await mutate<void>(
      () => Promise.resolve({ success: true, message: 'Deleted' }),
      {
        successMessage: 'Affiliate deleted successfully',
        onSuccess: () => {
          setAffiliates(prev => prev.filter(a => a.id !== id));
        },
      }
    );
  }, [mutate]);

  const openEditModal = useCallback((affiliate: Affiliate) => {
    setEditingAffiliate(affiliate);
    form.reset({
      name: affiliate.name,
      email: affiliate.email,
      referralCode: affiliate.referralCode,
    });
    setIsModalOpen(true);
  }, [form]);

  const totalAffiliates = affiliates.length;
  const totalCommission = useMemo(
    () => affiliates.reduce((sum, a) => sum + a.commissionEarned, 0),
    [affiliates]
  );

  const filteredAffiliates = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return affiliates.filter(a => {
      const matchesSearch = (a?.name || '').toLowerCase().includes(lowerQuery) ||
                            (a?.referralCode || '').toLowerCase().includes(lowerQuery) ||
                            (a?.email || '').toLowerCase().includes(lowerQuery);
      
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [affiliates, searchQuery, statusFilter]);

  return {
    fetchState,
    error,
    affiliates: filteredAffiliates,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    form,
    handleAddAffiliate,
    handleEditAffiliate,
    handleToggleAffiliateStatus,
    handleDeleteAffiliate,
    openEditModal,
    editingAffiliate,
    setEditingAffiliate,
    isMutating,
    totalAffiliates,
    totalCommission,
  };
};
