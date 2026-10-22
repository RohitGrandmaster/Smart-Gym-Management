// RESPONSIBILITY: Renders the Create Coupon modal form. Receives form state via props from useCouponsPage. No API calls.
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { UseFormReturn, Controller } from 'react-hook-form';
import type { CouponFormData } from '@/app/superadmin/coupons/superadmin_coupons_types/superadmin_coupons_types';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

interface SuperadminCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<CouponFormData>;
  onSubmit: (data: CouponFormData) => void;
}

export const SuperadminCouponModal: React.FC<SuperadminCouponModalProps> = ({
  isOpen,
  onClose,
  form,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-overlay border border-border rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Create Global Coupon</h2>
          <button onClick={onClose} className="text-secondary hover:text-foreground motion-safe:transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col p-7 gap-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-secondary">Coupon Code <span className="text-disabled font-normal ml-1">(Optional)</span></label>
            <input 
              {...form.register('code', {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                }
              })}
              className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground font-mono uppercase focus:outline-none focus:border-primary motion-safe:transition-colors"
              placeholder="Leave blank to auto-generate"
            />
            {form.formState.errors.code && <span className="text-xs text-danger">{form.formState.errors.code.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Discount Type <span className="text-danger">*</span></label>
              <Controller
                name="discountType"
                control={form.control}
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
              {form.formState.errors.discountType && <span className="text-xs text-danger">{form.formState.errors.discountType.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">
                {form.watch('discountType') === 'PERCENTAGE' ? 'Discount %' : 'Discount Amount'} <span className="text-danger">*</span>
              </label>
              <div className="relative">
                {form.watch('discountType') === 'EXACT' && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-sm font-semibold">Rs</span>
                )}
                <input 
                  type="number" 
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                  min="0"
                  {...form.register('discountValue', { valueAsNumber: true })}
                  className={`w-full ${form.watch('discountType') === 'EXACT' ? 'pl-9 pr-4' : 'px-4'} py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors`}
                  placeholder={form.watch('discountType') === 'PERCENTAGE' ? '25' : '500'}
                />
              </div>
              {form.formState.errors.discountValue && <span className="text-xs text-danger">{form.formState.errors.discountValue.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Max Uses <span className="text-danger">*</span></label>
              <input 
                type="number" 
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                min="0"
                {...form.register('maxUses', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
                placeholder="100"
              />
              {form.formState.errors.maxUses && <span className="text-xs text-danger">{form.formState.errors.maxUses.message}</span>}
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-secondary">Expiry Date <span className="text-danger">*</span></label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                {...form.register('expiryDate')}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary motion-safe:transition-colors"
              />
              {form.formState.errors.expiryDate && <span className="text-xs text-danger">{form.formState.errors.expiryDate.message}</span>}
            </div>
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
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
