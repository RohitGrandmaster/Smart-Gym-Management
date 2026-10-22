// RESPONSIBILITY: Provides the logic and state for the SuperadminGymsTable component using TanStack Query.
// DATA FLOW: superadminApi -> useQuery -> useSuperadminGymsTable -> SuperadminGymsTable

import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { useSuperadminGymsStore } from '@/app/superadmin/gyms/gyms_store/useSuperadminGymsStore';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';

import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';

export function useSuperadminGymsTable() {
  const search = useSuperadminGymsStore(state => state.search);
  const statusFilter = useSuperadminGymsStore(state => state.statusFilter);
  const openDeleteModal = useSuperadminGymsStore(state => state.openDeleteModal);
  const openEditModal = useSuperadminGymsStore(state => state.openEditModal);
  const openWhatsappModal = useSuperadminGymsStore(state => state.openWhatsappModal);

  const queryClient = useQueryClient();

  // Fetch Gyms
  const { data: fetchRes, isLoading, isError } = useQuery({
    queryKey: ['superadmin', 'gyms'],
    queryFn: () => superadminApi.gyms.fetchGyms(),
  });

  const gyms = fetchRes?.data && fetchRes.data.length > 0 ? fetchRes.data : MOCK_GYMS;
  const fetchState = isLoading ? 'loading' : isError ? 'error' : 'success';

  // Fallback Client-side filter
  const filteredGyms = useMemo(() => {
    if (!gyms) return [];
    
    let result = gyms;
    
    if (statusFilter && statusFilter !== 'All') {
      result = result.filter(g => g.status === statusFilter);
    }
    
    if (search) {
      result = result.filter(g =>
        g.name?.toLowerCase().includes(search.toLowerCase()) ||
        g.ownerName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return result;
  }, [gyms, search, statusFilter]);

  // Mutations
  const impersonateMutation = useMutation({
    mutationFn: (id: string) => superadminApi.gyms.impersonateTenant(id),
    onSuccess: async (res, id) => {
      if (res.success && res.data?.token) {
        toast.success(res.message || 'Impersonating tenant...');
        
        // Save token to localStorage as backup
        localStorage.setItem('gymsmart_impersonate_token', res.data.token);
        
        // Overwrite the HTTP-only session cookie so Next.js middleware and proxy API see an Admin session
        try {
          await fetch(AuthUrlConfig.PROXY_API.SET_COOKIE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              token: res.data.token, 
              refreshToken: res.data.token, 
              user: { role: 'ADMIN', email: `admin-${id}@gym.com`, name: `Impersonated Admin`, tenantId: id, id: `user-${id}` } 
            }),
          });
        } catch (e) {
          console.error('Failed to set impersonation cookie', e);
        }

        window.location.href = AuthUrlConfig.PAGES.ADMIN_DASHBOARD;
      } else {
        toast.error(res.message || 'Failed to impersonate tenant');
      }
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || 'Failed to impersonate tenant');
    },
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => superadminApi.gyms.changeGymStatus(id, status),
    onSuccess: (res) => {
      toast.success(res.message || 'Status updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] });
    },
    onError: (err: unknown) => {
      const error = err as Error;
      toast.error(error.message || 'Failed to update status');
    },
  });

  const actionLoadingId = impersonateMutation.isPending 
    ? impersonateMutation.variables 
    : suspendMutation.isPending 
      ? suspendMutation.variables?.id 
      : null;

  const handleRowClick = (gym: Tenant) => {
    openEditModal(gym);
  };

  const onGhostLoginClick = (e: React.MouseEvent, gymId: string, gymName: string) => {
    e.stopPropagation();
    impersonateMutation.mutate(gymId);
  };

  const onSuspendClick = (e: React.MouseEvent, gymId: string, gymName: string, currentStatus: string) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    suspendMutation.mutate({ id: gymId, status: newStatus });
  };

  const onDeleteClick = (e: React.MouseEvent, gym: Tenant) => {
    e.stopPropagation();
    openDeleteModal(gym);
  };

  return {
    filteredGyms,
    fetchState,
    error: isError ? 'Error loading gyms' : null,
    actionLoadingId,
    handleRowClick,
    onGhostLoginClick,
    onSuspendClick,
    onDeleteClick,
    openEditModal,
    openWhatsappModal,
  };
}
