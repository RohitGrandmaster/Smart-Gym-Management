'use client';
// RESPONSIBILITY: Renders the modal form for editing an existing subscription plan. Reads/writes via useSuperadminPlansStore.

import { useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler, Resolver } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSuperadminPlansStore } from '@/app/superadmin/plans/plans_store/useSuperadminPlansStore';
import { superadminApi } from '@/app/superadmin/superadmin_api/superadmin_api';
import { useWarnIfUnsavedChanges } from '@/app/superadmin/superadmin_utils/useWarnIfUnsavedChanges';
import type { CreatePlanPayload, UpdatePlanPayload } from '@/app/superadmin/superadmin_types/superadmin_types';

const planSchema = z.object({
  name: z.string().min(1, 'Plan Name is required'),
  priceMonthly: z.coerce.number().min(0),
  priceAnnual: z.coerce.number().min(0),
  maxMembers: z.coerce.number().min(1),
  maxStaff: z.coerce.number().min(1),
  dbLimitGb: z.coerce.number().min(0),
  binaryLimitGb: z.coerce.number().min(0),
  features: z.array(z.object({ value: z.string().min(1, 'Feature cannot be empty') })).min(1),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function SuperadminPlanEditModal() {
  const isOpen = useSuperadminPlansStore(state => state.isEditModalOpen);
  const closeEditModal = useSuperadminPlansStore(state => state.closeEditModal);
  const selectedPlan = useSuperadminPlansStore(state => state.selectedPlan);

  const queryClient = useQueryClient();

  const { register, control, handleSubmit, formState: { errors, isDirty }, reset } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as unknown as Resolver<PlanFormValues>,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'features' });

  // Populate form when selectedPlan changes
  useEffect(() => {
    if (selectedPlan && isOpen) {
      reset({
        name: selectedPlan.name,
        priceMonthly: selectedPlan.priceMonthly,
        priceAnnual: selectedPlan.priceAnnual,
        maxMembers: selectedPlan.maxMembers,
        maxStaff: selectedPlan.maxStaff,
        dbLimitGb: selectedPlan.dbLimitGb ?? 1.0,
        binaryLimitGb: selectedPlan.binaryLimitGb ?? 10.0,
        features: selectedPlan.features?.length > 0
          ? selectedPlan.features.map(f => ({ value: f }))
          : [{ value: 'Core Gym Management' }],
      });
    }
  }, [selectedPlan, isOpen, reset]);

  const editMutation = useMutation({
    mutationFn: (data: UpdatePlanPayload) => superadminApi.plans.updatePlan(selectedPlan!.id, data),
    onSuccess: (res) => {
      toast.success(res.message || 'Plan updated successfully');
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'plans'] });
      closeEditModal();
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message || 'Failed to update plan');
    }
  });

  const isSubmitting = editMutation.isPending;

  if (!isOpen || !selectedPlan) return null;

  const onSubmit: SubmitHandler<PlanFormValues> = async (data) => {
    editMutation.mutate({ ...data, features: data.features.map(f => f.value) });
  };

    useWarnIfUnsavedChanges(isDirty);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-overlay border border-border rounded-2xl w-full max-w-2xl max-h-screen overflow-hidden flex flex-col shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Edit Subscription Plan</h2>
          <button onClick={closeEditModal} className="p-2 hover:bg-input rounded-full motion-safe:transition-colors text-secondary" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary">Plan Name <span className="text-danger">*</span></label>
            <input {...register('name')} placeholder="e.g. Pro Tier" className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none motion-safe:transition-colors" />
            {errors.name && <p className="text-danger text-xs">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(['priceMonthly', 'priceAnnual'] as const).map(field => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-secondary">{field === 'priceMonthly' ? 'Monthly Price (â‚¹)' : 'Annual Price (â‚¹)'} <span className="text-danger">*</span></label>
                <input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} step="0.01" {...register(field, { valueAsNumber: true })} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none motion-safe:transition-colors" />
                {errors[field] && <p className="text-danger text-xs">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(['maxMembers', 'maxStaff'] as const).map(field => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-secondary">{field === 'maxMembers' ? 'Max Members' : 'Max Staff'} <span className="text-danger">*</span></label>
                <input type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} {...register(field, { valueAsNumber: true })} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none motion-safe:transition-colors" />
                {errors[field] && <p className="text-danger text-xs">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(['dbLimitGb', 'binaryLimitGb'] as const).map(field => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-secondary">{field === 'dbLimitGb' ? 'DB Limit (GB)' : 'Binary Limit (GB)'} <span className="text-danger">*</span></label>
                <input type="number" min="0" step="0.1" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }} {...register(field, { valueAsNumber: true })} className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none motion-safe:transition-colors" />
                {errors[field] && <p className="text-danger text-xs">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-secondary">Features List <span className="text-danger">*</span></label>
              <button type="button" onClick={() => append({ value: '' })} className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium">
                <Plus size={16} /> Add Feature
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-center gap-2">
                <input {...register(`features.${index}.value`)} placeholder="e.g. Advanced Analytics" className="flex-1 bg-input border border-border rounded-xl px-4 py-2.5 text-foreground focus:border-primary outline-none motion-safe:transition-colors" />
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="p-2.5 text-secondary hover:text-danger hover:bg-danger/10 rounded-xl motion-safe:transition-colors" aria-label="Remove feature">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </form>

        <div className="p-6 border-t border-border bg-sidebar flex justify-end gap-3">
          <button type="button" onClick={closeEditModal} className="px-6 py-2.5 rounded-xl font-medium text-secondary hover:bg-input motion-safe:transition-colors">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-medium bg-primary text-white hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50 flex items-center gap-2 motion-safe:active:scale-95">
            {isSubmitting ? <><Loader2 size={16} className="motion-safe:animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}





