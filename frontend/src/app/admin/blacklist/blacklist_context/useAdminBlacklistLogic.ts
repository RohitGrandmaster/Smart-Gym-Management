// RESPONSIBILITY: Business logic hook for the Blacklist module.
'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { blacklistApi } from '@/app/admin/blacklist/blacklist_api/blacklist_api';
import { useAdminBlacklistStore } from '@/app/admin/blacklist/blacklist_store/useAdminBlacklistStore';
import { useAdminConfirm } from '@/app/admin/admin_components/AdminFeedback/AdminConfirmProvider';
import { BLACKLIST_ITEMS_PER_PAGE, EMPTY_BLACKLIST_FORM } from '@/app/admin/blacklist/blacklist_utils/AdminBlacklistSharedConstants';
import type { BlacklistFormValues, FetchState } from '@/app/admin/blacklist/blacklist_types/blacklist_types';

export function useAdminBlacklistLogic() {
  const { confirm } = useAdminConfirm();
  const qc = useQueryClient();
  const { showModal, setShowModal, form, setForm, search, scopeFilter, gymFilter, currentPage, setCurrentPage } = useAdminBlacklistStore();

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['adminBlacklist'],
    queryFn: blacklistApi.fetchBlacklist,
    staleTime: 1000 * 60 * 2,
  });

  const { data: kpis } = useQuery({
    queryKey: ['adminBlacklistKPIs'],
    queryFn: blacklistApi.fetchKPIs,
    staleTime: 1000 * 60 * 5,
  });

  const fetchState: FetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  const filtered = data.filter(m => {
    const matchSearch = !search || m.memberName.toLowerCase().includes(search.toLowerCase()) || m.memberId.toLowerCase().includes(search.toLowerCase()) || m.memberPhone.includes(search);
    const matchScope = scopeFilter === 'all' || m.scope === scopeFilter;
    const matchGym = gymFilter === 'all' || m.assignedGyms.includes(gymFilter) || m.assignedGyms.includes('all');
    return matchSearch && matchScope && matchGym;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLACKLIST_ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * BLACKLIST_ITEMS_PER_PAGE, currentPage * BLACKLIST_ITEMS_PER_PAGE);

  const addMutation = useMutation({
    mutationFn: (payload: BlacklistFormValues) => blacklistApi.addToBlacklist(payload),
    onSuccess: () => { toast.success('Member blacklisted successfully'); setShowModal(false); qc.invalidateQueries({ queryKey: ['adminBlacklist'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => blacklistApi.removeFromBlacklist(id),
    onSuccess: () => { toast.success('Removed from blacklist'); qc.invalidateQueries({ queryKey: ['adminBlacklist'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => blacklistApi.toggleBlacklist(id),
    onSuccess: () => { toast.success('Blacklist status updated'); qc.invalidateQueries({ queryKey: ['adminBlacklist'] }); },
    onError: (err) => toast.error((err as Error).message),
  });

  const openAdd = useCallback(() => { setForm(EMPTY_BLACKLIST_FORM); setShowModal(true); }, [setForm, setShowModal]);

  const saveBlacklist = useCallback((data: BlacklistFormValues) => { addMutation.mutate(data); }, [addMutation]);

  const removeFromBlacklist = useCallback(async (id: string, name: string) => {
    const ok = await confirm({ title: 'Remove from Blacklist', message: `Remove ${name} from the blacklist? They will regain access to assigned gyms.`, confirmText: 'Remove', type: 'danger' });
    if (!ok) return;
    removeMutation.mutate(id);
  }, [confirm, removeMutation]);

  const toggleBlacklist = useCallback((id: string) => { toggleMutation.mutate(id); }, [toggleMutation]);

  return {
    members: paginated, allMembers: filtered, fetchState, kpis,
    showModal, setShowModal, form, openAdd, saveBlacklist,
    removeFromBlacklist, toggleBlacklist,
    saving: addMutation.isPending,
    currentPage, setCurrentPage, totalPages, totalItems: filtered.length,
  };
}
