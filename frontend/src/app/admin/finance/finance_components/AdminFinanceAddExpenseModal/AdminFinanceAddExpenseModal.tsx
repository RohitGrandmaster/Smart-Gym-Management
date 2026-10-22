// RESPONSIBILITY: Modal form for adding a new expense entry. Uses React Hook Form + Zod.
'use client';

import { X, Save, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { AdminSearchableDropdown } from '@/app/admin/admin_components/AdminShared/AdminSearchableDropdown';
import { useAdminBranchesData } from '@/app/admin/admin_store/useAdminBranchesData';
import { AddExpenseSchema, type AddExpenseFormValues, EMPTY_EXPENSE_FORM, EXPENSE_CATEGORIES } from '@/app/admin/finance/finance_utils/AdminFinanceSharedConstants';
import type { Branch } from '@/app/admin/admin_store/useAdminGlobalStore';

interface AdminFinanceAddExpenseModalProps {
  onClose: () => void;
}

export default function AdminFinanceAddExpenseModal({ onClose }: AdminFinanceAddExpenseModalProps) {
  const [saving, setSaving] = useState(false);
  const { data: branches = [] } = useAdminBranchesData();

  const { register, handleSubmit, control, formState: { errors } } = useForm<AddExpenseFormValues>({
    resolver: zodResolver(AddExpenseSchema),
    defaultValues: EMPTY_EXPENSE_FORM,
  });

  const onSubmit = async (_data: AddExpenseFormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onClose();
  };

  const branchOptions = (branches as Branch[]).map((b) => ({ value: b.id, label: b.name }));
  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-overlay rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-bold text-primary">Add Expense</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-primary-subtle text-secondary motion-safe:transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Amount (₹) <span className="text-danger">*</span></label>
              <input
                type="number" min="0"
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                placeholder="0"
                {...register('amount')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 ${errors.amount ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'}`}
              />
              {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Date <span className="text-danger">*</span></label>
              <input
                type="date"
                {...register('date')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 ${errors.date ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'}`}
              />
              {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Category <span className="text-danger">*</span></label>
            <Controller name="category" control={control} render={({ field }) => (
              <AdminSearchableDropdown options={categoryOptions} value={field.value} onChange={field.onChange} placeholder="Select category" />
            )} />
            {errors.category && <p className="text-danger text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Branch <span className="text-danger">*</span></label>
            <Controller name="branchId" control={control} render={({ field }) => (
              <AdminSearchableDropdown options={branchOptions} value={field.value} onChange={field.onChange} placeholder="Select branch" />
            )} />
            {errors.branchId && <p className="text-danger text-xs mt-1">{errors.branchId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">Notes</label>
            <textarea rows={2} placeholder="Optional notes..." {...register('notes')}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-input text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-primary-subtle motion-safe:transition-all active:scale-95">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-70 motion-safe:transition-all active:scale-95">
              {saving ? <Loader2 size={15} className="motion-safe:animate-spin" /> : <><Save size={15} /> Save Expense</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
