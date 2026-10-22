// RESPONSIBILITY: Renders the Edit Coupon modal form. Manages its own local form state via React Hook Form. No API calls — delegates save to onSubmit prop.
'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { CouponSchema, CouponFormData } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';
import type { Coupon } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';

interface SuperadminCouponEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<CouponFormData>) => void;
  coupon: Coupon | null;
}

export const SuperadminCouponEditModal: React.FC<SuperadminCouponEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  coupon,
}) => {
  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<CouponFormData>({
    resolver: zodResolver(CouponSchema),
  });

  useEffect(() => {
    if (isOpen && coupon) {
      reset({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUses: coupon.maxUses,
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
      });
    }
  }, [isOpen, coupon, reset]);

  if (!isOpen || !coupon) return null;

  const onFormSubmit = (data: CouponFormData) => {
    if (coupon) {
      onSubmit(coupon.id, data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-overlay border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Edit Coupon</h2>
          <button onClick={onClose} className="text-secondary hover:text-foreground motion-safe:transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col p-7 gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-secondary">Coupon Code <span className="text-danger">*</span></label>
            <input 
              {...register('code')}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground font-mono uppercase focus:outline-none focus:border-primary motion-safe:transition-colors"
              placeholder="e.g. SUMMER2026"
            />
            {errors.code && <span className="text-xs text-danger">{errors.code.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Discount Type <span className="text-danger">*</span></label>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={[
                      { label: 'Percentage (%)', value: 'PERCENTAGE' },
                      { label: 'Exact Amount (Rs)', value: 'EXACT' }
                    ]}
                  />
                )}
              />
              {errors.discountType && <span className="text-xs text-danger">{errors.discountType.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">
                {watch('discountType') === 'PERCENTAGE' ? 'Discount %' : 'Discount Amount'} <span className="text-danger">*</span>
              </label>
              <div className="relative">
                {watch('discountType') === 'EXACT' && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm font-semibold">Rs</span>
                )}
                <input 
                  type="number" 
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                  min="0"
                  {...register('discountValue', { valueAsNumber: true })}
                  className={`w-full ${watch('discountType') === 'EXACT' ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors`}
                  placeholder={watch('discountType') === 'PERCENTAGE' ? '25' : '500'}
                />
              </div>
              {errors.discountValue && <span className="text-xs text-danger">{errors.discountValue.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Max Uses <span className="text-danger">*</span></label>
              <input 
                type="number" 
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                min="0"
                {...register('maxUses', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
                placeholder="100"
              />
              {errors.maxUses && <span className="text-xs text-danger">{errors.maxUses.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-secondary">Expiry Date <span className="text-danger">*</span></label>
            <input 
              type="date" 
              {...register('expiryDate')}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
            />
            {errors.expiryDate && <span className="text-xs text-danger">{errors.expiryDate.message}</span>}
          </div>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
