'use client';

import { useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { useMembersContext } from '@/app/manager/members/members_context/ManagerMembersContext';
import { useManagerMembersStore } from '@/app/manager/members/members_store/useManagerMembersStore';
import { MEMBERS_CYCLE_LABELS, getPriceForCycle, formatCurrency } from '@/app/manager/members/members_utils/ManagerMembersSharedConstants';
import type { PlanWithCustom } from '@/app/manager/members/members_types/ManagerMembersTypes';

const RenewSchema = z.object({
  actionType: z.enum(['renew', 'upgrade']).default('renew'),
  planId: z.string().min(1, "Please select a plan"),
  billingCycle: z.string(),
  customDays: z.number().min(1, "Please enter valid days").optional(),
  totalAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0, "Amount must be valid"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  newExpiryDate: z.string()
});

type RenewFormValues = z.infer<typeof RenewSchema>;

const PAYMENT_METHODS = [
  { label: 'UPI', value: 'UPI' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Card', value: 'Card' },
  { label: 'Net Banking', value: 'NetBanking' }
];

export default function ManagerRenewModal() {
  const {
    showRenewModal, setShowRenewModal, selectedMember, renewMember
  } = useMembersContext();

  const plans = useManagerMembersStore(s => s.plans);
  const saving = useManagerMembersStore(s => s.saving);

  const useFormReturn = useForm<RenewFormValues>({
    resolver: zodResolver(RenewSchema) as any,
    defaultValues: {
      actionType: 'renew',
      planId: '',
      billingCycle: 'ONE_MONTH',
      paidAmount: 0,
      paymentMethod: 'UPI',
      newExpiryDate: ''
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useFormReturn;

  useEffect(() => {
    if (showRenewModal && selectedMember) {
      reset({
        actionType: 'renew',
        planId: String(selectedMember.planId || ''),
        billingCycle: selectedMember.billingCycle || 'ONE_MONTH',
        paidAmount: 0,
        paymentMethod: 'UPI',
        newExpiryDate: ''
      });
    }
  }, [showRenewModal, selectedMember, reset]);

  const watchActionType = useWatch({ control: useFormReturn.control, name: 'actionType' }) as 'renew' | 'upgrade';
  const watchPlanId = useWatch({ control: useFormReturn.control, name: 'planId' }) as string;
  const watchBillingCycle = useWatch({ control: useFormReturn.control, name: 'billingCycle' }) as string;
  const watchCustomDays = useWatch({ control: useFormReturn.control, name: 'customDays' }) as number;

  useEffect(() => {
    if (watchPlanId && watchBillingCycle && selectedMember) {
      const selectedPlan = plans.find(p => String(p.id) === String(watchPlanId)) as PlanWithCustom | undefined;
      const price = getPriceForCycle(selectedPlan, watchBillingCycle, Number(watchCustomDays) || 0);
      useFormReturn.setValue('totalAmount', price, { shouldValidate: true });
      useFormReturn.setValue('paidAmount', price, { shouldValidate: true });

      // Calculate new expiry date based on actionType
      const now = new Date();
      let baseDate = now;
      
      if (watchActionType === 'renew') {
        const currentExpiry = new Date(selectedMember.expiryDate);
        baseDate = currentExpiry > now ? currentExpiry : now;
      }
      
      const ed = new Date(baseDate);
      if (watchBillingCycle === 'ONE_MONTH') ed.setMonth(ed.getMonth() + 1);
      else if (watchBillingCycle === 'THREE_MONTHS') ed.setMonth(ed.getMonth() + 3);
      else if (watchBillingCycle === 'SIX_MONTHS') ed.setMonth(ed.getMonth() + 6);
      else if (watchBillingCycle === 'TWELVE_MONTHS') ed.setMonth(ed.getMonth() + 12);
      else if (watchBillingCycle === 'CUSTOM' && watchCustomDays) ed.setDate(ed.getDate() + Number(watchCustomDays));
      
      useFormReturn.setValue('newExpiryDate', ed.toISOString().split('T')[0], { shouldValidate: true });
    }
  }, [watchActionType, watchPlanId, watchBillingCycle, watchCustomDays, plans, selectedMember, useFormReturn]);

  const onSubmit = (data: RenewFormValues) => {
    renewMember({
      planId: data.planId,
      newExpiryDate: data.newExpiryDate,
      amountPaid: data.paidAmount,
      paymentMethod: data.paymentMethod,
      billingCycle: data.billingCycle,
      customDays: data.customDays
    });
  };

  if (!showRenewModal || !selectedMember) return null;

  const selectedPlan = plans.find(p => String(p.id) === String(watchPlanId)) as PlanWithCustom | undefined;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl shadow-black/50 w-full max-w-xl max-h-full overflow-y-auto border-2 border-primary">
        <div className="sticky top-0 px-8 py-5 border-b border-border bg-card flex items-center justify-between z-10">
          <div>
            <h3 className="text-xl font-bold text-foreground">Renew / Upgrade Plan</h3>
            <p className="text-sm text-secondary mt-1">For {selectedMember.name}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowRenewModal(false)}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors text-secondary hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 flex gap-4 p-1.5 bg-input rounded-xl border border-border w-fit">
              <label className={`flex-1 flex text-center cursor-pointer px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${watchActionType === 'renew' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-foreground'}`}>
                <input type="radio" value="renew" {...register('actionType')} className="hidden" />
                Renew Plan
              </label>
              <label className={`flex-1 flex text-center cursor-pointer px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${watchActionType === 'upgrade' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:text-foreground'}`}>
                <input type="radio" value="upgrade" {...register('actionType')} className="hidden" />
                Upgrade Plan
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Plan</label>
              <Controller
                name="planId"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={plans.map(p => ({ value: String(p.id), label: p.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select plan..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Billing Cycle</label>
              <Controller
                name="billingCycle"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={Object.entries(MEMBERS_CYCLE_LABELS).map(([val, label]) => ({ label, value: val }))}
                  />
                )}
              />
            </div>

            {watchBillingCycle === 'CUSTOM' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">Custom Days</label>
                <input
                  type="number"
                  min="0"
                  {...register('customDays', { valueAsNumber: true })}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary ${
                    errors.customDays ? 'border-danger focus-visible:ring-danger' : 'border-border focus-visible:ring-primary'
                  }`}
                />
              </div>
            )}

            {watchPlanId && (
              <div className="sm:col-span-2 bg-primary/10 rounded-xl p-4 text-sm border border-primary/30 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-primary">{watchActionType === 'renew' ? 'Renewal' : 'Upgrade'} Price:</span>
                  <span className="text-primary ml-1 font-bold">
                    {formatCurrency(getPriceForCycle(selectedPlan, watchBillingCycle, Number(watchCustomDays) || 0))}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Amount Paid (₹)</label>
              <input
                type="number"
                min="0"
                {...register('paidAmount', { valueAsNumber: true })}
                className="w-full border rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 bg-input text-primary border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Payment Method</label>
              <Controller
                name="paymentMethod"
                control={useFormReturn.control}
                render={({ field }) => (
                  <SearchableDropdown
                    value={field.value || ''}
                    onChange={field.onChange}
                    options={PAYMENT_METHODS}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-border">
              <label className="block text-sm font-medium text-secondary mb-1.5">New Expiry Date</label>
              <input
                type="date"
                {...register('newExpiryDate')}
                disabled
                className="w-full border rounded-xl px-4 py-3 text-sm font-bold bg-success-bg/20 text-success border-success/30 cursor-not-allowed"
              />
              <p className="text-xs text-secondary mt-1">Calculated automatically from {watchActionType === 'renew' ? (new Date(selectedMember.expiryDate) > new Date() ? 'current expiry date' : 'today') : 'today'}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setShowRenewModal(false)}
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
                <><Save size={16} /> Confirm {watchActionType === 'renew' ? 'Renewal' : 'Upgrade'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
