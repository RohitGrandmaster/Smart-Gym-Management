// RESPONSIBILITY: Provides the implementation for AdminFinanceAddPaymentModal.tsx functionality within its module.
'use client';

import { useState, useEffect } from 'react';
import { useAdminFinanceLogic } from '@/app/admin/finance/finance_context/useAdminFinanceLogic';
import { useAdminFinanceStore } from '@/app/admin/finance/finance_store/useAdminFinanceStore';
import { FINANCE_PAYMENT_METHODS, AddPaymentSchema, type AddPaymentFormValues, EMPTY_PAYMENT_FORM } from '@/app/admin/finance/finance_utils/AdminFinanceSharedConstants';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';

export default function AdminFinanceAddPaymentModal() {
  const { payments, summary, totalPayments, fetchState, saving, error, loadAll, search, setSearch, currentPage, setCurrentPage, savePayment, methodFilter, setMethodFilter } = useAdminFinanceLogic();
  const { showModal, setShowModal, toast, showToast, hideToast } = useAdminFinanceStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<AddPaymentFormValues>({
    resolver: zodResolver(AddPaymentSchema),
    defaultValues: EMPTY_PAYMENT_FORM
  });

  useEffect(() => {
    if (showModal) {
      reset(EMPTY_PAYMENT_FORM);
    }
  }, [showModal, reset]);

  if (!showModal) return null;

  const handleAddPayment = async (data: AddPaymentFormValues) => {
    await savePayment(data);
    reset(EMPTY_PAYMENT_FORM);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60">
      <div className="rounded-2xl shadow-xl w-full max-w-md bg-card border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Record Payment</h3>
          <button 
            type="button"
            onClick={() => setShowModal(false)} 
            className="p-1.5 rounded-full hover:bg-primary/5 transition-colors text-secondary"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(handleAddPayment)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-secondary">Member ID</label>
            <input
              type="text"
              placeholder="Enter Member ID (e.g. m123)"
              {...register('memberId')}
              className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-primary ${errors.memberId ? 'border-danger' : 'border-border'}`}
            />
            {errors.memberId && <p className="text-danger text-xs mt-1">{errors.memberId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-secondary">Amount (₹)</label>
            <input
              type="number"
              placeholder="2500"
              min="0"
              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
              {...register('amount')}
              className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-primary ${errors.amount ? 'border-danger' : 'border-border'}`}
            />
            {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-secondary">Payment Method</label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <AdminSearchableDropdown
                  options={FINANCE_PAYMENT_METHODS.map(m => ({ label: m, value: m }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Method..."
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-secondary">Notes (optional)</label>
            <input 
              type="text" 
              placeholder="Any notes..." 
              {...register('notes')}
              className="w-full px-4 py-2 border border-border rounded-xl text-sm appearance-none bg-input text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-border text-secondary hover:bg-primary/5 transition-colors flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-32 flex-1">
              {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin" /> : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



