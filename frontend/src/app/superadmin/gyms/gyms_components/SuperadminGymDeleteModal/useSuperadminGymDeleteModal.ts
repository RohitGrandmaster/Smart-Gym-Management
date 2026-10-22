// RESPONSIBILITY: Hook to manage the state and logic of the SuperadminGymDeleteModal.
// DATA FLOW: SuperadminGymDeleteModal -> useSuperadminGymDeleteModal -> API

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSuperadminGymsStore } from '@/app/superadmin/gyms/gyms_store/useSuperadminGymsStore';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';

export function useSuperadminGymDeleteModal() {
  const isDeleteModalOpen = useSuperadminGymsStore(state => state.isDeleteModalOpen);
  const closeDeleteModal = useSuperadminGymsStore(state => state.closeDeleteModal);
  const gymToDelete = useSuperadminGymsStore(state => state.gymToDelete);
  
  const queryClient = useQueryClient();

  const [confirmText, setConfirmText] = useState('');

  // Reset confirmation text whenever the modal opens or closes
  useEffect(() => {
    if (!isDeleteModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmText('');
    }
  }, [isDeleteModalOpen]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superadminApi.gyms.deleteGym(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Tenant deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] });
      closeDeleteModal();
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to delete tenant');
    }
  });

  const handleConfirmDelete = () => {
    if (confirmText === 'DELETE' && gymToDelete) {
      deleteMutation.mutate(gymToDelete.id);
    }
  };

  return {
    isDeleteModalOpen,
    closeDeleteModal,
    gymToDelete,
    confirmText,
    setConfirmText,
    handleConfirmDelete,
    actionLoadingId: deleteMutation.isPending ? gymToDelete?.id : null
  };
}
