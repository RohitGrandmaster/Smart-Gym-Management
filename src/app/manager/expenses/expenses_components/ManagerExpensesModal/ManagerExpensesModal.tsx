// RESPONSIBILITY: Renders the modal form for creating or editing an expense.
'use client';

import { useEffect } from 'react';
import { useExpensesContext } from '@/app/manager/expenses/expenses_context/ManagerExpensesContext';
import { ExpenseSchema, EXPENSE_CATEGORIES, EXPENSE_STATUS_LABELS, type ExpenseFormValues } from '@/app/manager/expenses/expenses_utils/ManagerExpensesSharedConstants';
import { X, Save } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export default function ManagerExpensesModal() {
  const { showModal, setShowModal, editId, editData, saveExpense, saving } = useExpensesContext();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: editData || { status: 'PAID', date: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    if (showModal && editData) reset(editData);
  }, [showModal, editData, reset]);

  const onSubmit = (data: ExpenseFormValues) => saveExpense(data);
  
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-visible border border-border max-h-full flex flex-col">
        <div className="sticky top-0 bg-card px-6 py-4 border-b border-border flex items-center justify-between z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-primary">{editId ? 'Edit Expense' : 'Add Expense'}</h3>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg transition-colors hover:bg-primary-subtle text-secondary"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 pb-32">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. October Electricity Bill"
                {...register('title')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                  errors.title ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                }`}
              />
              {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={EXPENSE_CATEGORIES.map(c => ({ label: c, value: c }))}
                    placeholder="Select Category..."
                  />
                )}
              />
              {errors.category && <p className="text-danger text-xs mt-1">{errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                    errors.amount ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
                {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                    errors.date ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
                {errors.date && <p className="text-danger text-xs mt-1">{errors.date.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors border-border focus-visible:ring-primary"
              >
                {Object.entries(EXPENSE_STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Reference / Invoice No. (Optional)</label>
              <input
                type="text"
                placeholder="e.g. INV-2023-001"
                {...register('referenceNo')}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors border-border focus-visible:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Receipt URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/receipt.jpg"
                {...register('receiptUrl')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors ${
                  errors.receiptUrl ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                }`}
              />
              {errors.receiptUrl && (
                <p className="text-danger text-xs mt-1">{errors.receiptUrl.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Any additional details..."
                {...register('notes')}
                className="w-full border rounded-xl px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-colors border-border focus-visible:ring-primary resize-none"
              />
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
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-white flex items-center justify-center gap-2 disabled:opacity-70 hover:bg-primary-hover transition-all duration-200 active:scale-95"
              >
                {saving
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                  : <><Save size={15} />{editId ? 'Update' : 'Save Expense'}</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
