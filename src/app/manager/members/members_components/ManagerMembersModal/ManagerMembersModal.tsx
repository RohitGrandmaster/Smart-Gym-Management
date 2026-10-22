// RESPONSIBILITY: Renders a modal for creating or editing a member.
'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { MEMBERS_CYCLE_LABELS, getPriceForCycle, formatCurrency, MemberSchema, type MemberFormValues, EMPTY_MEMBER_FORM, GENDER_OPTIONS } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { PlanWithCustom } from '@/app/manager/members/members_types/ManagerMembersTypes';

export default function ManagerMembersModal() {
  const {
    showAddModal, setShowAddModal, editId, editData,
    saveMember
  } = useMembersContext();

  const plans = useManagerMembersStore(s => s.plans);
  const saving = useManagerMembersStore(s => s.saving);

  const useFormReturn = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema) as any,
    defaultValues: editData || EMPTY_MEMBER_FORM
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useFormReturn;

  // Refetch editData into form whenever modal opens for edit
  useEffect(() => {
    if (showAddModal) {
      reset({ ...EMPTY_MEMBER_FORM, ...(editData || {}) });
    }
  }, [showAddModal, editData, reset]);

  const watchPlanId = useWatch({ control: useFormReturn.control, name: 'planId' }) as string;
  const watchBillingCycle = useWatch({ control: useFormReturn.control, name: 'billingCycle' }) as string;
  const watchCustomDays = useWatch({ control: useFormReturn.control, name: 'customDays' }) as number;
  const watchJoinDate = useWatch({ control: useFormReturn.control, name: 'joinDate' }) as string;

  useEffect(() => {
    if (watchPlanId && watchBillingCycle) {
      const selectedPlan = plans.find(p => p.id.toString() === watchPlanId.toString()) as PlanWithCustom | undefined;
      const price = getPriceForCycle(selectedPlan, watchBillingCycle, Number(watchCustomDays) || 0);
      useFormReturn.setValue('totalAmount', price, { shouldValidate: true });
      useFormReturn.setValue('paidAmount', price, { shouldValidate: true }); // Default to fully paid
    }
  }, [watchPlanId, watchBillingCycle, watchCustomDays, plans, useFormReturn]);

  useEffect(() => {
    if (watchJoinDate && watchBillingCycle) {
      const jd = new Date(watchJoinDate);
      if (!isNaN(jd.getTime())) {
        const ed = new Date(jd);
        if (watchBillingCycle === 'ONE_MONTH') ed.setMonth(ed.getMonth() + 1);
        else if (watchBillingCycle === 'THREE_MONTHS') ed.setMonth(ed.getMonth() + 3);
        else if (watchBillingCycle === 'SIX_MONTHS') ed.setMonth(ed.getMonth() + 6);
        else if (watchBillingCycle === 'TWELVE_MONTHS') ed.setMonth(ed.getMonth() + 12);
        else if (watchBillingCycle === 'CUSTOM' && watchCustomDays) ed.setDate(ed.getDate() + Number(watchCustomDays));
        
        useFormReturn.setValue('expiryDate', ed.toISOString().split('T')[0], { shouldValidate: true });
      }
    }
  }, [watchJoinDate, watchBillingCycle, watchCustomDays, useFormReturn]);

  const onSubmit = (data: MemberFormValues) => {
    let payload: Partial<MemberFormValues> & { pendingAmount?: number, advanceAmount?: number } = { ...data };
    if (!editId) {
      const total = data.totalAmount || 0;
      const paid = data.paidAmount || 0;
      if (paid <= total) {
        payload.pendingAmount = total - paid;
        payload.advanceAmount = 0;
      } else {
        payload.pendingAmount = 0;
        payload.advanceAmount = paid - total;
      }
    } else {
      // Remove fields that should not be updated during edit
      delete payload.totalAmount;
      delete payload.paidAmount;
      delete payload.pendingAmount;
      delete payload.joinDate;
      delete payload.expiryDate;
      delete payload.planId;
      delete payload.billingCycle;
      delete payload.customDays;
    }
    saveMember(payload as MemberFormValues);
  };

  if (!showAddModal) return null;

  const selectedPlan = plans.find(p => p.id.toString() === watchPlanId?.toString()) as PlanWithCustom | undefined;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-full overflow-y-auto border-2 border-warning">
        <div className="sticky top-0 px-8 py-5 border-b border-border bg-card flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-foreground">{editId ? 'Edit Member' : 'Add New Member'}</h3>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors text-secondary hover:text-primary"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma', fullWidth: true },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'rahul@gmail.com' },
              { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
              { label: 'Aadhaar No.', key: 'aadhaar', type: 'tel', placeholder: '123456789012' },
              { label: 'Address', key: 'address', type: 'text', placeholder: 'Andheri, Mumbai', fullWidth: true },
            ].map(f => (
              <div key={f.key} className={f.fullWidth ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-medium text-secondary mb-0.5">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  maxLength={f.key === 'aadhaar' ? 12 : f.type === 'tel' ? 10 : undefined}
                  onKeyDown={f.type === 'tel' ? (e) => { 
                    if (['e', 'E', '-', '+', '.'].includes(e.key)) e.preventDefault(); 
                    if (e.key.length === 1 && !/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey) e.preventDefault(); 
                  } : undefined}
                  {...register(f.key as keyof MemberFormValues)}
                  className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${
                    errors[f.key as keyof MemberFormValues] ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
                {errors[f.key as keyof MemberFormValues] && (
                  <p className="text-danger text-xs mt-1.5">{errors[f.key as keyof MemberFormValues]?.message as string}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Gender</label>
              <Controller
                name="gender"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={GENDER_OPTIONS}
                  />
                )}
              />
            </div>
            
            {editId && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-0.5">Member Status</label>
                <Controller
                  name="status"
                  control={useFormReturn.control}
                  render={({ field }) => (
                    <SearchableDropdown
                      value={field.value || 'ACTIVE'}
                      onChange={field.onChange}
                      options={[
                        { label: 'Active', value: 'ACTIVE' },
                        { label: 'Pending', value: 'PENDING' },
                        { label: 'Expired', value: 'EXPIRED' },
                        { label: 'Frozen', value: 'FROZEN' },
                        { label: 'Suspended', value: 'SUSPENDED' },
                        { label: 'Banned', value: 'BANNED' }
                      ]}
                    />
                  )}
                />
              </div>
            )}

            <div className={editId ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-secondary mb-0.5">Plan</label>
              <Controller
                name="planId"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={plans.map(p => ({ value: p.id, label: p.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select plan..."
                    disabled={!!editId}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Billing Cycle</label>
              <Controller
                name="billingCycle"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={Object.entries(MEMBERS_CYCLE_LABELS).map(([val, label]) => ({ label, value: val }))}
                    disabled={!!editId}
                  />
                )}
              />
            </div>
            {watchBillingCycle === 'CUSTOM' && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-0.5">Custom Days</label>
                <input
                  type="number"
                  min="0"
                  readOnly={!!editId}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                  {...register('customDays')}
                  placeholder="e.g. 15"
                  className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${
                    errors.customDays ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  } ${editId ? 'opacity-80 cursor-not-allowed' : ''}`}
                />
                {errors.customDays && (
                  <p className="text-danger text-xs mt-0.5">{errors.customDays?.message as string}</p>
                )}
              </div>
            )}

            {watchPlanId && (
              <div className="sm:col-span-2 bg-warning-bg rounded-xl p-4 text-sm border border-warning/30 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-warning">Calculated Price:</span>
                  <span className="text-warning ml-1 font-bold">
                    {formatCurrency(getPriceForCycle(selectedPlan, watchBillingCycle, Number(watchCustomDays) || 0))}
                  </span>
                </div>
                {watchBillingCycle === 'CUSTOM' && (
                  <div className="text-warning text-xs opacity-80">
                    (Per Day: {formatCurrency(selectedPlan?.priceCustom || 0)} × {watchCustomDays || 0} days)
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Join Date</label>
              <input
                type="date"
                readOnly={!!editId}
                {...register('joinDate')}
                className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${editId ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Expiry Date</label>
              <input
                type="date"
                readOnly
                {...register('expiryDate')}
                className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none bg-input text-primary transition-all duration-200 opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Total Plan Amount (₹)</label>
              <input
                type="number"
                readOnly
                {...register('totalAmount', { valueAsNumber: true })}
                className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none bg-input opacity-80 cursor-not-allowed text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-0.5">Amount Paid (₹)</label>
              <input
                type="number"
                min="0"
                readOnly={!!editId}
                onKeyDown={(e) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); }}
                {...register('paidAmount', { valueAsNumber: true })}
                className={`w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 ${editId ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-secondary mb-0.5">Medical History / Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Asthma, Knee injury, High BP..."
                {...register('medicalHistory')}
                className="w-full border rounded-xl px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary transition-all duration-200 border-border focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-border text-secondary hover:bg-primary/5 hover:text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 bg-primary"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
              ) : (
                <><Save size={16} /> {editId ? 'Update' : 'Add Member'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
