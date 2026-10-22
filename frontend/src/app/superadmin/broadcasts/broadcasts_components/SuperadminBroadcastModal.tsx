// RESPONSIBILITY: Renders the Create/Edit Broadcast modal form. Receives form state via props from useSuperadminBroadcastsPage. No API calls.
'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { UseFormReturn, Controller } from 'react-hook-form';
import type { BroadcastFormData } from '@/app/superadmin/broadcasts/superadmin_broadcasts_types/superadmin_broadcasts_types';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useQuery } from '@tanstack/react-query';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import type { Tenant } from '@/app/superadmin/superadmin_types/superadmin_types';
import { MOCK_GYMS } from '@/app/superadmin/gyms/gyms_utils/SuperadminGymsConstants';

interface SuperadminBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<BroadcastFormData>;
  onSubmit: (data: BroadcastFormData) => void;
  isEditMode?: boolean;
}

export const SuperadminBroadcastModal: React.FC<SuperadminBroadcastModalProps> = ({
  isOpen,
  onClose,
  form,
  onSubmit,
  isEditMode = false,
}) => {

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const status = watch('status');
  const targetGymIds = watch('targetGymIds') || [];

  const { data: fetchRes, isLoading } = useQuery({
    queryKey: ['superadmin', 'gyms'],
    queryFn: () => superadminApi.gyms.fetchGyms(),
    enabled: isOpen,
  });

  const rawGyms = (fetchRes?.data as Tenant[]) ?? [];
  const gyms = rawGyms.length > 0 ? rawGyms : MOCK_GYMS;

  const allGymIds = gyms.map((g: Tenant) => g.id) || [];
  const isAllSelected = allGymIds.length > 0 && targetGymIds.length === allGymIds.length;

  if (!isOpen) return null;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setValue('targetGymIds', [], { shouldValidate: true });
    } else {
      setValue('targetGymIds', allGymIds, { shouldValidate: true });
    }
  };

  const handleToggleGym = (id: string) => {
    if (targetGymIds?.includes(id)) {
      setValue('targetGymIds', targetGymIds.filter((g: string) => g !== id), { shouldValidate: true });
    } else {
      setValue('targetGymIds', [...targetGymIds, id], { shouldValidate: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-overlay border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{isEditMode ? 'Edit Broadcast' : 'New Broadcast'}</h2>
          <button onClick={onClose} className="text-secondary hover:text-foreground motion-safe:transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-7 gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-secondary">Broadcast Title <span className="text-danger">*</span></label>
            <input 
              {...register('title')}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
              placeholder="e.g. Scheduled Maintenance"
            />
            {errors.title && <span className="text-xs text-danger">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-secondary">Message Content <span className="text-danger">*</span></label>
            <textarea 
              {...register('content')}
              rows={4}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors resize-none"
              placeholder="Write your announcement here..."
            />
            {errors.content && <span className="text-xs text-danger">{errors.content.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-secondary">Select Target Gyms <span className="text-danger">*</span></label>
                <button 
                  type="button" 
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  {isAllSelected ? 'Deselect All' : 'Select All Gyms'}
                </button>
              </div>
              <div className="bg-input border border-border rounded-xl max-h-40 overflow-y-auto custom-scrollbar p-2 grid grid-cols-2 gap-2">
                {isLoading ? (
                  <div className="col-span-2 flex justify-center py-4 text-primary"><Loader2 className="w-5 h-5 motion-safe:animate-spin" /></div>
                ) : gyms?.map((gym: Tenant) => (
                  <label key={gym.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-overlay rounded-lg motion-safe:transition-colors border border-transparent hover:border-border">
                    <input 
                      type="checkbox" 
                      checked={targetGymIds?.includes(gym.id)}
                      onChange={() => handleToggleGym(gym.id)}
                      className="w-4 h-4 rounded text-primary focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page accent-primary"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-foreground truncate">{gym.name}</span>
                      <span className="text-xs text-secondary truncate">{gym.ownerName}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.targetGymIds && <span className="text-xs text-danger">{errors.targetGymIds.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm font-bold text-secondary">Status <span className="text-danger">*</span></label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={[
                      { label: 'Draft', value: 'DRAFT' },
                      { label: 'Scheduled', value: 'SCHEDULED' },
                      { label: 'Send Now', value: 'SENT' }
                    ]}
                  />
                )}
              />
              {errors.status && <span className="text-xs text-danger">{errors.status.message}</span>}
            </div>
          </div>

          {status === 'SCHEDULED' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Scheduled Date & Time <span className="text-danger">*</span></label>
              <input 
                type="datetime-local" 
                {...register('scheduledDate')}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
              />
              {errors.scheduledDate && <span className="text-xs text-danger">{errors.scheduledDate.message}</span>}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-2 pt-5 border-t border-border">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent border border-border hover:bg-border text-foreground font-medium rounded-lg motion-safe:transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg motion-safe:transition-colors text-sm"
            >
              Save Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
