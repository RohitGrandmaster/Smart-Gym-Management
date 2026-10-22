// RESPONSIBILITY: Renders the modal form for creating or editing a membership plan. Uses React Hook Form + Zod validation.
'use client';

import { useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { useAdminPlansLogic } from '@/app/admin/plans/plans_context/useAdminPlansLogic';
import { useAdminPlansStore } from '@/app/admin/plans/plans_store/useAdminPlansStore';
import { TIERS, PlanSchema, type PlanFormValues, EMPTY_PLAN_FORM } from '@/app/admin/plans/plans_utils/AdminPlansSharedConstants';

export default function AdminPlansModal() {
  const { plans, fetchState, saving, search, setSearch, currentPage, setCurrentPage, loadPlans, openAdd, openEdit, savePlan, deletePlan } = useAdminPlansLogic();
  const { showModal, setShowModal, editId, form, setForm, toast, showToast, hideToast } = useAdminPlansStore();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PlanFormValues>({
    resolver: zodResolver(PlanSchema),
    defaultValues: form || EMPTY_PLAN_FORM,
  });

  // Sync form values when modal opens with new data
  useEffect(() => {
    if (showModal) reset(form);
  }, [showModal, form, reset]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg max-h-full overflow-y-auto border border-border">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">
            {editId ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg hover:bg-primary-subtle text-secondary transition-all duration-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(savePlan)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Plan Name</label>
              <input
                type="text"
                placeholder="e.g. Gold Plan"
                {...register('name')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                  errors.name ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                }`}
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Tier</label>
              <Controller
                name="tier"
                control={control}
                render={({ field }) => (
                  <div className={editId ? 'opacity-70 pointer-events-none' : ''}>
                    <AdminSearchableDropdown
                      value={field.value || ''}
                      onChange={field.onChange}
                      options={TIERS.map(t => ({ label: t, value: t }))}
                      placeholder={editId ? 'Tier (Fixed)' : undefined}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: '1 Month Price (₹)',    key: 'price1Month'  },
              { label: '3 Months Price (₹)',   key: 'price3Month'  },
              { label: '6 Months Price (₹)',   key: 'price6Month'  },
              { label: '12 Months Price (₹)',  key: 'price12Month' },
              { label: 'Custom Price / Day (₹)', key: 'priceCustom' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-secondary mb-1">{f.label}</label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                  {...register(f.key as keyof PlanFormValues)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                    errors[f.key as keyof PlanFormValues] ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
                {errors[f.key as keyof PlanFormValues] && (
                  <p className="text-danger text-xs mt-1">{errors[f.key as keyof PlanFormValues]?.message}</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Features (one per line)</label>
            <textarea
              rows={5}
              placeholder={"Gym Access (6am - 10pm)\nLocker Access\nFitness Assessment"}
              {...register('features')}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 resize-none bg-input text-primary transition-colors ${
                errors.features ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
              }`}
            />
            {errors.features && <p className="text-danger text-xs mt-1">{errors.features.message}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-primary hover:bg-primary-subtle transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-200 active:scale-95"
            >
              {saving
                ? <Loader2 className="w-4 h-4 motion-safe:animate-spin" />
                : <><Save size={15} />{editId ? 'Update' : 'Create Plan'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



