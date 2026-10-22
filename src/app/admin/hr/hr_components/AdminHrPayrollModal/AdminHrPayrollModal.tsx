// RESPONSIBILITY: Form modal for creating a new payroll entry for a staff member in the HR module.
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { X, Check } from 'lucide-react';
import { useHrContext } from '@/app/admin/hr/hr_context/AdminHrContext';
import { PayrollSchema, type PayrollFormValues, EMPTY_PAYROLL_FORM } from '@/app/admin/hr/hr_utils/AdminHrSharedConstants';


export default function AdminHrPayrollModal() {
  const { showPayrollModal, setShowPayrollModal, savePayroll, saving, staff } = useHrContext();
  const [calculationInfo, setCalculationInfo] = React.useState('');

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<PayrollFormValues>({
    resolver: zodResolver(PayrollSchema),
    defaultValues: EMPTY_PAYROLL_FORM
  });

  const selectedStaffId = watch('staffId');
  const selectedMonth = watch('month');

  useEffect(() => {
    if (showPayrollModal) {
      reset(EMPTY_PAYROLL_FORM);
      setCalculationInfo('');
    }
  }, [showPayrollModal, reset]);

  useEffect(() => {
    const calculate = async () => {
      if (selectedStaffId && selectedMonth) {
        const s = staff.find(x => String(x.id) === String(selectedStaffId));
        if (s) {
          setValue('amount', s.salary || 0);
          setCalculationInfo('');
        }
      }
    };
    calculate();
  }, [selectedStaffId, selectedMonth, staff, setValue]);

  if (!showPayrollModal) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh] bg-card border-2 border-warning">
        
        <div className="flex items-center justify-between px-8 py-5 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            Disburse Payroll
          </h2>
          <button onClick={() => setShowPayrollModal(false)} className="p-2 rounded-full hover:bg-primary/10 transition-colors text-secondary hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <form id="payroll-form" onSubmit={handleSubmit((data) => savePayroll({ ...data, staffId: data.staffId }))} className="space-y-6">
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-secondary">Staff Member <span className="text-danger">*</span></label>
              <Controller
                name="staffId"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Select Staff"
                    options={staff.map(s => ({ label: `${s.name} (${s.role}) - ₹${s.salary}`, value: String(s.id) }))}
                  />
                )}
              />
              {errors.staffId && <p className="text-danger text-xs mt-1.5">{errors.staffId.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-secondary">Month <span className="text-danger">*</span></label>
              <input 
                type="month"
                {...register('month')}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground transition-all duration-200"
              />
              {errors.month && <p className="text-danger text-xs mt-1.5">{errors.month.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-secondary">Amount (₹) <span className="text-danger">*</span></label>
              <input 
                type="number" min="0" onKeyDown={(e) => { if (['e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }}
                {...register('amount', { valueAsNumber: true })}
                readOnly
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground cursor-not-allowed opacity-80"
              />
              <p className="text-xs text-secondary mt-1.5">
                {calculationInfo ? calculationInfo : "Amount is automatically set to the staff's base salary."}
              </p>
              {errors.amount && <p className="text-danger text-xs mt-1.5">{errors.amount.message as string}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-secondary">Notes</label>
              <textarea 
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 resize-none bg-input text-foreground"
                placeholder="Optional notes..."
              />
            </div>

          </form>
        </div>

        <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-card/50">
          <button 
            type="button" 
            onClick={() => setShowPayrollModal(false)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-border transition-colors text-secondary hover:bg-primary/5 hover:text-primary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="payroll-form"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-70 bg-primary"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" /> : <Check size={16} />}
            {saving ? 'Saving...' : 'Disburse Payroll'}
          </button>
        </div>

      </div>
    </div>
  );
}
