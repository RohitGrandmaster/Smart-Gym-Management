'use client';
// RESPONSIBILITY: Renders the modal UI for editing Gym details. Purely a view component.

import React from 'react';
import { Controller } from 'react-hook-form';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { X, Eye, EyeOff } from 'lucide-react';
import { useSuperadminGymEditModal } from '@/app/superadmin/gyms/gyms_components/SuperadminGymEditModal/useSuperadminGymEditModal';
import { useWarnIfUnsavedChanges } from '@/app/superadmin/superadmin_utils/useWarnIfUnsavedChanges';

export default function SuperadminGymEditModal() {
  const {
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
    isSubmitting,
  } = useSuperadminGymEditModal();

  useWarnIfUnsavedChanges(isDirty);

  const [showPassword, setShowPassword] = React.useState(false);

  if (!isEditModalOpen || !selectedGym) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-overlay rounded-2xl p-7 max-w-md w-full border border-border shadow-2xl relative">
        <button
          onClick={closeEditModal}
          className="absolute top-5 right-5 text-secondary hover:text-foreground motion-safe:transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-foreground mb-1">Edit Gym Details</h2>
        <p className="text-sm text-secondary mb-6">Update the information for {selectedGym.name}.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Gym Name <span className="text-danger">*</span></label>
            <input
              type="text"
              {...register('name')}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors"
            />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Owner Name <span className="text-danger">*</span></label>
            <input
              type="text"
              {...register('ownerName')}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors"
            />
            {errors.ownerName && <p className="text-xs text-danger mt-1">{errors.ownerName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Admin Email <span className="text-danger">*</span></label>
            <input
              type="email"
              {...register('adminEmail')}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors"
            />
            {errors.adminEmail && <p className="text-xs text-danger mt-1">{errors.adminEmail.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Phone Number <span className="text-danger">*</span></label>
            <input
              type="text"
              {...register('phone')}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors"
              placeholder="+1 555-0000"
            />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Reset Password <span className="font-normal">(Optional)</span></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('temporaryPassword')}
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none motion-safe:transition-colors pr-10"
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground motion-safe:transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.temporaryPassword && <p className="text-xs text-danger mt-1">{errors.temporaryPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-secondary mb-1">Subscription Plan <span className="text-danger">*</span></label>
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  value={field.value || ''}
                  onChange={field.onChange}
                  options={plans ? plans.map(p => ({ label: `${p.name} ($${Number(p.priceMonthly).toFixed(2)}/mo)`, value: p.name })) : []}
                  disabled={loadingPlans}
                  placeholder={loadingPlans ? "Loading plans..." : "Select a plan"}
                />
              )}
            />
            {errors.plan && <p className="text-xs text-danger mt-1">{errors.plan.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-foreground border border-border hover:bg-background motion-safe:transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
