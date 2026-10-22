// RESPONSIBILITY: Handles form validation, modal state, and API submission for editing a Gym.
// DATA FLOW: SuperadminGymEditModal -> useSuperadminGymEditModal -> API

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSuperadminGymsStore } from '@/app/superadmin/gyms/gyms_store/useSuperadminGymsStore';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';

const gymEditSchema = z.object({
  name: z.string().min(1, 'Gym Name is required'),
  ownerName: z.string().min(1, 'Owner Name is required'),
  adminEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  plan: z.string().min(1, 'Please select a plan'),
  temporaryPassword: z.string().optional().refine(val => !val || val.length >= 8, {
    message: "Password must be at least 8 characters",
  }),
});

type GymEditFormValues = z.infer<typeof gymEditSchema>;

export function useSuperadminGymEditModal() {
  const isEditModalOpen = useSuperadminGymsStore(state => state.isEditModalOpen);
  const closeEditModal = useSuperadminGymsStore(state => state.closeEditModal);
  const selectedGym = useSuperadminGymsStore(state => state.selectedGym);
  
  const queryClient = useQueryClient();

  const { data: fetchRes, isLoading: loadingPlans } = useQuery({
    queryKey: ['superadmin', 'plans'],
    queryFn: () => superadminApi.plans.fetchPlans(),
  });
  
  const plans = fetchRes?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<GymEditFormValues>({
    resolver: zodResolver(gymEditSchema),
  });

  useEffect(() => {
    if (selectedGym && isEditModalOpen) {
      reset({
        name: selectedGym.name,
        ownerName: selectedGym.ownerName,
        adminEmail: selectedGym.adminEmail,
        phone: selectedGym.phone,
        plan: selectedGym.plan,
        temporaryPassword: '',
      });
    }
  }, [selectedGym, isEditModalOpen, reset]);

  const editMutation = useMutation({
    mutationFn: (data: GymEditFormValues) => superadminApi.gyms.updateGym(selectedGym!.id, data),
    onSuccess: (res) => {
      toast.success(res.message || 'Gym details updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'gyms'] });
      closeEditModal();
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to update gym details.');
    }
  });

  const onSubmit = async (data: GymEditFormValues) => {
    if (selectedGym) {
      editMutation.mutate(data);
    }
  };

  return {
    isEditModalOpen,
    closeEditModal,
    selectedGym,
    plans,
    loadingPlans,
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    isDirty,
    isSubmitting: isSubmitting || editMutation.isPending,
  };
}
