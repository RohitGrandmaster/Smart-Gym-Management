// RESPONSIBILITY: Renders the create/edit coupon modal with full form validation via React Hook Form + Zod.
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useAdminCouponsLogic } from '@/app/admin/coupons/coupons_context/useAdminCouponsLogic';
import { CouponSchema, COUPON_TYPE_OPTIONS, GYM_OPTIONS } from '@/app/admin/coupons/coupons_utils/AdminCouponsSharedConstants';
import type { CouponFormValues } from '@/app/admin/coupons/coupons_types/coupons_types';

export default function AdminCouponsModal() {
  const { showModal, setShowModal, editId, form, saveCoupon, saving } = useAdminCouponsLogic();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CouponFormValues>({
    resolver: zodResolver(CouponSchema),
    defaultValues: form,
  });

  // Sync external form state into RHF when modal opens
  useEffect(() => { if (showModal) reset(form); }, [showModal, form, reset]);

  const selectedGyms = watch('assignedGyms') ?? [];

  const toggleGym = (val: string) => {
    if (val === 'all') { setValue('assignedGyms', ['all']); return; }
    const current = selectedGyms.filter(g => g !== 'all');
    if (current.includes(val)) {
      const next = current.filter(g => g !== val);
      setValue('assignedGyms', next.length ? next : ['all']);
    } else {
      setValue('assignedGyms', [...current, val]);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
      <div className="relative bg-overlay border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-overlay z-10">
          <h2 className="text-lg font-bold text-foreground">{editId ? 'Edit Coupon' : 'Create Coupon'}</h2>
          <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-input text-secondary hover:text-foreground motion-safe:transition-colors" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(saveCoupon)} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Coupon Code <span className="text-danger">*</span></label>
            <input {...register('code')} placeholder="e.g. WELCOME20" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground uppercase placeholder:normal-case placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            {errors.code && <p className="text-xs text-danger mt-1">{errors.code.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Description <span className="text-danger">*</span></label>
            <input {...register('description')} placeholder="Short description of this coupon" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Discount Type <span className="text-danger">*</span></label>
              <select {...register('type')} className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {COUPON_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Value <span className="text-danger">*</span></label>
              <input {...register('value')} type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} placeholder="e.g. 20" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.value && <p className="text-xs text-danger mt-1">{errors.value.message}</p>}
            </div>
          </div>

          {/* Min Order + Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Min Order (₹)</label>
              <input {...register('minOrderAmount')} type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} placeholder="0" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Max Discount (₹)</label>
              <input {...register('maxDiscount')} type="number" min="0" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} placeholder="0 = unlimited" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Usage Limit <span className="text-danger">*</span></label>
            <input {...register('usageLimit')} type="number" min="1" onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }} placeholder="e.g. 100" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
            {errors.usageLimit && <p className="text-xs text-danger mt-1">{errors.usageLimit.message}</p>}
          </div>

          {/* Assign Gyms */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Assign to Gyms <span className="text-danger">*</span></label>
            <div className="flex flex-wrap gap-2">
              {GYM_OPTIONS.map(opt => {
                const isSelected = selectedGyms.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleGym(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border motion-safe:transition-all ${isSelected ? 'bg-primary-subtle text-primary border-primary' : 'bg-input text-secondary border-border hover:border-primary'}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.assignedGyms && <p className="text-xs text-danger mt-1">{errors.assignedGyms.message}</p>}
          </div>

          {/* Valid From / Until */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Valid From <span className="text-danger">*</span></label>
              <input {...register('validFrom')} type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.validFrom && <p className="text-xs text-danger mt-1">{errors.validFrom.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Valid Until <span className="text-danger">*</span></label>
              <input {...register('validUntil')} type="date" className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
              {errors.validUntil && <p className="text-xs text-danger mt-1">{errors.validUntil.message}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-input border border-border rounded-lg text-sm font-medium text-secondary hover:text-foreground motion-safe:transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-black rounded-lg text-sm font-semibold hover:bg-primary-hover motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-95">
              {saving ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
