// RESPONSIBILITY: Form modal for creating a new payroll entry for a staff member in the HR module.
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { X, Check } from 'lucide-react';
import { useHrContext } from '@/app/manager/hr/hr_context/ManagerHrContext';
import { PayrollSchema, type PayrollFormValues, EMPTY_PAYROLL_FORM } from '@/app/manager/hr/hr_utils/ManagerHrSharedConstants';
import { attendanceApi } from '@/app/manager/attendance/attendance_api/ManagerAttendanceApi';

export default function ManagerHrPayrollModal() {
  const { showPayrollModal, setShowPayrollModal, savePayroll, saving, staff } = useHrContext();
  const [calcData, setCalcData] = React.useState<{base: number, attDed: number, advAdj: number, net: number} | null>(null);

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<PayrollFormValues>({
    resolver: zodResolver(PayrollSchema),
    defaultValues: EMPTY_PAYROLL_FORM
  });

  const selectedStaffId = watch('staffId');
  const selectedMonth = watch('month');

  useEffect(() => {
    if (showPayrollModal) {
      reset(EMPTY_PAYROLL_FORM);
      setCalcData(null);
    }
  }, [showPayrollModal, reset]);

  useEffect(() => {
    const calculate = async () => {
      if (selectedStaffId && selectedMonth) {
        const s = staff.find(x => String(x.id) === String(selectedStaffId));
        if (!s) return;
        try {
          const res = await attendanceApi.getHistory(String(selectedStaffId), 'STAFF', selectedMonth);
          if (res.success && res.data) {
            const history = res.data;
            const daysInMonth = new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate();
            
            let presentDays = 0;
            for (let i = 1; i <= daysInMonth; i++) {
              const dateStr = `${selectedMonth}-${String(i).padStart(2, '0')}`;
              const record = history.find(r => r.date === dateStr || r.date.startsWith(dateStr));
              if (record && record.status === 'PRESENT') {
                presentDays++;
              }
            }
            
            const baseSalary = s.salary || 0;
            const perDaySalary = baseSalary / daysInMonth;
            const attendanceDeduction = Math.round(perDaySalary * (daysInMonth - presentDays));
            
            let payableAmount = baseSalary - attendanceDeduction;
            let deductedAdvance = 0;
            
            if (s.advanceSalary && s.advanceSalary > 0) {
               deductedAdvance = Math.min(payableAmount, s.advanceSalary);
               payableAmount -= deductedAdvance;
            }
            
            
            setValue('amount', payableAmount);
            setValue('paidAmount', payableAmount);
            setCalcData({ base: baseSalary, attDed: attendanceDeduction, advAdj: deductedAdvance, net: payableAmount });
          }
        } catch (e) {
          // Error handled via toaster in component
        }
      } else if (selectedStaffId) {
        const s = staff.find(x => String(x.id) === String(selectedStaffId));
        if (s) {
          const baseSalary = s.salary || 0;
          let payableAmount = baseSalary;
          let deductedAdvance = 0;
          if (s.advanceSalary && s.advanceSalary > 0) {
             deductedAdvance = Math.min(payableAmount, s.advanceSalary);
             payableAmount -= deductedAdvance;
          }
          setValue('amount', payableAmount);
          setValue('paidAmount', payableAmount);
          setCalcData({ base: baseSalary, attDed: 0, advAdj: deductedAdvance, net: payableAmount });
        }
      }
    };
    calculate();
  }, [selectedStaffId, selectedMonth, staff, setValue]);

  if (!showPayrollModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] bg-card/95 backdrop-blur-xl border border-white/10 motion-safe:animate-in motion-safe:zoom-in-95 duration-200">
        
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
              <label className="text-sm font-semibold text-secondary">Net Payable Amount (₹) <span className="text-danger">*</span></label>
              <input 
                type="number" min="0" onKeyDown={(e) => { if (['e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }}
                {...register('amount', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground transition-all duration-200"
              />
              
              {calcData ? (
                <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs text-secondary">
                    <span>Base Salary</span>
                    <span className="font-medium text-foreground">₹{calcData.base}</span>
                  </div>
                  <div className="flex justify-between text-xs text-danger">
                    <span>Attendance Ded.</span>
                    <span>-₹{calcData.attDed}</span>
                  </div>
                  <div className="flex justify-between text-xs text-warning">
                    <span>Advance Adj.</span>
                    <span>-₹{calcData.advAdj}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-primary">
                    <span>Net Auto-Calculated</span>
                    <span>₹{calcData.net}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-secondary mt-1.5">
                  Amount is automatically calculated when staff and month are selected.
                </p>
              )}
              
              {errors.amount && <p className="text-danger text-xs mt-1.5">{errors.amount.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-secondary">Amount Paying Now (₹) <span className="text-danger">*</span></label>
              <input 
                type="number" min="0" onKeyDown={(e) => { if (['e', 'E', '-', '+'].includes(e.key)) e.preventDefault(); }}
                {...register('paidAmount', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary bg-input text-foreground transition-all duration-200"
              />
              <p className="text-xs text-secondary mt-1.5">
                Set to 0 if you are only recording the payroll and paying later.
              </p>
              {errors.paidAmount && <p className="text-danger text-xs mt-1.5">{errors.paidAmount.message as string}</p>}
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

        <div className="px-8 py-5 border-t border-border flex justify-end gap-3 bg-white/5">
          <button 
            type="button" 
            onClick={() => setShowPayrollModal(false)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-border transition-colors text-secondary hover:bg-white/5 hover:text-foreground"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="payroll-form"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(250,204,21,0.2)] disabled:opacity-70 disabled:hover:scale-100 bg-primary"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" /> : <Check size={16} />}
            {saving ? 'Saving...' : 'Disburse Payroll'}
          </button>
        </div>

      </div>
    </div>
  );
}
