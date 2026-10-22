// RESPONSIBILITY: Handles form validation, modal state, and API submission for sending a WhatsApp message to a Gym owner.
// DATA FLOW: SuperadminGymWhatsappModal -> useSuperadminGymWhatsappModal -> API

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSuperadminGymsStore } from '@/app/superadmin/gyms/gyms_store/useSuperadminGymsStore';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { WhatsAppFormatter } from '@/lib/whatsapp_formatter';

const gymWhatsappSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type GymWhatsappFormValues = z.infer<typeof gymWhatsappSchema>;

export function useSuperadminGymWhatsappModal() {
  const isWhatsappModalOpen = useSuperadminGymsStore(state => state.isWhatsappModalOpen);
  const closeWhatsappModal = useSuperadminGymsStore(state => state.closeWhatsappModal);
  const selectedGym = useSuperadminGymsStore(state => state.selectedGym);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GymWhatsappFormValues>({
    resolver: zodResolver(gymWhatsappSchema),
  });

  useEffect(() => {
    if (isWhatsappModalOpen) {
      reset({ subject: '', message: '' });
    }
  }, [isWhatsappModalOpen, reset]);

  const whatsappMutation = useMutation({
    mutationFn: (data: GymWhatsappFormValues & { phone: string; ownerName: string; gymName: string }) => 
      superadminApi.gyms.emailGymOwner(selectedGym!.id, data), // Still calling API for record keeping if necessary, or just skip
    onSuccess: (res, data) => {
      if (data.phone) {
        const cleanPhone = String(data.phone).replace(/\D/g, '');
        const dateStr = new Intl.DateTimeFormat('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }).format(new Date());

        const waText = WhatsAppFormatter.formatReceipt({
          title: 'Smart Gym 360',
          subtitle: String(data.subject),
          date: dateStr,
          customerInfo: {
            Owner: String(data.ownerName || 'Gym Owner'),
            Gym: String(data.gymName || 'Gym')
          },
          sections: [
            {
              title: 'Message',
              items: {
                'Content': String(data.message)
              }
            }
          ],
          footer: 'Powered by Smart Gym 360'
        });
        
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`, '_blank');
      }

      toast.success(res.message || 'WhatsApp opened successfully.');
      closeWhatsappModal();
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to send WhatsApp message.');
    }
  });

  const onSubmit = async (data: GymWhatsappFormValues) => {
    if (selectedGym) {
      whatsappMutation.mutate({ 
        ...data, 
        phone: selectedGym.phone,
        ownerName: selectedGym.ownerName,
        gymName: selectedGym.name
      });
    }
  };

  return {
    isWhatsappModalOpen,
    closeWhatsappModal,
    selectedGym,
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isSubmitting || whatsappMutation.isPending,
  };
}
